import { fetchEnvVar } from "./utils/envUtil";
import * as apiUtil from "./utils/apiUtil";

const RUN_DELAY_SECONDS: number = parseInt(fetchEnvVar("RUN_DELAY_SECONDS"));

const delay = (s: number) => {
  const ms = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Compares current installed version to latest available
export function isUsingLatestVersion(dependency: dependency): boolean {
  let currentVersionArray = toVersionIntArray(dependency.version);
  let latestVersionArray = toVersionIntArray(dependency.latest_version);

  for (let i = 0; i < currentVersionArray.length; i++) {
    if (currentVersionArray[i] !== latestVersionArray[i]) {
      return false;
    }
  }
  return true;
}

// Return how long a version has been available for
export function howOutOfDate(releaseDate: Date | number): number {
  // https://stackoverflow.com/questions/2627650/why-javascript-gettime-is-not-a-function
  let currentDate = new Date().getTime();
  return currentDate - new Date(releaseDate).getTime();
}

// Splits version into an array e.g. '2.1.0' => ['2','1','0']
// https://stackoverflow.com/questions/9914216/how-do-i-separate-an-integer-into-separate-digits-in-an-array-in-javascript
const toVersionIntArray = (version: string): number[] => {
  return version
    .toString()
    .split(".")
    .map(function (t) {
      return parseInt(t);
    });
};

(async () => {
  while (true) {
    // Get all users then for each one
    const userIds: string[] = await apiUtil.getAllUserIds();
    userIds.forEach(async (uid) => {
      let totalDependencies: number = 0;
      let greenDependencies: number = 0;
      let yellowDependencies: number = 0;
      let redDependencies: number = 0;

      let totalProjects: number = 0;
      let greenProjects: number = 0;
      let yellowProjects: number = 0;
      let redProjects: number = 0;

      // Get all projects
      const projects: Project[] = await apiUtil.getAllProjectsForUser(uid);

      // Tally up total projects
      totalProjects = projects.length;

      projects.forEach((project) => {
        let projTotalDeps: number = 0;
        let projGreenDeps: number = 0;
        let projYellowDeps: number = 0;
        let projRedDeps: number = 0;

        project.projectDependencies.directDependencies.forEach((dependency) => {
          // Add dependencies to total / green / yellow / red tallies
          const dateDiff = howOutOfDate(dependency.next_release_date);

          totalDependencies++;
          projTotalDeps++;

          switch (true) {
            case isUsingLatestVersion(dependency):
              greenDependencies++;
              projGreenDeps++;
              break;
            case dateDiff > project.redWarningPeriod:
              redDependencies++;
              projRedDeps++;
              break;
            case dateDiff > project.yellowWarningPeriod:
              yellowDependencies++;
              projYellowDeps++;
          }
        });

        if (projTotalDeps > 0) {
          switch (true) {
            case projRedDeps > 0:
              redProjects++;
              break;
            case projYellowDeps > 0:
              yellowProjects++;
              break;
            case projGreenDeps > 0:
              greenProjects++;
          }
        } else {
          greenProjects++;
        }
      });
      // update metrics with tally amounts
      console.log(`Updating metrics for user ${uid}`);
      await apiUtil.updateMetrics(uid, {
        totalProjects: totalProjects,
        greenProjects: greenProjects,
        yellowProjects: yellowProjects,
        redProjects: redProjects,
      });
      /*       await apiUtil.createMetricEntry(
        uid, 
        "totalDependencies",
        new Date().getTime(),
        totalDependencies
      )
      await apiUtil.createMetricEntry(
        uid, 
        "greenDependencies",
        new Date().getTime(),
        greenDependencies
      )
      await apiUtil.createMetricEntry(
        uid, 
        "yellowDependencies",
        new Date().getTime(),
        yellowDependencies
      )
      await apiUtil.createMetricEntry(
        uid, 
        "redDependencies",
        new Date().getTime(),
        redDependencies
      ) */
    });

    // wait x seconds
    await delay(RUN_DELAY_SECONDS);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

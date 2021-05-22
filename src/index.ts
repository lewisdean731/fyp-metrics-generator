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
    await getAllProjectIds()
      .then(async (data) => {
        console.log(JSON.stringify(data));
        data.projectIds.forEach(async (id) => {
          console.log(`Publishing message for project ${id}`);
        });
      })
      .catch((error) => {
        console.log(error);
      });

    await delay(RUN_DELAY_SECONDS);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { fetchEnvVar } from "./utils/envUtil";
import { getAllProjectIds } from "./utils/apiUtil";
import { publishMessage } from "./utils/pubsubUtil";

const RUN_DELAY_SECONDS: number = parseInt(fetchEnvVar("RUN_DELAY_SECONDS"));

const delay = (s: number) => {
  const ms = s * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

(async () => {
  while (true) {
    await getAllProjectIds()
      .then(async (data) => {
        console.log(JSON.stringify(data));
        data.projectIds.forEach(async (id) => {
          console.log(`Publishing message for project ${id}`);
          await publishMessage(id);
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

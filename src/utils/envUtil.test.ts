import { fetchEnvVar } from "./envUtil";

process.env.REAL_ENV_VAR = "1234";

describe("fetchEnvVar", () => {
  test("fetches environment variable", () => {
    expect(fetchEnvVar("REAL_ENV_VAR")).toEqual("1234");
  });

  // if the function is going to be invoked it has to be wrapped in another
  // function call, otherwise the error will be thrown unexpectedly.
  test("throws error when env var does not exist", () => {
    expect(() => fetchEnvVar("FAKE_ENV_VAR")).toThrowError(
      "Environment variable not found! (FAKE_ENV_VAR)"
    );
  });
});

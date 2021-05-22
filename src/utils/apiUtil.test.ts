import getAllProjectIds, { asyncGetRequest } from "./apiUtil";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

process.env.API_ENDPOINT = "http://fakehost:1234/api";
process.env.API_KEY = "apikey123";

describe("asyncGetRequest", () => {
  test("returns a 200 when authorised", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        status: 200,
      })
    );

    await asyncGetRequest("fakeUrl").then((response) =>
      expect(response.status).toEqual(200)
    );
  });

  test("returns a 401 when unauthorised", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.reject({
        status: 401,
      })
    );

    await asyncGetRequest("fakeUrl").catch((error) =>
      expect(error.status).toEqual(401)
    );
  });
});

describe("getAllProjectIds", () => {
  test("returns a list of project IDs", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          projectIds: ["1234", "5678"],
        },
      })
    );

    const data = await getAllProjectIds();
    expect(data).toEqual({ projectIds: ["1234", "5678"] });
  });

  test("throws an error when there is an issue getting the IDs", async () => {
    mockedAxios.get.mockImplementation(() => Promise.reject("Server error"));

    await getAllProjectIds().catch((error) =>
      expect(error).toMatchObject(new Error("Server error"))
    );
  });
});

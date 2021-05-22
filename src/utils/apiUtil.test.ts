import * as apiHelper from "./apiUtil";
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

    await apiHelper.asyncGetRequest("fakeUrl").then((response) =>
      expect(response.status).toEqual(200)
    );
  });

  test("returns a 401 when unauthorised", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.reject({
        status: 401,
      })
    );

    await apiHelper.asyncGetRequest("fakeUrl").catch((error) =>
      expect(error.status).toEqual(401)
    );
  });
});

describe("asyncPutRequest", () => {
  test("should return a 200 when authorised and data OK", async () => {
    mockedAxios.put.mockImplementation(() => Promise.resolve({ status: 200 }));

    apiHelper
      .asyncPutRequest("api/fakeurl", { data: "data" })
      .then((response) => expect(response.status).toBe(200));
  });
  test("should throw a 401 when unauthorised / no auth given", async () => {
    mockedAxios.put.mockImplementation(() => Promise.reject({ status: 401 }));

    apiHelper
      .asyncPutRequest("api/fakeurl", { data: "data" })
      .catch((error) => expect(error.status).toBe(401));
  });
});

describe("getAllProjectIds", () => {
  test("returns a list of project IDs", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          userIds: ["1234", "5678"],
        },
      })
    );

    const data = await apiHelper.getAllUserIds();
    expect(data).toEqual({ userIds: ["1234", "5678"] });
  });

  test("throws an error when there is an issue getting the IDs", async () => {
    mockedAxios.get.mockImplementation(() => Promise.reject("Server error"));

    await apiHelper.getAllUserIds().catch((error) =>
      expect(error).toMatchObject(new Error("Server error"))
    );
  });
});

describe("createMetricEntry", () => {
  test("should return a 200 on notification created successfully", async () => {
    mockedAxios.put.mockImplementation(() =>
      Promise.resolve({
        status: 200,
      })
    );

    await apiHelper.createMetricEntry("uid", "metricA", 0, 0)
      .then((response) => expect(response.status).toBe(200));
  });

  test("throws an error when notification not created", async () => {
    mockedAxios.put.mockImplementation(() =>
      Promise.reject({
        status: 500,
        message: "example error occured",
      })
    );

    await apiHelper.createMetricEntry("uid", "metricA", 0, 0)
    .catch((error) => {
      expect(error.status).toBe(500);
      expect(error.message).toBe("example error occured");
    });
  });
});
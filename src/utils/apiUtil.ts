import axios, { AxiosResponse } from "axios";
import { fetchEnvVar } from "./envUtil";

export const asyncGetRequest = async (
  url: string,
  params?: string[]
): Promise<AxiosResponse> => {
  console.log(`GET ${url}`);
  return await axios
    .get(url, { params: { ...params, apiKey: fetchEnvVar("API_KEY") } })
    .then((response) => {
      return response;
    });
};

export const asyncPutRequest = async (
  url: string,
  data: object
): Promise<AxiosResponse> => {
  console.log(`PUT ${url}`);
  return await axios
    .put(url, data, { params: { apiKey: fetchEnvVar("API_KEY") } })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAllUserIds = async (): Promise<string[]> => {
  return await asyncGetRequest(
    `${fetchEnvVar("API_ENDPOINT")}/getAllUserIds`
  )
    .then((response) => {
      return response.data.userIds;
    })
    .catch((error) => {
      console.log(error.message);
      throw new Error(error);
    });
};

export const getAllProjectsForUser = async (uid: string): Promise<Project[]> => {
  return await asyncGetRequest(
    `${fetchEnvVar("API_ENDPOINT")}/getAllProjectsForUser?uid=${uid}`
  )
    .then((response) => {
      return response.data.projectsData;
    })
    .catch((error) => {
      console.log(error.message);
      throw new Error(error);
    });
};

export const createMetricEntry = async (
  uid: string, 
  metricName: string,
  timestamp: number, 
  value: number
): Promise<AxiosResponse> => {
  return await asyncPutRequest(
    `${fetchEnvVar("API_ENDPOINT")}/metric/${uid}`,
    {
      metricName: metricName,
      timestamp: timestamp,
      value: value
    }
  )
}
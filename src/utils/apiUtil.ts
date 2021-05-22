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
  return await axios
    .put(url, data, { params: { apiKey: fetchEnvVar("API_KEY") } })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const getAllProjectIds = async (): Promise<{ projectIds: string[] }> => {
  return await asyncGetRequest(
    `${fetchEnvVar("API_ENDPOINT")}/getAllProjectIds`
  )
    .then((response) => {
      return response.data;
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
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

export default getAllProjectIds;

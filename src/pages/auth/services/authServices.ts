import apiClient from "@/api/apiClient";
import type {
  ChangePasswordPayload,
  ILoginCredentials,
} from "../types/authTypes";

export const sendLogin = async (credentials: ILoginCredentials) => {
  const { data } = await apiClient.post(
    "/spain/portal/auth/login",
    credentials,
  );
  return data;
};

export const changePortalPassword = async (payload: ChangePasswordPayload) => {
  const { data } = await apiClient.patch("/spain/portal/auth/password", payload);
  return data;
};

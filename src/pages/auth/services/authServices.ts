import type { ILoginCredentials } from "../types/authTypes";

export const sendLogin = async (_credentials: ILoginCredentials) => {
  void _credentials;
  throw new Error("Login no implementado en este portal base");
};

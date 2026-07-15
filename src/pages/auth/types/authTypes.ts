export interface ILoginCredentials {
  email: string;
  password: string;
}

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

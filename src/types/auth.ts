export type LoginBodyBase = {
  email: string;
  password: string;
};

export type Role = "PROJECT_ADMIN" | "SUPER_ADMIN" | "USER";

export type LoginBodyExtended = LoginBodyBase & {
  name: string;
  role: Role;
  validForCreation: boolean;
};

export type LoginResponse = {
  token: string;
};

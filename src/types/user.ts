export type Role = "PROJECT_ADMIN";

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role: Role;
  validForCreation: boolean; // sempre true
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

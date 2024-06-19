import { TUser } from '../users/services/user.model';

export type TLoginInput = {
  userNameOrEmail: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TRegisterInput = {
  fullName: string;
  emailAddress: string;
  password: string;
  userName: string;
  phoneNumber?: string;
};

export type TRefreshTokenInput = {
  refreshToken: string;
};

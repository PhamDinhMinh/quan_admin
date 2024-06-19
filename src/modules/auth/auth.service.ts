import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/configs/constants';
import httpService from '@/shared/http-service';

import { TUser } from '../users/services/user.model';
import { TLoginInput, TLoginResponse, TRegisterInput } from './auth.model';

class AuthService {
  public async login(input: TLoginInput) {
    const result = await httpService.requestNoAuth<TLoginResponse>({
      url: '/api/services/app/Authentication/Login',
      method: 'POST',
      data: input,
    });

    Cookies.set(ACCESS_TOKEN_KEY, result.accessToken);
    Cookies.set(REFRESH_TOKEN_KEY, result.refreshToken);

    return this.getMe();
  }

  async register(input: TRegisterInput) {
    const isSuccess = await httpService.requestNoAuth<boolean>({
      url: '/api/services/app/Authentication/Register',
      method: 'POST',
      data: input,
    });

    if (isSuccess) {
      return this.login({
        userNameOrEmail: input.userName ?? input.emailAddress,
        password: input.password,
      });
    } else {
      return null;
    }
  }

  async getMe() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new Error('Access token is not found');
    }

    return await httpService.request<TUser>({
      url: '/api/services/app/Authentication/GetUserInfo',
      method: 'GET',
    });
  }

  async logout() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }
}

const authService = new AuthService();

export default authService;

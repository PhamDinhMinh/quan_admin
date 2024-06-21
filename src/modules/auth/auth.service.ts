import Cookies from 'js-cookie';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/configs/constants';
import httpService from '@/shared/http-service';

import { TUser } from '../users/services/user.model';
import { TLoginInput, TLoginResponse, TRegisterInput } from './auth.model';

class AuthService {
  public async login(input: TLoginInput) {
    const result = await httpService.requestNoAuth<TLoginResponse>({
      url: '/api/user/login',
      method: 'POST',
      data: input,
      contentType: 'application/json',
    });

    Cookies.set(ACCESS_TOKEN_KEY, result.token);
    Cookies.set(REFRESH_TOKEN_KEY, result.token);

    return this.getMe();
  }

  async getTokenCsrf() {
    return await httpService.requestNoAuth({
      url: '/api/csrf-token',
      method: 'GET',
    });
  }

  async getMe() {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      throw new Error('Access token is not found');
    }

    return await httpService.request<TUser>({
      url: '/api/user/me',
      method: 'GET',
    });
  }

  async logout() {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  }

  async register(input: TRegisterInput) {
    const isSuccess = await httpService.requestNoAuth<boolean>({
      url: '/api/services/app/Authentication/Register',
      method: 'POST',
      data: input,
    });

    if (isSuccess) {
      return this.login({
        email: input.userName ?? input.emailAddress,
        password: input.password,
      });
    } else {
      return null;
    }
  }
}

const authService = new AuthService();

export default authService;

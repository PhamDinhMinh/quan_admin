import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { IUserInfoDetail, TUpdateUserDto, TUser } from './user.model';

class UserService {
  endpoint = '/api/user';

  getListUser(input: { skipCount?: number; maxResultCount?: number }) {
    return httpService.request<TPaginated<TUser>>({
      url: this.endpoint + '',
      method: 'GET',
      params: input,
    });
  }

  getUser(id: number) {
    return httpService.request<{ data: IUserInfoDetail }>({
      url: this.endpoint + '/with-info',
      method: 'GET',
      params: {
        id: id,
      },
    });
  }

  create(input: any) {
    return httpService.request<any>({
      url: this.endpoint,
      method: 'POST',
      data: input,
    });
  }

  updateUser(id: number, input: TUpdateUserDto) {
    return httpService.request<TUser>({
      url: this.endpoint,
      method: 'PUT',
      data: input,
      params: { userId: id },
    });
  }

  deleteUser(id: number) {
    return httpService.request<void>({
      url: this.endpoint,
      method: 'DELETE',
      params: {
        id: id,
      },
    });
  }
}

const userService = new UserService();
export default userService;

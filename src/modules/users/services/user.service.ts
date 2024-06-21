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

  updateUser(id: number, input: TUpdateUserDto) {
    return httpService.request<TUser>({
      url: this.endpoint + '/UpdateForAdmin',
      method: 'PUT',
      data: {
        ...input,
        id: id,
      },
    });
  }

  deleteUser(id: number) {
    return httpService.request<void>({
      url: this.endpoint + '/Delete',
      method: 'DELETE',
      params: {
        id: id,
      },
    });
  }
}

const userService = new UserService();
export default userService;

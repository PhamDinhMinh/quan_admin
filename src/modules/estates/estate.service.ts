import httpService from '@/shared/http-service';
import { TPaginated } from '@/shared/types/paginated.type';

import { TCreateEstateDto } from './dto/create-estate.dto';
import { TGetListEstateDto } from './dto/get-list-estate.dto';
import { TEstateBasic, TEstateDetail } from './estate.model';

class EstateService {
  getList(input: TGetListEstateDto) {
    return httpService.request<TPaginated<TEstateBasic>>({
      url: '/api/estates/admin',
      method: 'GET',
      params: input,
    });
  }

  getDetail(id: number) {
    return httpService.request<TEstateDetail>({
      url: `/api/estates/admin/${id}`,
      method: 'GET',
    });
  }

  create(input: TCreateEstateDto) {
    return httpService.request<TEstateBasic>({
      url: '/api/estates/admin',
      method: 'POST',
      data: input,
    });
  }

  update(id: number, input: TEstateDetail) {
    return httpService.request<TEstateBasic>({
      url: `/api/estates/admin/${id}`,
      method: 'PUT',
      data: input,
    });
  }

  delete(id: number) {
    return httpService.request<void>({
      url: `/api/estates/admin/${id}`,
      method: 'DELETE',
    });
  }

  deleteMany(ids: number[]) {
    return httpService.request<void>({
      url: '/api/estates/admin/delete-many',
      method: 'DELETE',
      data: ids,
    });
  }
}

export default new EstateService();

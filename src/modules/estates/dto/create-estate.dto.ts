import { EEstateType } from '../estate.model';

export type TCreateEstateDto = {
  name: string;
  description?: string;
  imageUrls?: string[];
  type: EEstateType;
};

import { EEstateType } from '../estate.model';

export type TUpdateEstateDto = {
  name: string;
  description?: string;
  imageUrls?: string[];
  type?: EEstateType;
};

export enum EProjectStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum EEstateMemberRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export type TEstateMember = {
  userId: number;
  role: EEstateMemberRole;
  nickname?: string;
};

export enum EEstateType {
  DEFAULT = 'DEFAULT',
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  COMMERCIAL = 'COMMERCIAL',
  SCHOOL = 'SCHOOL',
}

export type TEstateBasic = {
  id: number;
  name: string;
  description?: string;
  imageUrls?: string[];
  type: EEstateType;
  role: EEstateMemberRole;
  members: EEstateMemberRole[];
  createdAt: Date;
};

export type TEstateDetail = TEstateBasic;

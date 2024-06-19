export type TUser = {
  id: number;
  userName: string;
  name: string;
  emailAddress: string;
  phoneNumber?: string;
  creationTime: string;
  role?: string;
  dateOfBirth?: any;
  gender?: string;
  imageUrl?: string;
  coverAvatarUrl?: string;
};

export type TUpdateUserDto = {
  gender?: string;
  emailAddress?: string;
  name?: string;
  phoneNumber?: string;
  dateOfBirth?: any;
};

export enum EUserGender {
  MALE = 'Nam',
  FEMALE = 'Nữ',
  OTHER = 'Khác',
}

export enum EUserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

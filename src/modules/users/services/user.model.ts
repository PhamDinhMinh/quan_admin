export type TUser = {
  admin_id: 42;
  agent_id: null | number;
  device_id: null | number;
  email: string;
  id: 963;
  role: string;
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
  ADMIN = 'admin',
  AGENT = 'agent',
  USER = 'user',
}

export interface IUserInfoDetail {
  adminInfo: {
    id: number;
    user_id: number;
    channel_link: string;
    contact_info: string;
  };
  agentInfo: any;
  device_id: null | number;
  email: string;
  id: number;
  role: string;
}

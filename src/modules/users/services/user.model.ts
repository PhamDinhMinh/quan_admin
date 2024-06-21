export type TUser = {
  admin_id: 42;
  agent_id: null | number;
  device_id: null | number;
  email: string;
  id: 963;
  role: string;
};

export type TUpdateUserDto = {
  role?: string;
  email?: string;
  agentId?: number | null;
  adminId?: number | null;
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

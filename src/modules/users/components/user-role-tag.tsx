import { Tag } from 'antd';
import { useMemo } from 'react';

import { EUserRole } from '../services/user.model';

const UserRoleTag = ({ role }: { role: string }) => {
  const color = useMemo<string>(() => {
    switch (role) {
      case EUserRole.ADMIN:
        return 'blue';
      case EUserRole.USER:
        return 'cyan';
      default:
        return 'darkOliveGreen';
    }
  }, [role]);

  return <Tag color={color}>{role}</Tag>;
};

export default UserRoleTag;

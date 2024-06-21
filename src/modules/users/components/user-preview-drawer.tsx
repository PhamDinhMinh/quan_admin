import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Skeleton } from 'antd';
import { useMemo } from 'react';

import userService from '../services/user.service';
import UserRoleTag from './user-role-tag';

type TUserPreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const UserPreviewDrawer: React.FC<TUserPreviewProps> = ({
  open,
  setOpen,
  id,
}: TUserPreviewProps) => {
  const { data: getUserById, isLoading } = useQuery({
    queryKey: ['/get-user-by-id', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  const userInfo = useMemo(
    () => getUserById?.data?.user ?? [],
    [getUserById?.data?.user],
  );

  console.log(userInfo);

  return (
    <Drawer
      title={'Thông tin chi tiết'}
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{'Huỷ'}</Button>}
    >
      {isLoading ? (
        <Skeleton />
      ) : !getUserById?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={1}
          title={'Thông tin chi tiết'}
          items={[
            {
              label: 'ID',
              span: 2,
              children: userInfo?.id,
            },
            {
              label: 'Channel_ admin',
              span: 1,
              children: userInfo?.adminInfo?.channel_link,
            },
            {
              label: 'Thông tin liên hệ',
              span: 2,
              children: userInfo?.adminInfo?.contact_info,
            },
            {
              label: 'Id thiết bị',
              span: 1,
              children: userInfo?.device_id,
            },
            {
              label: 'Email',
              span: 1,
              children: userInfo?.email,
            },
            {
              label: 'Quyền',
              span: 2,
              children: userInfo?.role && (
                <UserRoleTag key={userInfo?.role} role={userInfo?.role} />
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default UserPreviewDrawer;

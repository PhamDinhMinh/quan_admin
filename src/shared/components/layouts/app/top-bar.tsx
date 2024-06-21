import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  UnlockFilled,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  MenuProps,
  Space,
  Switch,
} from 'antd';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import useApp from '@/hooks/use-app';
import { useAppStore } from '@/modules/app/app.zustand';
import authService from '@/modules/auth/auth.service';
import { useAuthStore } from '@/modules/auth/auth.zustand';
import { TST } from '@/shared/types/tst.type';

type TMainTopBarProps = {
  collapsed: boolean;
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
};

const MainTopBar = ({ collapsed, setCollapse }: TMainTopBarProps) => {
  const { t, isDarkTheme, token } = useApp();

  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      navigate({
        to: '/auth/login',
      });
    },
    onError: () => {
      setUser(null);
      navigate({
        to: '/auth/login',
      });
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const dropItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: 'logout',
        icon: <UnlockFilled />,
        label: <span onClick={() => handleLogout()}>{t('Logout')}</span>,
      },
    ],
    [t, handleLogout],
  );

  return (
    <SHeader
      className={`flex p-0 top-0 z-1 sticky w-full items-center `}
      style={{
        background: token.colorBgContainer,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapse(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      />

      <SFlexGrowMax />

      <Space style={{ marginRight: token.margin }}>
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={isDarkTheme}
          onChange={() => toggleTheme()}
        />

        <Dropdown
          trigger={['click']}
          menu={{ items: dropItems }}
          placement="bottomRight"
        >
          <SAvatar token={token} size={48}>
            {user?.role.charAt(0)}
          </SAvatar>
        </Dropdown>
      </Space>
    </SHeader>
  );
};

export default MainTopBar;

const SHeader = styled(Layout.Header)`
  display: flex;
  padding: 0;
  top: 0;
  z-index: 1;
  position: sticky;
  width: 100%;
  align-items: center;
`;

const SAvatar = styled(Avatar)<TST>`
  cursor: pointer;
  border: 2px solid ${({ token }) => token.colorBorder};
`;

const SFlexGrowMax = styled.div`
  flex: 1;
`;

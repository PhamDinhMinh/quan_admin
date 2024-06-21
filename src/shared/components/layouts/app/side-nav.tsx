import { useNavigate } from '@tanstack/react-router';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { UserCog } from 'lucide-react';
import { useMemo } from 'react';
import { useLocation } from 'react-use';
import styled from 'styled-components';

import { APP_NAME, SIDE_NAV_WIDTH } from '@/configs/constants';
import useApp from '@/hooks/use-app';
import { TST } from '@/shared/types/tst.type';

type TMainSideNavProps = {
  collapsed: boolean;
  setCollapsed: (_collapsed: boolean) => void;
};

const MainSideNav = ({ collapsed, setCollapsed }: TMainSideNavProps) => {
  const { token, isDarkTheme } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuProps['items'] = useMemo(
    () => [
      {
        key: '/user-setting',
        icon: <UserCog size={18} />,
        label: 'Quản lý người dùng',
      },
    ],
    [],
  );

  const onClick: MenuProps['onClick'] = (e) => {
    navigate({
      to: e.key,
    });
  };

  return (
    <Layout.Sider
      width={SIDE_NAV_WIDTH}
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme={isDarkTheme ? 'light' : 'dark'}
    >
      <LogoWrapper
        token={token}
        style={{ marginLeft: 5, marginRight: 5 }}
        onClick={() => navigate({ to: '/' })}
      >
        <img
          src="/assets/images/logo.png"
          alt="logo"
          width={70 - token.padding}
          style={{
            background: `linear-gradient(45deg, ${token.colorPrimary}, ${token.colorWhite})`,
            padding: collapsed ? token.padding : (token.padding * 3) / 4,
            borderRadius: token.borderRadius,
            transition: 'ease-in-out 1s',
            marginRight: collapsed ? 0 : (token.margin * 3) / 4,
          }}
        />

        {!collapsed && (
          <Typography.Text
            style={{
              color: token.colorWhite,
              fontSize: token.fontSizeHeading5,
              fontWeight: token.fontWeightStrong,
            }}
          >
            {APP_NAME}
          </Typography.Text>
        )}
      </LogoWrapper>

      <Menu
        onClick={onClick}
        theme={isDarkTheme ? 'light' : 'dark'}
        mode="inline"
        items={items}
        selectedKeys={[location.pathname as string]}
        style={{ borderInlineEnd: 'none', paddingLeft: 10, paddingRight: 10 }}
      />
    </Layout.Sider>
  );
};

export default MainSideNav;

const LogoWrapper = styled.div<TST>`
  cursor: pointer;
  width: 100%;
  padding: ${(props) => props.token.padding / 2}px;
  display: flex;
  align-items: center;
`;

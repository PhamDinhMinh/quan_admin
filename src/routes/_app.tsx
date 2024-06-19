import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout, theme } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAuth } from '@/hooks/use-auth';
import MainSideNav from '@/shared/components/layouts/app/side-nav';
import MainTopBar from '@/shared/components/layouts/app/top-bar';
import { TST } from '@/shared/types/tst.type';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const navigate = useNavigate();

  const { token } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const authQuery = useAuth();

  useEffect(() => {
    if (authQuery.isError) {
      navigate({ to: '/auth/login' });
    }
  }, [authQuery, navigate]);

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <MainSideNav collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <MainTopBar collapsed={collapsed} setCollapse={setCollapsed} />

        <SContent token={token} className="main-content">
          <Outlet />
        </SContent>
      </Layout>
    </Layout>
  );
}

// export default MainTemplate;

const SContent = styled(Layout.Content)<TST>`
  margin: ${({ token }) => token.margin}px;
  padding: ${({ token }) => token.padding}px;
  background-color: ${({ token }) => token.colorBgContainer};
  border-radius: ${({ token }) => token.borderRadius}px;
  height: calc(100vh - 64px - 2 * ${({ token }) => token.margin}px);
  overflow-y: scroll;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
`;

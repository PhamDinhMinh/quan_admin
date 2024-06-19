import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout } from 'antd';
import { useEffect } from 'react';

import { useAuth } from '@/hooks/use-auth';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const authQuery = useAuth();

  useEffect(() => {
    if (authQuery.isSuccess) {
      navigate({
        to: '/',
      });
    }
  }, [authQuery, navigate]);

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

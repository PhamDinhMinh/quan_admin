import { UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { App, Button, Form, Input, Layout, Typography } from 'antd';
import { AxiosError } from 'axios';
import { LockKeyhole } from 'lucide-react';

import { useAppStore } from '@/modules/app/app.zustand';
import { TLoginInput } from '@/modules/auth/auth.model';
import authService from '@/modules/auth/auth.service';
import { THttpResponse } from '@/shared/http-service';
import { transApiResDataCode } from '@/shared/utils';
import { color } from '@/style/global-styles';

export const Route = createFileRoute('/_auth/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const setLoading = useAppStore((state) => state.setLoading);

  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const [form] = Form.useForm<TLoginInput>();

  const loginMutation = useMutation({
    mutationFn: (input: TLoginInput) => authService.login(input),
    onSuccess: () => {
      notification.success({
        message: 'Đăng nhập thành công',
      });
      queryClient.refetchQueries({ queryKey: ['auth/getMe'] });
      setLoading(false);
    },
    onError: (error: AxiosError<THttpResponse<null>>) => {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: transApiResDataCode(error.response?.data),
      });
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const onFinish = async (data: TLoginInput) => {
    loginMutation.mutate(data);
    setLoading(true);
  };

  const onFinishFailed = () => {
    notification.error({
      message: 'Đăng nhập thất bại',
      description: 'Làm ơn liên hệ với quản trị viên',
    });
  };

  return (
    <>
      <Layout.Content
        style={{
          height: '100vh',
          backgroundImage: `url('https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 200, 0.5)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            minWidth: '35%',
          }}
        >
          <Typography.Title
            level={2}
            style={{ color: color.grey_800, textAlign: 'center' }}
          >
            Đăng nhập
          </Typography.Title>

          <Form
            form={form}
            layout="vertical"
            size="large"
            style={{ width: '100%' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item<TLoginInput>
              name="userNameOrEmail"
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc',
                },
              ]}
            >
              <Input
                placeholder="Tên đăng nhập hoặc email"
                prefix={<UserOutlined />}
                // variant="filled"
              />
            </Form.Item>

            <Form.Item<TLoginInput>
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Trường này là bắt buộc',
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                prefix={<LockKeyhole size={18} />}
              />
            </Form.Item>

            <Typography
              style={{
                textAlign: 'end',
                cursor: 'pointer',
                marginBottom: 20,
                color: '#fff',
              }}
            >
              Quên mật khẩu?
            </Typography>
            <Form.Item>
              <Button
                style={{ width: '100%', backgroundColor: color.green_500 }}
                type="primary"
                htmlType="submit"
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout.Content>
    </>
  );
}

export default LoginPage;

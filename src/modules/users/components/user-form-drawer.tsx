import { useMutation, useQuery } from '@tanstack/react-query';
import {
  App,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
} from 'antd';
import { useEffect, useRef } from 'react';

import { EUserRole } from '../services/user.model';
import userService from '../services/user.service';

type TUserFormDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const UserFormDrawer: React.FC<TUserFormDrawerProps> = ({
  open,
  setOpen,
  id = 0,
  refetch,
}: TUserFormDrawerProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const hiddenSubmitRef = useRef<any>();

  const { data: getUserById, isLoading } = useQuery({
    queryKey: ['/get-user-by-id', id],
    enabled: !!id,
    queryFn: () => (id ? userService.getUser(id) : undefined),
  });

  useEffect(() => {
    if (getUserById?.data?.user) {
      const user = getUserById?.data?.user;
      form.setFieldsValue({
        ...user,
      });
    }
  }, [getUserById?.data, form]);

  const updateUserMutation = useMutation({
    mutationFn: (data: any) => userService.updateUser(id, data),
    onSuccess: async () => {
      refetch && (await refetch());
      message.success('Chỉnh sửa thành công');
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  return (
    <Drawer
      forceRender
      title="Chỉnh sửa"
      open={open}
      onClose={() => setOpen(false)}
      width={640}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{'Huỷ'}</Button>

          <Button
            type="primary"
            loading={updateUserMutation.isPending}
            disabled={isLoading}
            onClick={() => {
              form.submit();
              hiddenSubmitRef.current.click();
            }}
          >
            {'Xác nhận'}
          </Button>
        </Space>
      }
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="users"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            updateUserMutation.mutate(values);
          }}
        >
          <Form.Item
            name="email"
            label={'Email'}
            rules={[
              { required: true, message: 'Trường này không được bỏ trống!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label={'Quyền'}
            rules={[
              { required: true, message: 'Trường này không được bỏ trống!' },
            ]}
          >
            <Select
              defaultValue={getUserById?.user?.role}
              style={{ width: 120 }}
              options={[
                { value: EUserRole.AGENT, label: 'Đại lý' },
                { value: EUserRole.USER, label: 'Người dùng' },
              ]}
            />
          </Form.Item>

          <Form.Item name="agentId" label={'Đại lý'}>
            <Input />
          </Form.Item>
          <Form.Item name="adminId" label={'Admin tổng'}>
            <Input />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={hiddenSubmitRef}
              />
            )}
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UserFormDrawer;

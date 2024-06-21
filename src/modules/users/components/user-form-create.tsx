import { useMutation } from '@tanstack/react-query';
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

import { useAppStore } from '@/modules/app/app.zustand';

import { EUserRole } from '../services/user.model';
import userService from '../services/user.service';

type TUserFormCreateProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: 'create' | 'update';
  id?: number;
  refetch?: () => Promise<any>;
};

const UserFormCreate: React.FC<TUserFormCreateProps> = ({
  open,
  setOpen,
  refetch,
}: TUserFormCreateProps) => {
  const { message } = App.useApp();
  const hiddenSubmitRef = useRef<any>();
  const setLoading = useAppStore((state) => state.setLoading);

  const [form] = Form.useForm();

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: (data: any) => userService.create(data),
    onSuccess: async () => {
      setLoading(false);
      refetch && (await refetch());
      message.success('Tạo mới thành công');
      setOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      setLoading(false);
      message.error(error.message);
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form]);

  return (
    <Drawer
      forceRender
      title={'Tạo mới'}
      open={open}
      onClose={() => setOpen(false)}
      width={640}
      extra={
        <Space>
          <Button onClick={() => setOpen(false)}>{'Huỷ'}</Button>

          <Button
            type="primary"
            loading={isPending}
            disabled={isPending}
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
      {isPending ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          name="users"
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            createMutate(values);
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Trường này không được bỏ trống!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
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

export default UserFormCreate;

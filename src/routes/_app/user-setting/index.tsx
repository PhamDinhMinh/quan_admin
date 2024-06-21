import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  TablePaginationConfig,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import useApp from '@/hooks/use-app';
import { useAppTitle } from '@/hooks/use-app-title';
import UserFormDrawer from '@/modules/users/components/user-form-drawer';
import UserPreviewDrawer from '@/modules/users/components/user-preview-drawer';
import UserRoleTag from '@/modules/users/components/user-role-tag';
import userService from '@/modules/users/services/user.service';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/user-setting/')({
  component: UserSettingPage,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  filters?: Record<string, any>;
};

function UserSettingPage() {
  const { antdApp, token } = useApp();

  useAppTitle('Xác nhận');

  const { message, modal } = antdApp;

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      keyword: '',
    },
  });
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [formId, setFormId] = useState<number | undefined>();
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [search, setSearch] = useState<string>('');

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
        filters: {
          keyword: search,
        },
      });
    },
    1000,
    [search],
  );
  const {
    data: getUsersQuery,
    refetch,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ['/get-all-users', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      userService.getListUser({
        maxResultCount: tableParams.pagination?.pageSize || 10,
        skipCount:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
      }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      refetch();
      message.success('Xoá thành công');
    },
    onError: () => {
      message.error('Xoá thất bại');
    },
  });

  return (
    <>
      <UserFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={refetch}
      />

      <UserPreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />

      <TitleHeading>{'Quản lý người dùng'}</TitleHeading>

      <Divider />

      <Flex vertical gap={token.size}>
        <Flex justify="flex-end">
          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              <Input.Search
                placeholder={'Tìm kiếm'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={isLoading || isFetching}
          dataSource={getUsersQuery?.data || []}
          pagination={{
            ...tableParams.pagination,
            total: getUsersQuery?.data?.totalRecords ?? 0,
          }}
          rowKey={(record) => record.id}
          bordered
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: 'Id thiết bị',
              key: 'device_id',
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Quyền',
              dataIndex: 'role',
              key: 'role',
              render: (role: string) => (
                <>
                  <UserRoleTag key={role} role={role} />
                </>
              ),
            },
            {
              title: 'Thời gian tạo',
              dataIndex: 'creationTime',
              key: 'creationTime',
              render: (value: string) =>
                dayjs(value).format('DD/MM/YYYY - HH:mm:ss'),
            },
            {
              key: 'actions',
              fixed: 'right',
              width: 100,
              render: (_, record) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: 'Xem',
                        key: 'view',
                        icon: <EyeOutlined />,
                        onClick: () => {
                          setSelectedId(record.id);
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: 'Chỉnh sửa',
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setFormMode('update');
                          setFormId(record.id);
                          setOpenFormDrawer(true);
                        },
                      },
                      {
                        label: 'Xoá',
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                          modal.confirm({
                            title: 'Xác nhận xoá',
                            content: 'Bạn có chắc chắn muốn xoá không?',
                            okText: 'Xác nhận',
                            cancelText: 'Huỷ',
                            onOk: async () => {
                              await deleteUserMutation.mutateAsync(+record.id);
                            },
                          });
                        },
                      },
                    ],
                  }}
                >
                  <Button>
                    <Space>
                      Hành động
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              ),
            },
          ]}
          onChange={(pagination) => {
            setTableParams({
              ...tableParams,
              pagination,
            });
          }}
        />
      </Flex>
    </>
  );
}

export default UserSettingPage;

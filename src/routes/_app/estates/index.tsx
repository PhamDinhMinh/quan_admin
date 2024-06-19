import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
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
import EstateFormDrawer from '@/modules/estates/components/estate-form-drawer';
import EstatePreviewDrawer from '@/modules/estates/components/estate-preview-drawer';
import EstateTypeTag from '@/modules/estates/components/estate-type-tag';
import { EEstateType } from '@/modules/estates/estate.model';
import projectService from '@/modules/estates/estate.service';
import estateService from '@/modules/estates/estate.service';

export const Route = createFileRoute('/_app/estates/')({
  component: EstateListPage,
});

type TTableParams = {
  pagination: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
};

function EstateListPage() {
  const { t, antdApp } = useApp();

  useAppTitle(t('Estates'));

  const [tableParams, setTableParams] = useState<TTableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: {
      search: '',
      roles: [],
    },
  });
  const [openFormDrawer, setOpenFormDrawer] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'update'>('create');
  const [formId, setFormId] = useState<number | undefined>();
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [search, setSearch] = useState<string>('');

  useDebounce(
    () => {
      setTableParams({
        ...tableParams,
        filters: {
          search: search,
        },
      });
    },
    1000,
    [search],
  );

  const getEstatesQuery = useQuery({
    queryKey: ['/estates', tableParams.pagination, tableParams.filters],
    queryFn: () =>
      projectService.getList({
        take: tableParams.pagination?.pageSize || 10,
        skip:
          tableParams.pagination?.current && tableParams.pagination?.pageSize
            ? (tableParams.pagination?.current - 1) *
              tableParams.pagination?.pageSize
            : 0,
        ...tableParams.filters,
        sort: tableParams.sortField,
        order: tableParams.sortOrder as 'ASC' | 'DESC',
      }),
  });

  const deleteEstateMutation = useMutation({
    mutationFn: (id: number) => estateService.delete(id),
    onSuccess: () => {
      getEstatesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  const deleteManyEstatesMutation = useMutation({
    mutationFn: (ids: number[]) => estateService.deleteMany(ids),
    onSuccess: () => {
      getEstatesQuery.refetch();
      antdApp.message.success(t('Deleted successfully'));
    },
    onError: () => {
      antdApp.message.error(t('An error occurred'));
    },
  });

  return (
    <>
      <EstateFormDrawer
        open={openFormDrawer}
        setOpen={setOpenFormDrawer}
        action={formMode}
        id={formId}
        refetch={getEstatesQuery.refetch}
      />

      <EstatePreviewDrawer
        open={openPreviewDrawer}
        setOpen={setOpenPreviewDrawer}
        id={selectedId}
      />

      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify="space-between">
          <Space direction="horizontal" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={() => {
                setOpenFormDrawer(true);
                setFormMode('create');
              }}
            >
              {t('Create')}
            </Button>

            <Button
              danger
              type="dashed"
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                antdApp.modal.confirm({
                  title: t('Delete confirmation'),
                  content: t(
                    'Are you sure you want to delete the selected items?',
                  ),
                  okText: t('Yes'),
                  cancelText: t('No'),
                  onOk: async () => {
                    await deleteManyEstatesMutation.mutateAsync(
                      selectedRowKeys.map((key) => +key.toString()),
                    );
                  },
                });
              }}
            >
              {t('Delete selected')}
            </Button>
          </Space>

          <div>
            <Space direction="horizontal" style={{ width: '100%' }}>
              {/* <Popover
                placement="bottomRight"
                trigger="click"
                title={t('Filter')}
                content={
                  <UsersFilterForm
                    onSubmit={(values: any) => {
                      setTableParams({
                        ...tableParams,
                        filters: values,
                      });
                    }}
                  />
                }
              >
                <Button icon={<FilterOutlined />}>{t('Filter')}</Button>
              </Popover> */}

              <Input.Search
                placeholder={t('Search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Space>
          </div>
        </Flex>

        <Table
          loading={getEstatesQuery.isLoading || getEstatesQuery.isFetching}
          dataSource={getEstatesQuery.data?.data.items || []}
          pagination={tableParams.pagination}
          rowKey={(record) => record.id}
          bordered
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          columns={[
            {
              title: t('ID'),
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: t('Name'),
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: t('Type'),
              dataIndex: 'type',
              key: 'type',
              render: (type: EEstateType) => <EstateTypeTag type={type} />,
            },
            {
              title: t('Created at'),
              dataIndex: 'createdAt',
              key: 'createdAt',
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
                        label: t('View'),
                        key: 'view',
                        icon: <EyeOutlined />,
                        onClick: () => {
                          setSelectedId(record.id);
                          setOpenPreviewDrawer(true);
                        },
                      },
                      {
                        label: t('Edit'),
                        key: 'edit',
                        icon: <EditOutlined />,
                        onClick: () => {
                          setFormMode('update');
                          setFormId(record.id);
                          setOpenFormDrawer(true);
                        },
                      },
                      {
                        label: t('Delete'),
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                          antdApp.modal.confirm({
                            title: t('Delete confirmation'),
                            content: t(
                              'Are you sure you want to delete this item?',
                            ),
                            okText: t('Yes'),
                            cancelText: t('No'),
                            onOk: async () => {
                              await deleteEstateMutation.mutateAsync(
                                +record.id,
                              );
                            },
                          });
                        },
                      },
                    ],
                  }}
                >
                  <Button>
                    <Space>
                      {t('Actions')}
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
      </Space>
    </>
  );
}

export default EstateListPage;

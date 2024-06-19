import { PaginationProps as AntdPaginationProps, Pagination } from 'antd';

type CommonPaginationProps = {
  current?: number;
  itemsPerPage: number;
  totalItems: number;

  onPaginationChange: (page: number, pageSize: number) => void;
};

const CommonPagination = (props: CommonPaginationProps) => {
  const onShowSizeChange: AntdPaginationProps['onShowSizeChange'] = (
    current,
    pageSize,
  ) => {
    props.onPaginationChange(current, pageSize);
  };
  return (
    <Pagination
      showSizeChanger
      onShowSizeChange={onShowSizeChange}
      onChange={(page, pageSize) => {
        props.onPaginationChange(page, pageSize);
      }}
      defaultCurrent={props.current || 1}
      total={props.totalItems}
    />
  );
};

export default CommonPagination;

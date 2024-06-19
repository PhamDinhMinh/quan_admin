import { useQuery } from '@tanstack/react-query';
import { Button, Descriptions, Drawer, Empty, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import estateService from '../estate.service';
import EstateTypeTag from './estate-type-tag';

type TEstatePreviewProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id?: number;
};

const EstatePreviewDrawer: React.FC<TEstatePreviewProps> = ({
  open,
  setOpen,
  id,
}: TEstatePreviewProps) => {
  const { t } = useTranslation();

  const estateQuery = useQuery({
    queryKey: ['/estates/get-one', id],
    enabled: !!id,
    queryFn: () => (id ? estateService.getDetail(id) : undefined),
  });

  return (
    <Drawer
      title="Preview"
      open={open}
      onClose={() => setOpen(false)}
      width={720}
      extra={<Button onClick={() => setOpen(false)}>{t('Cancel')}</Button>}
    >
      {estateQuery.isLoading ? (
        <Skeleton />
      ) : !estateQuery?.data ? (
        <Empty />
      ) : (
        <Descriptions
          column={2}
          title="Estate Info"
          items={[
            {
              label: t('ID'),
              span: 2,
              children: estateQuery?.data?.data?.id,
            },
            {
              label: t('Name'),
              span: 1,
              children: estateQuery?.data?.data?.name,
            },
            {
              label: t('Description'),
              span: 1,
              children: estateQuery?.data?.data?.description,
            },
            {
              label: t('Type'),
              span: 2,
              children: <EstateTypeTag type={estateQuery?.data?.data?.type} />,
            },
            {
              label: t('Created at'),
              span: 2,
              children: dayjs(estateQuery?.data?.data?.createdAt).format(
                'YYYY/MM/DD - HH:mm:ss',
              ),
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default EstatePreviewDrawer;

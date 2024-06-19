import { Button, Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="500"
      title="500"
      subTitle={t('Something went wrong')}
      extra={<Button type="primary">{t('Go back')}</Button>}
    />
  );
};

export default ErrorPage;

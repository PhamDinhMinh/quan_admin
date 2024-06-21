import { Typography } from 'antd';

import useApp from '@/hooks/use-app';

const TitleHeading = ({ children }: { children: string }) => {
  const { token } = useApp();

  return (
    <Typography.Text strong style={{ fontSize: `${token.fontSizeHeading3}px` }}>
      {children}
    </Typography.Text>
  );
};

export default TitleHeading;

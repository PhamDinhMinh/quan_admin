import { Tag } from 'antd';
import { useMemo } from 'react';

import { EEstateType } from '../estate.model';

const EstateTypeTag = ({ type }: { type: EEstateType }) => {
  const color = useMemo<string>(() => {
    switch (type) {
      case EEstateType.DEFAULT:
        return 'blue';
      case EEstateType.APARTMENT:
        return 'green';
      default:
        return 'default';
    }
  }, [type]);

  return <Tag color={color}>{type}</Tag>;
};

export default EstateTypeTag;

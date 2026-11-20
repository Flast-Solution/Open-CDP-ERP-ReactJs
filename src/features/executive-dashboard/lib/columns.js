import { formatNumber } from './format';

export const numberColumn = (title, dataIndex, formatter = formatNumber) => ({
  title,
  dataIndex,
  align: 'right',
  render: formatter,
});

export const textColumn = (title, dataIndex) => ({
  title,
  dataIndex,
});

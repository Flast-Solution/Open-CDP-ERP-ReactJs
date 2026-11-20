import { Typography } from 'antd';
import {
  DatabaseOutlined,
  DollarOutlined,
  InboxOutlined,
  MessageOutlined,
  TruckOutlined,
  WalletOutlined,
} from '@ant-design/icons';
const { Text } = Typography;

export const AlertCard = ({ item, onActivate }) => {
  const alertIcon = {
    delivery: <TruckOutlined />,
    inventory: <InboxOutlined />,
    receivable: <WalletOutlined />,
    conversation: <MessageOutlined />,
    stock: <DatabaseOutlined />,
    payable: <DollarOutlined />,
  }[item.icon];

  return (
    <div
      aria-haspopup="dialog"
      aria-label={`Xem chi tiết: ${item.title}`}
      className={`dashboard-alert is-${item.severity}`}
      onClick={onActivate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className="dashboard-alert__icon">{alertIcon}</span>
      <div className="dashboard-alert__content">
        <Text strong>{item.title}</Text>
        <Text type="secondary">{item.description}</Text>
      </div>
      <span className="dashboard-alert__arrow">›</span>
    </div>
  );
};

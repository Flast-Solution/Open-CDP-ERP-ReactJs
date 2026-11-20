import { Progress, Typography } from 'antd';

const { Text } = Typography;

export const ProductionDueOrders = ({ orders }) => (
  <div className="dashboard-production-due">
    {orders.map((order) => (
      <div className="dashboard-production-due__row" key={order.key}>
        <div className="dashboard-production-due__heading">
          <Text strong>{order.orderCode}</Text>
          <Text type="secondary">Hạn giao {order.deadlineLabel}</Text>
        </div>
        <Progress percent={order.progressPercent} showInfo={false} size="small" />
        <div className="dashboard-production-due__quantities">
          <Text type="secondary">
            Đã sản xuất {order.producedQuantity} / {order.totalQuantity}
          </Text>
          <Text strong>Còn thiếu {order.remainingQuantity}</Text>
        </div>
      </div>
    ))}
  </div>
);

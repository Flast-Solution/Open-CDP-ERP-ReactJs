import { Empty } from 'antd';

const DashboardEmptyState = ({ panel = false }) => (
  <div className={`dashboard-empty-state${panel ? ' dashboard-empty-state--panel' : ''}`}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
  </div>
);

export default DashboardEmptyState;

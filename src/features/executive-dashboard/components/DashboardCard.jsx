import { useState } from 'react';
import { Button, Card, Space, Table, Tooltip, Typography } from 'antd';
import { LineChartOutlined, TableOutlined } from '@ant-design/icons';
const { Text } = Typography;

export const DashboardCard = ({
  cardClassName = '',
  children,
  extra,
  foot,
  sampleData = false,
  subtitle,
  tableColumns,
  tableData,
  title,
}) => {
  const [tableView, setTableView] = useState(false);
  const hasTableView = tableColumns?.length && tableData;

  const cardActions = (
    <Space size={8}>
      {sampleData && <Text type="secondary">Dữ liệu mẫu</Text>}
      {extra}
      {hasTableView && (
        <Tooltip title={tableView ? 'Xem dạng biểu đồ' : 'Xem dạng bảng'}>
          <Button
            type="text"
            size="small"
            aria-label={tableView ? 'Xem dạng biểu đồ' : 'Xem dạng bảng'}
            aria-pressed={tableView}
            icon={tableView ? <LineChartOutlined /> : <TableOutlined />}
            onClick={() => setTableView((current) => !current)}
          />
        </Tooltip>
      )}
    </Space>
  );

  return (
    <Card
      className={`dashboard-card ${cardClassName}`}
      title={
        <div className="dashboard-card__heading">
          <Text strong>{title}</Text>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
      }
      extra={cardActions}
    >
      {tableView && hasTableView ? (
        <div className="dashboard-table-view">
          <Table
            className="dashboard-table"
            columns={tableColumns}
            dataSource={tableData}
            pagination={false}
            rowKey={(record) =>
              record.key ||
              record.date ||
              record.stage ||
              record.channel ||
              record.week ||
              record.category ||
              record.label ||
              record.name
            }
            scroll={{ x: 'max-content' }}
            size="small"
          />
        </div>
      ) : (
        children
      )}
      {foot}
    </Card>
  );
};

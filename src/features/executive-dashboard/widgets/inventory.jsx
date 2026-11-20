import DashboardEmptyState from '../components/DashboardEmptyState';
import DashboardWidget from '../components/DashboardWidget';
import { DashboardCard } from '../components/DashboardCard';
import {
  stockCategoryColumns,
  stockCategoriesTable,
  stockConfig,
  stockCategoryTotal,
  stockAgeColumns,
  stockAgeTable,
  stockAgeConfig,
  highestStockCategory,
  highestStockCategoryShare,
  agedStock,
} from './models/inventory';
import { Pie, Column } from '@ant-design/plots';
import { dashboardStockCategories, dashboardStockAge } from '../mockData';
import { formatMillion, formatNumber } from '../lib/format';
import { InboxOutlined } from '@ant-design/icons';
import { Empty, Spin, Typography } from 'antd';
const { Text } = Typography;

export const StockMixWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`${highestStockCategory.category} chiếm ${highestStockCategoryShare}% giá trị tồn kho`}
        subtitle="Cơ cấu giá trị tồn kho theo loại"
        tableColumns={stockCategoryColumns}
        tableData={stockCategoriesTable}
      >
        <div className="dashboard-stock-mix">
          <Pie {...stockConfig} height={270} />
          <div className="dashboard-stock-mix__legend">
            {dashboardStockCategories.map((item) => (
              <div key={item.category}>
                <span
                  className="dashboard-legend-list__dot"
                  style={{ backgroundColor: item.color }}
                />
                <Text>{item.category}</Text>
                <Text>
                  <strong>{formatMillion(item.value)}</strong>
                  <span className="dashboard-stock-mix__share">
                    {' '}
                    · {Math.round((item.value / stockCategoryTotal) * 100)}%
                  </span>
                </Text>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

export const StockAgeWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`${formatMillion(agedStock.value)} hàng tồn đã quá 90 ngày (${agedStock.share}%)`}
        subtitle="Giá trị tồn kho theo tuổi tồn"
        tableColumns={stockAgeColumns}
        tableData={stockAgeTable}
      >
        <div className="dashboard-stock-age-chart">
          <div className="dashboard-stock-age-legend">
            <span>
              <i className="is-current" />
              Dưới 90 ngày
            </span>
            <span>
              <i className="is-old" />
              Quá 90 ngày
            </span>
          </div>
          <Column {...stockAgeConfig} height={228} />
          <div className="dashboard-stock-age-labels">
            {dashboardStockAge.map((item, index) => (
              <Text className={index === 3 ? 'is-old' : ''} key={item.label}>
                {item.label}
              </Text>
            ))}
          </div>
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

export const ShortagesWidget = ({ widgetId, alertData, alertError, alertLoading }) => {
  const shortages = alertData?.materialShortage;
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title="Thiếu nguyên phụ liệu"
        subtitle={
          shortages && `${formatNumber(shortages.count)} dòng lệnh sản xuất thiếu nguyên phụ liệu`
        }
      >
        {alertLoading ? (
          <Spin />
        ) : alertError ? (
          <DashboardEmptyState />
        ) : shortages?.items.length ? (
          <div className="dashboard-shortage-list">
            {shortages.items.map((item, index) => (
              <div className="dashboard-shortage" key={`${item.id}-${item.materialId}-${index}`}>
                <InboxOutlined className="dashboard-shortage__icon" />
                <div className="dashboard-shortage__body">
                  <div className="dashboard-shortage__heading">
                    <Text strong>{item.materialName}</Text>
                    <Text type="danger">Thiếu {formatNumber(item.shortage)}</Text>
                  </div>
                  <Text type="secondary">
                    {[item.code, item.orderCode].filter(Boolean).join(' · ')}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="Chưa có dòng thiếu nguyên phụ liệu." />
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

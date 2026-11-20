import DashboardEmptyState from '../components/DashboardEmptyState';
import DashboardWidget from '../components/DashboardWidget';
import { DashboardCard } from '../components/DashboardCard';
import {
  createProductionConfig,
  mapWeeklySummaryToChart,
  mapWeeklySummaryToTable,
  productionStatusLegend,
  weeklySummaryColumns,
  productionDefectColumns,
  productionDefectTable,
  defectRateConfig,
  latestDefectRate,
  lowestDefectRate,
  mapOrdersDueForManufacture,
  ordersDueForManufactureColumns,
} from './models/production';
import { Column, Area } from '@ant-design/plots';
import { Empty, Spin } from 'antd';
import { ProductionDueOrders } from '../components/ProductionDueOrders';
import { dashboardDefectRate } from '../mockData';

export const ProductionStatusWidget = ({
  widgetId,
  manufactureSummaryData,
  manufactureSummaryError,
  manufactureSummaryLoading,
}) => {
  const weeklySummary = manufactureSummaryData?.weeklySummary;
  const chartData = weeklySummary ? mapWeeklySummaryToChart(weeklySummary) : [];
  const tableData = weeklySummary ? mapWeeklySummaryToTable(weeklySummary) : [];

  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title="Tiến độ lệnh sản xuất theo tuần"
        subtitle="Theo tuần lịch ISO trong tháng hiện tại; lệnh có thể xuất hiện ở nhiều tuần."
        tableColumns={weeklySummaryColumns}
        tableData={weeklySummary ? tableData : null}
      >
        {manufactureSummaryError ? (
          <DashboardEmptyState />
        ) : manufactureSummaryLoading ? (
          <Spin />
        ) : !chartData.length ? (
          <Empty description="Chưa có dữ liệu tiến độ sản xuất." />
        ) : (
          <>
            <div className="dashboard-production-legend">
              {productionStatusLegend.map(({ label, color }) => (
                <span key={label}>
                  <i style={{ backgroundColor: color }} />
                  {label}
                </span>
              ))}
            </div>
            <Column {...createProductionConfig(chartData)} height={176} />
          </>
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

export const ProductionDefectWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`Tỷ lệ lỗi giảm còn ${latestDefectRate}%, thấp nhất ${lowestDefectRate}% trong ${
          dashboardDefectRate.length
        } tuần qua`}
        subtitle="Tỷ lệ lỗi và hàng làm lại theo tuần"
        tableColumns={productionDefectColumns}
        tableData={productionDefectTable}
      >
        <Area {...defectRateConfig} height={158} />
      </DashboardCard>
    </DashboardWidget>
  );
};

export const ProductionTimelineWidget = ({
  widgetId,
  manufactureSummaryData,
  manufactureSummaryError,
  manufactureSummaryLoading,
}) => {
  const orders = manufactureSummaryData
    ? mapOrdersDueForManufacture(manufactureSummaryData.ordersDueForManufacture)
    : [];
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title="Đơn còn thiếu sản lượng cần theo dõi"
        subtitle="Hạn giao từ hôm nay đến 5 ngày tiếp theo; danh sách này không phân loại mức độ rủi ro."
        tableColumns={ordersDueForManufactureColumns}
        tableData={manufactureSummaryData ? orders : null}
      >
        {manufactureSummaryError ? (
          <DashboardEmptyState />
        ) : manufactureSummaryLoading ? (
          <Spin />
        ) : !orders.length ? (
          <Empty description="Chưa có đơn cần sản xuất trong khoảng thời gian này." />
        ) : (
          <ProductionDueOrders orders={orders} />
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

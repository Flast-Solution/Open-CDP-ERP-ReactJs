import DashboardEmptyState from '../components/DashboardEmptyState';
import DashboardWidget from '../components/DashboardWidget';
import { DashboardCard } from '../components/DashboardCard';
import {
  salesTrendColumns,
  salesTrendTable,
  salesTrendConfig,
  salesPlanProgressPercent,
  salesAheadOfPlanPercent,
  salesMonthChangePercent,
  salesTrendDays,
  conversationToOrderPercent,
  conversationToLeadPercent,
  funnelColumns,
  funnelTable,
} from './models/sales';
import {
  customerColumns,
  getTopCustomerShare,
  mapTopCustomers,
  mapTopEmployees,
} from './models/monthlySummaryCharts';
import { Area } from '@ant-design/plots';
import { dashboardSalesDaysElapsed, dashboardFunnel } from '../mockData';
import React from 'react';
import { formatNumber, formatMoney, formatCompactMoney, getInitials } from '../lib/format';
import { Empty, Spin, Tooltip, Table, Typography } from 'antd';
const { Text } = Typography;

export const SalesTrendWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`Doanh số đã đạt ${salesPlanProgressPercent}% kế hoạch tháng, còn ${
          salesTrendDays - dashboardSalesDaysElapsed
        } ngày`}
        subtitle={`Lũy kế theo ngày · vượt tiến độ kế hoạch ${salesAheadOfPlanPercent}%, cao hơn tháng trước ${salesMonthChangePercent}%`}
        tableColumns={salesTrendColumns}
        tableData={salesTrendTable}
      >
        <div className="dashboard-chart-legend">
          <span>
            <i className="is-current" />
            Tháng này
          </span>
          <span>
            <i className="is-previous" />
            Tháng trước
          </span>
          <span>
            <i className="is-plan" />
            Kế hoạch
          </span>
        </div>
        <Area {...salesTrendConfig} height={300} />
      </DashboardCard>
    </DashboardWidget>
  );
};

export const SalesFunnelWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`Cứ 100 hội thoại có gần ${conversationToOrderPercent} đơn hàng`}
        subtitle={`Rơi nhiều nhất ở bước Hội thoại → Lead (chuyển đổi ${conversationToLeadPercent}%)`}
        tableColumns={funnelColumns}
        tableData={funnelTable}
      >
        <div className="dashboard-funnel">
          {dashboardFunnel.map((item, index) => {
            const previous = dashboardFunnel[index - 1];
            const conversion = previous ? (item.value / previous.value) * 100 : null;
            const transitionLabels = ['chuyển thành lead', 'thành cơ hội', 'chốt thành đơn'];

            return (
              <React.Fragment key={item.stage}>
                {previous && (
                  <div className="dashboard-funnel__conversion">
                    <span aria-hidden="true">▼</span>
                    <strong>{conversion.toFixed(1)}%</strong>
                    <span>{transitionLabels[index - 1]}</span>
                  </div>
                )}
                <div className="dashboard-funnel__step">
                  <div className="dashboard-funnel__heading">
                    <Text>{item.stage}</Text>
                    <Text strong>{formatNumber(item.value)}</Text>
                  </div>
                  <div className="dashboard-funnel__track">
                    <span
                      style={{
                        width: `${Math.max((item.value / dashboardFunnel[0].value) * 100, 2.5)}%`,
                        backgroundColor: ['#86b6ef', '#3987e5', '#1c5cab', '#0d366b'][index],
                      }}
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

export const TopCustomersWidget = ({
  widgetId,
  monthlySummaryData,
  monthlySummaryError,
  monthlySummaryLoading,
}) => {
  const customers = monthlySummaryData ? mapTopCustomers(monthlySummaryData) : null;
  const topCustomerShare = getTopCustomerShare(customers);
  const totalRevenue = monthlySummaryData?.salesRevenue.currentMonth;

  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title={
          topCustomerShare == null
            ? 'Khách hàng có doanh số cao nhất'
            : `${customers.length} khách hàng lớn nhất chiếm ${formatNumber(
                Number(topCustomerShare.toFixed(1)),
              )}% doanh số`
        }
        subtitle={
          totalRevenue == null
            ? 'Doanh số tháng hiện tại'
            : `Doanh số tháng hiện tại · tổng ${formatCompactMoney(totalRevenue)}`
        }
        tableColumns={customerColumns}
        tableData={customers}
      >
        {monthlySummaryError ? (
          <DashboardEmptyState />
        ) : monthlySummaryLoading ? (
          <Spin />
        ) : !customers?.length ? (
          <Empty description="Chưa có dữ liệu khách hàng." />
        ) : (
          <div className="dashboard-rank-list">
            {customers.map((customer, index) => (
              <Tooltip
                key={customer.key}
                overlayClassName="dashboard-customer-tooltip-overlay"
                placement="top"
                title={
                  <div className="dashboard-customer-tooltip">
                    <Text strong>{customer.name}</Text>
                    <div>
                      <span>
                        <i />
                        Doanh số
                      </span>
                      <Text strong>{formatMoney(customer.revenue)}</Text>
                    </div>
                    <div>
                      <span>Tỷ trọng</span>
                      <Text strong>
                        {customer.share == null
                          ? '—'
                          : `${formatNumber(Number(customer.share.toFixed(1)))}%`}
                      </Text>
                    </div>
                  </div>
                }
              >
                <div
                  className="dashboard-rank-row"
                  tabIndex={0}
                  aria-label={`${customer.name}: doanh số ${formatMoney(customer.revenue)}`}
                >
                  <span className="dashboard-rank-row__number">{index + 1}</span>
                  <div className="dashboard-rank-row__body">
                    <div className="dashboard-rank-row__heading">
                      <Text ellipsis>{customer.name}</Text>
                      <Text strong>{formatMoney(customer.revenue)}</Text>
                    </div>
                    <div className="dashboard-rank-row__bar">
                      <span className="dashboard-rank-row__track">
                        <i
                          style={{
                            width: `${
                              customers[0].revenue > 0
                                ? (customer.revenue / customers[0].revenue) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </span>
                      <span className="dashboard-rank-row__share">
                        {customer.share == null
                          ? '—'
                          : `${formatNumber(Number(customer.share.toFixed(1)))}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

export const SalesRepsWidget = ({
  widgetId,
  monthlySummaryData,
  monthlySummaryError,
  monthlySummaryLoading,
}) => {
  const representatives = monthlySummaryData ? mapTopEmployees(monthlySummaryData) : null;
  const representativeMaxRevenue = representatives?.[0]?.revenue ?? 0;

  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title="Nhân viên kinh doanh theo doanh số"
        subtitle="Xếp hạng nhân viên kinh doanh theo doanh số"
      >
        {monthlySummaryError ? (
          <DashboardEmptyState />
        ) : monthlySummaryLoading ? (
          <Spin />
        ) : !representatives?.length ? (
          <Empty description="Chưa có dữ liệu nhân viên." />
        ) : (
          <Table
            className="dashboard-table"
            columns={[
              {
                title: '#',
                dataIndex: 'rank',
                width: 52,
              },
              {
                title: 'Nhân viên',
                dataIndex: 'name',
                render: (name) => (
                  <span className="dashboard-sales-person">
                    <span className="dashboard-sales-person__avatar">{getInitials(name)}</span>
                    <strong>{name}</strong>
                  </span>
                ),
              },
              {
                title: 'Doanh số',
                dataIndex: 'revenue',
                render: (value) => (
                  <div className="dashboard-sales-revenue">
                    <strong>{formatMoney(value)}</strong>
                    <span>
                      <i
                        style={{
                          width: `${
                            representativeMaxRevenue > 0
                              ? (value / representativeMaxRevenue) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </span>
                  </div>
                ),
              },
              {
                title: 'Số đơn',
                dataIndex: 'orders',
                align: 'right',
                width: 64,
              },
            ]}
            dataSource={representatives}
            pagination={false}
            rowKey="key"
            size="small"
          />
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

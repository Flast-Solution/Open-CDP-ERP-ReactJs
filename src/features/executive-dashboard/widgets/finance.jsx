import DashboardWidget from '../components/DashboardWidget';
import { DashboardCard } from '../components/DashboardCard';
import { FinanceSummary } from '../components/FinanceSummary';
import { formatCompactMoney, formatMillion, formatNumber } from '../lib/format';
import { dashboardReceivables, dashboardDebtors } from '../mockData';
import {
  receivableAgingColumns,
  receivableAgingTable,
  receivableAging,
  receivableTotalMillions,
  receivableOverdueMillions,
  receivableAgingConfig,
  debtorColumns,
  debtorTable,
  debtorMaxTotal,
  cashflowWeekTwo,
  cashflowColumns,
  cashflowSummary,
  cashflowConfig,
  overdueShare,
  overdueWithin30DaysShare,
  topOverdueDebtors,
  topOverdueDebtorShare,
} from './models/finance';
import { Tooltip, Divider, Typography } from 'antd';
import { Column } from '@ant-design/plots';
const { Text } = Typography;

export const ReceivablesWidget = ({ widgetId, debtReport }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard title="Tổng phải thu">
        <FinanceSummary
          report={debtReport.data?.accountsReceivable}
          loading={debtReport.loading}
          error={debtReport.error}
          unit="đơn"
        />
      </DashboardCard>
    </DashboardWidget>
  );
};

export const PayablesWidget = ({ widgetId, debtReport }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard title="Tổng phải trả">
        <FinanceSummary
          report={debtReport.data?.accountsPayable}
          loading={debtReport.loading}
          error={debtReport.error}
          unit="chứng từ"
        />
      </DashboardCard>
    </DashboardWidget>
  );
};

export const AgingWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`Nợ quá hạn ${formatMillion(receivableOverdueMillions)} (${overdueShare}%), ${
          overdueWithin30DaysShare
        }% mới quá hạn dưới 30 ngày`}
        subtitle={`Tuổi nợ phải thu · tổng ${formatCompactMoney(dashboardReceivables.total)}`}
        tableColumns={receivableAgingColumns}
        tableData={receivableAgingTable}
      >
        <div className="dashboard-aging">
          <div className="dashboard-aging__bar">
            {receivableAging.map((item) => (
              <Tooltip key={item.label} title={`${item.label}: ${formatMillion(item.value)}`}>
                <span
                  style={{
                    backgroundColor: item.color,
                    width: `${(item.value / receivableTotalMillions) * 100}%`,
                  }}
                />
              </Tooltip>
            ))}
          </div>
          <div className="dashboard-aging__legend">
            {[
              {
                label: 'Chưa đến hạn',
                value: receivableTotalMillions - receivableOverdueMillions,
                share: `${Math.round(
                  ((receivableTotalMillions - receivableOverdueMillions) /
                    receivableTotalMillions) *
                    100,
                )}%`,
                color: '#7b8ea8',
              },
              {
                label: 'Quá hạn',
                value: receivableOverdueMillions,
                share: `${Math.round(
                  (receivableOverdueMillions / receivableTotalMillions) * 100,
                )}%`,
                color: '#d97a26',
              },
            ].map((item) => (
              <div key={item.label}>
                <span>
                  <i style={{ backgroundColor: item.color }} />
                  <Text>{item.label}</Text>
                </span>
                <Text strong>
                  {formatMillion(item.value)} <em>{item.share}</em>
                </Text>
              </div>
            ))}
          </div>
          <Divider />
          <Text className="dashboard-aging__chart-title" strong>
            Phần quá hạn, chia theo số ngày quá hạn
          </Text>
          <Column {...receivableAgingConfig} height={158} />
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

export const DebtorsWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`${topOverdueDebtors
          .map((item) => item.name.replace('Xưởng may ', '').replace('Đồng phục ', ''))
          .join(' và ')} chiếm ${topOverdueDebtorShare}% nợ quá hạn`}
        subtitle="5 khách hàng nợ nhiều nhất · phần quá hạn tách riêng"
        tableColumns={debtorColumns}
        tableData={debtorTable}
      >
        <div className="dashboard-debtors">
          <div className="dashboard-debtors__legend">
            <span>
              <i className="is-current" />
              Còn trong hạn
            </span>
            <span>
              <i className="is-overdue" />
              Quá hạn
            </span>
          </div>
          {dashboardDebtors.map((debtor) => {
            const current = debtor.total - debtor.overdue;

            return (
              <Tooltip
                key={debtor.name}
                overlayClassName="dashboard-debtor-tooltip-overlay"
                placement="top"
                title={
                  <div className="dashboard-debtor-tooltip">
                    <Text strong>{debtor.name}</Text>
                    <div>
                      <span>
                        <i className="is-current" />
                        Chưa đến hạn
                      </span>
                      <Text>{formatMillion(current)}</Text>
                    </div>
                    <div>
                      <span>
                        <i className="is-overdue" />
                        Quá hạn
                      </span>
                      <Text>{formatMillion(debtor.overdue)}</Text>
                    </div>
                    <div className="dashboard-debtor-tooltip__total">
                      <span>Tổng nợ</span>
                      <Text strong>{formatMillion(debtor.total)}</Text>
                    </div>
                  </div>
                }
              >
                <div
                  className="dashboard-debtor"
                  tabIndex={0}
                  aria-label={`${debtor.name}: chưa đến hạn ${formatMillion(current)}, quá hạn ${formatMillion(debtor.overdue)}, tổng nợ ${formatMillion(debtor.total)}`}
                >
                  <div className="dashboard-debtor__heading">
                    <Text ellipsis>{debtor.name}</Text>
                    <Text strong>{formatMillion(debtor.total)}</Text>
                  </div>
                  <div className="dashboard-debtor__bar" aria-hidden="true">
                    <span
                      className="is-current"
                      style={{ width: `${(current / debtorMaxTotal) * 100}%` }}
                    />
                    <span
                      className="is-overdue"
                      style={{ width: `${(debtor.overdue / debtorMaxTotal) * 100}%` }}
                    />
                  </div>
                  <Text className="dashboard-debtor__overdue" type="secondary">
                    Quá hạn{' '}
                    <strong style={{ color: '#cf1322' }}>{formatMillion(debtor.overdue)}</strong>
                  </Text>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

export const CashflowWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        title={`${cashflowWeekTwo.week} tiền ra nhiều hơn tiền vào ${formatMillion(
          Math.abs(cashflowWeekTwo.net),
        )}`}
        subtitle="Dự kiến thu và trả trong 4 tuần tới (tr)"
        tableColumns={cashflowColumns}
        tableData={cashflowSummary}
      >
        <div className="dashboard-cashflow">
          <div className="dashboard-cashflow__legend">
            <span>
              <i className="is-inflow" />
              Thu dự kiến
            </span>
            <span>
              <i className="is-outflow" />
              Trả dự kiến
            </span>
          </div>
          <Column {...cashflowConfig} height={180} />
          <div className="dashboard-cashflow__ranges">
            {cashflowSummary.map((item) => (
              <Text key={item.week} type="secondary">
                {item.range}
              </Text>
            ))}
          </div>
          <Text className="dashboard-cashflow__caption" type="secondary">
            Chênh lệch thu − trả
          </Text>
          <div className="dashboard-cashflow__summary">
            {cashflowSummary.map((item) => (
              <div key={item.week}>
                <Text strong className={item.net >= 0 ? 'is-positive' : 'is-negative'}>
                  {item.net > 0 ? '+' : ''}
                  {formatNumber(item.net)}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

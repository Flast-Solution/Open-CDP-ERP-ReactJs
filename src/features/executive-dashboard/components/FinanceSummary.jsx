import DashboardEmptyState from './DashboardEmptyState';
import { Spin, Typography } from 'antd';
import { formatMoney, formatNumber } from '../lib/format';

const { Text } = Typography;

export const FinanceSummary = ({ report, error, loading, unit }) => {
  if (loading) return <Spin />;
  if (error)
    return (
      <DashboardEmptyState />
    );
  return (
    <div className="dashboard-finance-summary">
      <div className="dashboard-finance-summary__total">
        <Text className="dashboard-finance-summary__amount" strong>
          {formatMoney(report.openAmount)}
        </Text>
        <Text type="secondary">
          {formatNumber(report.openCount)} {unit} còn nợ
        </Text>
      </div>
      <div className="dashboard-finance-summary__rows">
        <div>
          <Text>Quá hạn</Text>
          <Text strong>
            {formatMoney(report.overdueAmount)} · {formatNumber(report.overdueCount)} {unit}
          </Text>
        </div>
        <div>
          <Text>Đến hạn trong 7 ngày</Text>
          <Text strong>
            {formatMoney(report.dueWithinWeekAmount)} · {formatNumber(report.dueWithinWeekCount)}{' '}
            {unit}
          </Text>
        </div>
      </div>
    </div>
  );
};

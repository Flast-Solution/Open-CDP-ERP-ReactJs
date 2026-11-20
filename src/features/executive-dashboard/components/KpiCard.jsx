import { Card, Statistic, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { formatChange, formatNumber } from '../lib/format';
const { Text } = Typography;

export const KpiCard = ({ item }) => {
  const TrendIcon = item.change > 0 ? ArrowUpOutlined : ArrowDownOutlined;

  return (
    <Card className={`dashboard-card dashboard-kpi${item.hero ? ' is-hero' : ''}`}>
      <Text className="dashboard-kpi__label">{item.label}</Text>
      <Statistic
        value={item.value ?? 0}
        suffix={item.value == null ? null : item.unit}
        formatter={(value) =>
          item.value == null
            ? '—'
            : item.formatValue
              ? item.formatValue(Number(value))
              : formatNumber(Number(value))
        }
      />
      {item.showComparison !== false && (
        <div className={`dashboard-kpi__change is-${item.change == null ? 'neutral' : item.tone}`}>
          {item.change == null ? (
            <Text type="secondary">{item.comparisonMessage || 'Chưa có dữ liệu so sánh'}</Text>
          ) : (
            <>
              {item.change !== 0 && <TrendIcon />}
              <Text strong>
                {item.changeUnit
                  ? `${formatChange(item.change).slice(0, -1)} ${item.changeUnit}`
                  : formatChange(item.change)}
              </Text>
              <Text type="secondary">{item.comparisonLabel}</Text>
            </>
          )}
        </div>
      )}
      <Text className="dashboard-kpi__detail" type="secondary">
        {item.detail}
      </Text>
    </Card>
  );
};

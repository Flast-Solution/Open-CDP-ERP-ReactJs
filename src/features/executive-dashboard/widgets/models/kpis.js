import { formatNumber } from '../../lib/format';

const moneyValue = (amount) => {
  if (amount >= 1_000_000_000) {
    return { value: amount / 1_000_000_000, unit: 'tỷ' };
  }
  if (amount >= 100_000) {
    return { value: amount / 1_000_000, unit: 'tr' };
  }
  return { value: amount, unit: 'đ' };
};

const formatMoneyValue = (amount) => {
  const { value, unit } = moneyValue(amount);
  return `${formatNumber(value)} ${unit}`;
};

const formatRate = (period) =>
  period.deliveredOrders ? (period.onTimeOrders / period.deliveredOrders) * 100 : null;

const formatRateValue = (value) =>
  new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);

const comparisonTone = (change) => {
  if (change == null || change === 0) {
    return 'neutral';
  }
  return change > 0 ? 'good' : 'bad';
};

export const mapMonthlySummaryToKpis = (data) => {
  const currentOnTimeRate = formatRate(data.onTimeDeliveries.currentMonth);

  const revenue = moneyValue(data.salesRevenue.currentMonth);
  const stockValue = moneyValue(data.inventory.currentMonth.amount);

  return [
    {
      id: 'sales',
      label: 'Doanh số',
      ...revenue,
      change: data.salesRevenue.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage: data.salesRevenue.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail: `Tháng trước: ${formatMoneyValue(data.salesRevenue.previousMonth)}`,
      tone: comparisonTone(data.salesRevenue.changePercent),
      hero: true,
    },
    {
      id: 'orders',
      label: 'Đơn mới',
      value: data.newOrders.currentMonth,
      change: data.newOrders.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage: data.newOrders.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail: `Tháng trước: ${formatNumber(data.newOrders.previousMonth)} đơn`,
      tone: comparisonTone(data.newOrders.changePercent),
    },
    {
      id: 'pipeline',
      label: 'Cơ hội phát sinh',
      value: data.opportunities.currentMonth,
      change: data.opportunities.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage:
        data.opportunities.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail: `Tháng trước: ${formatNumber(data.opportunities.previousMonth)} cơ hội`,
      tone: comparisonTone(data.opportunities.changePercent),
    },
    {
      id: 'ontime',
      label: 'Giao đúng hạn',
      value: currentOnTimeRate,
      unit: '%',
      showComparison: false,
      change: data.onTimeDeliveries.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage:
        data.onTimeDeliveries.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail:
        currentOnTimeRate == null
          ? 'Chưa có dữ liệu giao trong tháng'
          : `${data.onTimeDeliveries.currentMonth.onTimeOrders}/${data.onTimeDeliveries.currentMonth.deliveredOrders} đơn giao đúng hạn`,
      tone: comparisonTone(data.onTimeDeliveries.changePercent),
      formatValue: formatRateValue,
    },
    {
      id: 'stock',
      label: 'Giá trị tồn kho',
      ...stockValue,
      showComparison: false,
      change: data.inventory.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage: data.inventory.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail: `${formatNumber(data.inventory.currentMonth.orders)} đơn có hàng tồn`,
      tone: comparisonTone(data.inventory.changePercent),
    },
    {
      id: 'leads',
      label: 'Lead mới',
      value: data.newLeads.currentMonth,
      change: data.newLeads.changePercent,
      comparisonLabel: 'so tháng trước',
      comparisonMessage: data.newLeads.changePercent == null ? 'Chưa có dữ liệu so sánh' : null,
      detail: `Tháng trước: ${formatNumber(data.newLeads.previousMonth)} lead`,
      tone: comparisonTone(data.newLeads.changePercent),
    },
  ];
};

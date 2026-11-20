import { mapMonthlySummaryToKpis } from './kpis';

const summary = {
  salesRevenue: { currentMonth: 211098000, previousMonth: 100000, changePercent: 210998 },
  newOrders: { currentMonth: 4, previousMonth: 0, changePercent: null },
  opportunities: { currentMonth: 5, previousMonth: 3, changePercent: 66.66666666666667 },
  onTimeDeliveries: {
    currentMonth: { deliveredOrders: 0, onTimeOrders: 0 },
    previousMonth: { deliveredOrders: 2, onTimeOrders: 1 },
    changePercent: -100,
  },
  inventory: {
    currentMonth: { orders: 1, amount: 500 },
    previousMonth: { orders: 1, amount: 500 },
    changePercent: 0,
  },
  newLeads: { currentMonth: 0, previousMonth: 3, changePercent: -100 },
};

describe('monthly summary KPI mapping', () => {
  it('maps all six KPI cards from API values and comparisons', () => {
    const kpis = mapMonthlySummaryToKpis(summary);

    expect(kpis).toHaveLength(6);
    expect(kpis.find((item) => item.id === 'sales')).toMatchObject({
      value: 211.098,
      unit: 'tr',
      change: 210998,
      detail: 'Tháng trước: 0,1 tr',
    });
    expect(kpis.find((item) => item.id === 'orders')).toMatchObject({
      value: 4,
      change: null,
      comparisonMessage: 'Chưa có dữ liệu so sánh',
    });
    expect(kpis.find((item) => item.id === 'pipeline')).toMatchObject({
      label: 'Cơ hội phát sinh',
      value: 5,
      change: 66.66666666666667,
    });
    expect(kpis.find((item) => item.id === 'ontime')).toMatchObject({
      value: null,
      change: -100,
      comparisonMessage: null,
    });
    expect(kpis.find((item) => item.id === 'stock')).toMatchObject({
      value: 500,
      unit: 'đ',
      change: 0,
    });
    expect(kpis.find((item) => item.id === 'leads')).toMatchObject({
      value: 0,
      change: -100,
    });
  });

  it('uses API changePercent for nested metrics', () => {
    const kpis = mapMonthlySummaryToKpis(summary);

    expect(kpis.find((item) => item.id === 'ontime')).toMatchObject({
      value: null,
      change: -100,
    });
    expect(kpis.find((item) => item.id === 'stock')).toMatchObject({
      change: 0,
    });
  });
});

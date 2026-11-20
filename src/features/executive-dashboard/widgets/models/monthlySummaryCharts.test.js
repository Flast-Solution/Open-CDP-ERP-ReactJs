import {
  getTopCustomerShare,
  getTopSource,
  mapSalesByLeadSource,
  mapTopCustomers,
  mapTopEmployees,
} from './monthlySummaryCharts';

const summary = {
  salesRevenue: { currentMonth: 100000000 },
  topCustomers: [
    { customerId: 101, customerName: 'Công ty A', revenue: 70000000, orderCount: 4 },
    { customerId: null, customerName: 'Khách hàng B', revenue: 20000000, orderCount: 2 },
  ],
  topEmployees: [
    { employeeId: 12, employeeName: 'Nguyễn Văn B', revenue: 60000000, orderCount: 5 },
  ],
  salesByLeadSource: [
    { sourceId: 2, sourceName: 'Zalo', revenue: 30000000, orderCount: 3 },
    { sourceId: 1, sourceName: 'Facebook', revenue: 25000000, orderCount: 2 },
  ],
};

describe('monthly summary chart mapping', () => {
  it('maps top customers and computes their share of monthly revenue', () => {
    const customers = mapTopCustomers(summary);

    expect(customers).toEqual([
      {
        key: 101,
        name: 'Công ty A',
        revenue: 70000000,
        orderCount: 4,
        share: 70,
      },
      {
        key: 'Khách hàng B-1',
        name: 'Khách hàng B',
        revenue: 20000000,
        orderCount: 2,
        share: 20,
      },
    ]);
    expect(getTopCustomerShare(customers)).toBe(90);
  });

  it('maps employee and lead-source chart values directly from the API', () => {
    expect(mapTopEmployees(summary)).toEqual([
      {
        key: 12,
        rank: 1,
        name: 'Nguyễn Văn B',
        revenue: 60000000,
        orders: 5,
      },
    ]);
    expect(mapSalesByLeadSource(summary)).toMatchObject([
      { key: 2, channel: 'Zalo', revenue: 30000000, orderCount: 3, color: '#1677ff' },
      { key: 1, channel: 'Facebook', revenue: 25000000, orderCount: 2, color: '#1baf7a' },
    ]);
    expect(getTopSource(mapSalesByLeadSource(summary)).channel).toBe('Zalo');
  });

  it('does not substitute mock chart data when the API omits chart arrays', () => {
    expect(mapTopCustomers({ salesRevenue: { currentMonth: 0 } })).toBeNull();
    expect(mapTopEmployees({})).toBeNull();
    expect(mapSalesByLeadSource({})).toBeNull();
  });
});

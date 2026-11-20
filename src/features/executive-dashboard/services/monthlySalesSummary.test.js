import { RequestUtils } from 'utils/strictRequest';
import monthlySalesSummaryService from './monthlySalesSummary';

jest.mock('utils/strictRequest', () => ({
  RequestUtils: {
    strict: {
      get: jest.fn(),
    },
  },
}));

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

const summaryWithCharts = {
  ...summary,
  topCustomers: [
    [101, 'Công ty A', 70000000, 4],
    [null, 'Khách hàng B', 30000000, 2],
  ],
  topEmployees: [[12, 'Nguyễn Văn B', 60000000, 5]],
  salesByLeadSource: [[2, 'Zalo', 30000000, 3]],
};

describe('monthly sales summary service', () => {
  beforeEach(() => {
    RequestUtils.strict.get.mockReset();
  });

  it('requests and validates the monthly summary contract', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: summary,
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).resolves.toEqual(summary);
    expect(RequestUtils.strict.get).toHaveBeenCalledWith('/erp/dashboard/monthly-sales-summary');
  });

  it('rejects invalid KPI values instead of using mock data', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: { ...summary, newLeads: { currentMonth: '0', previousMonth: 3, changePercent: -100 } },
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).rejects.toThrow(
      'Dữ liệu tổng quan kinh doanh không hợp lệ: newLeads.',
    );
  });

  it('validates chart arrays from the monthly summary contract', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: summaryWithCharts,
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).resolves.toEqual({
      ...summary,
      topCustomers: [
        { customerId: 101, customerName: 'Công ty A', revenue: 70000000, orderCount: 4 },
        { customerId: null, customerName: 'Khách hàng B', revenue: 30000000, orderCount: 2 },
      ],
      topEmployees: [
        { employeeId: 12, employeeName: 'Nguyễn Văn B', revenue: 60000000, orderCount: 5 },
      ],
      salesByLeadSource: [{ sourceId: 2, sourceName: 'Zalo', revenue: 30000000, orderCount: 3 }],
    });
  });

  it('accepts empty lead-source results with tuple customer and employee rows', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: {
        ...summary,
        topCustomers: [[62, 'MR.URANO', 11529, 1]],
        topEmployees: [[1649, 'Admin', 11529, 1]],
        salesByLeadSource: [],
      },
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).resolves.toEqual({
      ...summary,
      topCustomers: [{ customerId: 62, customerName: 'MR.URANO', revenue: 11529, orderCount: 1 }],
      topEmployees: [{ employeeId: 1649, employeeName: 'Admin', revenue: 11529, orderCount: 1 }],
      salesByLeadSource: [],
    });
  });

  it('rejects malformed chart rows', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: {
        ...summaryWithCharts,
        topCustomers: [[101, 'Công ty A', '70000000', 4]],
      },
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).rejects.toThrow(
      'Dữ liệu tổng quan kinh doanh không hợp lệ: topCustomers[0][2] (revenue).',
    );
  });

  it('rejects chart tuples with an unexpected number of values', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: {
        ...summaryWithCharts,
        topCustomers: [[101, 'Công ty A', 70000000]],
      },
    });

    await expect(monthlySalesSummaryService.getMonthlySalesSummary()).rejects.toThrow(
      'Dữ liệu tổng quan kinh doanh không hợp lệ: topCustomers[0] (expected tuple of 4 values).',
    );
  });
});

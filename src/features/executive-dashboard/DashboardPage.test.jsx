import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { RequestUtils } from 'utils/strictRequest';
import NewFeed from 'pages/newFeed';

jest.mock('utils/strictRequest', () => ({ RequestUtils: { strict: { get: jest.fn() } } }));
jest.mock('@ant-design/plots', () => ({
  Area: () => null,
  Column: () => null,
  Pie: () => null,
  Bar: () => null,
}));

// Mẫu NewFeed thực tế, rút gọn danh sách phải thu. Hai nhóm công nợ theo FINANCE-REPORT-API.md.
const reports = {
  '/erp/dashboard/monthly-sales-summary': {
    salesRevenue: { currentMonth: 2.11098e8, previousMonth: 100000, changePercent: 210998 },
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
    topCustomers: [
      [59, 'Bùi Đức Hùng', 1.99999e8, 2],
      [56, 'Nguyễn Mai Phương Uyên', 1.1099e7, 2],
    ],
    topEmployees: [[2, 'Administrator', 2.11098e8, 4]],
    salesByLeadSource: [[11, 'Web', 2.11098e8, 4]],
  },
  '/erp/dashboard/manufacture-weekly-summary': {
    weeklySummary: [
      ['01', '01'],
      ['02', '08'],
      ['09', '15'],
      ['16', '22'],
      ['23', '29'],
      ['30', '30'],
    ].map(([start, end], i) => ({
      week: i + 1,
      weekStart: `2026-11-${start}`,
      weekEnd: `2026-11-${end}`,
      delayed: i < 2 ? 1 : 0,
      inProgress: 0,
      expectedToFinish: 0,
      notStarted: 0,
    })),
    ordersDueForManufacture: [],
  },
  '/erp/dashboard/business-alerts': {
    deliveryRisk: {
      count: 2,
      items: [
        [34052, 'OEKR2326FJT', null, 1791763200000, 1],
        [34039, 'ORHC3326LYB', null, 1791936000000, 700],
      ],
    },
    accountsReceivable: {
      count: 1,
      items: [[34015, 'OXHL3226VQG', null, 46, 5.5e8, 0, 5.5e8]],
      totalOutstanding: 5.5e8,
    },
    materialShortage: { count: 0, items: [] },
    inventory: { count: 1, items: [], stockQuantity: 701 },
    conversations: { count: 0, items: [] },
    accountsPayable: { count: 0, items: [] },
  },
  '/finance/debt-report': {
    accountsReceivable: {
      openCount: 12,
      openAmount: 92000000,
      overdueCount: 3,
      overdueAmount: 18000000,
      dueWithinWeekCount: 0,
      dueWithinWeekAmount: 0,
    },
    accountsPayable: {
      openCount: 7,
      openAmount: 45000000,
      overdueCount: 1,
      overdueAmount: 5000000,
      dueWithinWeekCount: 2,
      dueWithinWeekAmount: 10000000,
    },
  },
};

test('NewFeed loads all four reports once and keeps dashboard data visible if finance refresh fails', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  const originalMatchMedia = window.matchMedia;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = () => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() });
  let failFinance = false;
  RequestUtils.strict.get.mockImplementation(async (path) => {
    if (failFinance && path === '/finance/debt-report') throw new Error('Lỗi tải công nợ');
    return { errorCode: 200, success: true, message: 'success', data: reports[path] };
  });
  try {
    await act(async () =>
      root.render(
        <MemoryRouter>
          <NewFeed />
        </MemoryRouter>,
      ),
    );
    expect(RequestUtils.strict.get.mock.calls.flat().sort()).toEqual(Object.keys(reports).sort());
    expect(container.textContent).toContain('Bùi Đức Hùng');
    expect(container.textContent).toContain('Web dẫn đầu');
    expect(container.textContent).toContain('Gần nhất: ORHC3326LYB');
    expect(container.textContent).toContain('701 đơn vị');
    expect(container.textContent).toContain('Chưa có đơn cần sản xuất');
    expect(container.textContent).toContain('Chưa có dòng thiếu nguyên phụ liệu');
    expect(container.textContent).toContain('92.000.000 đ');
    expect(container.textContent).toContain('45.000.000 đ');
    failFinance = true;
    const refresh = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Làm mới',
    );
    await act(async () => refresh.click());
    expect(RequestUtils.strict.get).toHaveBeenCalledTimes(8);
    expect(container.textContent).not.toContain('Lỗi tải công nợ');
    expect(container.querySelectorAll('.dashboard-empty-state')).toHaveLength(2);
    expect(container.textContent).not.toContain('45.000.000 đ');
    expect(container.textContent).toContain('Web dẫn đầu');
  } finally {
    await act(async () => root.unmount());
    window.matchMedia = originalMatchMedia;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});

test('NewFeed shows no-data states instead of error banners when all reports fail', async () => {
  const container = document.createElement('div');
  const root = createRoot(container);
  const originalMatchMedia = window.matchMedia;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = () => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() });
  RequestUtils.strict.get.mockReset();
  RequestUtils.strict.get.mockRejectedValue(new Error('Network Error: backend unavailable'));
  try {
    await act(async () => root.render(<MemoryRouter><NewFeed /></MemoryRouter>));
    expect(RequestUtils.strict.get).toHaveBeenCalledTimes(4);
    expect(container.querySelectorAll('.dashboard-empty-state')).toHaveLength(10);
    expect(container.querySelector('.ant-alert-error')).toBeNull();
    expect(container.textContent).not.toContain('Không thể tải');
    expect(container.textContent).not.toContain('Network Error');
    expect(container.textContent.match(/Dữ liệu mẫu/g)).toHaveLength(9);
    expect(container.querySelectorAll('.dashboard-section')).toHaveLength(7);
  } finally {
    await act(async () => root.unmount());
    window.matchMedia = originalMatchMedia;
    delete global.IS_REACT_ACT_ENVIRONMENT;
  }
});

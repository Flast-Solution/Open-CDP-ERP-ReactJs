const salesDaysElapsed = 21;
const salesDaysInMonth = 30;
const currentMonthSales = [
  165, 337, 495, 704, 800, 840, 1028, 1204, 1409, 1599, 1830, 1918, 1953, 2151, 2391, 2616, 2829,
  3090, 3194, 3252, 3420,
];
const previousMonthSales = [
  67, 110, 254, 416, 581, 764, 961, 1050, 1089, 1243, 1420, 1589, 1795, 1985, 2066, 2116, 2281,
  2464, 2681, 2883, 3054,
];
const salesPlan = Array.from(
  { length: salesDaysInMonth },
  (_, index) => (3800 * (index + 1)) / salesDaysInMonth,
);

export const dashboardSalesDaysElapsed = salesDaysElapsed;

export const dashboardSalesTrend = [
  ...currentMonthSales.map((value, index) => ({
    day: index + 1,
    date: `${String(index + 1).padStart(2, '0')}/09`,
    value,
    series: 'Tháng này',
  })),
  ...previousMonthSales.map((value, index) => ({
    day: index + 1,
    date: `${String(index + 1).padStart(2, '0')}/09`,
    value,
    series: 'Tháng trước',
  })),
  ...salesPlan.map((value, index) => ({
    day: index + 1,
    date: `${String(index + 1).padStart(2, '0')}/09`,
    value,
    series: 'Kế hoạch',
  })),
];

export const dashboardFunnel = [
  { stage: 'Hội thoại', value: 1240 },
  { stage: 'Lead', value: 312 },
  { stage: 'Cơ hội', value: 124 },
  { stage: 'Đơn hàng', value: 86 },
];

export const dashboardChannelReplies = [
  { channel: 'Zalo', minutes: 18, color: '#1677ff' },
  { channel: 'Facebook', minutes: 47, color: '#1baf7a' },
];

export const dashboardDefectRate = [
  { week: '27/07', value: 3.6 },
  { week: '03/08', value: 3.7 },
  { week: '10/08', value: 3.4 },
  { week: '17/08', value: 3.3 },
  { week: '24/08', value: 3.3 },
  { week: '31/08', value: 3.0 },
  { week: '07/09', value: 3.0 },
  { week: '14/09', value: 2.8 },
];

export const dashboardStockCategories = [
  { category: 'Nguyên liệu vải', value: 1100, color: '#1677ff' },
  { category: 'Thành phẩm', value: 400, color: '#1baf7a' },
  { category: 'Phụ liệu', value: 380, color: '#4a3aa7' },
  { category: 'Bán thành phẩm', value: 270, color: '#e87ba4' },
];

export const dashboardStockAge = [
  { label: '0–30 ngày', value: 820, share: 38, color: '#1677ff' },
  { label: '31–60 ngày', value: 560, share: 26, color: '#3987e5' },
  { label: '61–90 ngày', value: 350, share: 16, color: '#faad14' },
  { label: '> 90 ngày', value: 420, share: 20, color: '#ff4d4f' },
];

export const dashboardReceivables = {
  total: 2850000000,
  overdue: 640000000,
  overdueMoreThan60Days: 150000000,
  customers: 5,
  monthlyChange: 15,
  aging: [
    { label: 'Chưa đến hạn', value: 2210, color: '#7b8ea8' },
    { label: 'Quá hạn 1–30 ngày', value: 310, color: '#e0a020' },
    { label: 'Quá hạn 31–60 ngày', value: 180, color: '#d97a26' },
    { label: 'Quá hạn 61–90 ngày', value: 90, color: '#cc4a2c' },
    { label: 'Quá hạn > 90 ngày', value: 60, color: '#9e1c2b' },
  ],
};

export const dashboardDebtors = [
  { name: 'May Việt Tiến Chi nhánh 2', total: 690, overdue: 50 },
  { name: 'Công ty TNHH Dệt Minh Anh', total: 480, overdue: 90 },
  { name: 'Đồng phục Hải Phong', total: 420, overdue: 160 },
  { name: 'Xưởng may Tân Phú', total: 390, overdue: 210 },
  { name: 'Thời trang Linh Chi', total: 310, overdue: 130 },
];

export const dashboardCashflow = [
  { week: 'Tuần 1', range: '21–27/09', type: 'Thu dự kiến', value: 520 },
  { week: 'Tuần 1', range: '21–27/09', type: 'Trả dự kiến', value: 380 },
  { week: 'Tuần 2', range: '28/09–04/10', type: 'Thu dự kiến', value: 410 },
  { week: 'Tuần 2', range: '28/09–04/10', type: 'Trả dự kiến', value: 620 },
  { week: 'Tuần 3', range: '05–11/10', type: 'Thu dự kiến', value: 680 },
  { week: 'Tuần 3', range: '05–11/10', type: 'Trả dự kiến', value: 290 },
  { week: 'Tuần 4', range: '12–18/10', type: 'Thu dự kiến', value: 450 },
  { week: 'Tuần 4', range: '12–18/10', type: 'Trả dự kiến', value: 430 },
];

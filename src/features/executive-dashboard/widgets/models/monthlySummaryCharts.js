import { formatCompactMoney, formatNumber } from '../../lib/format';
import { numberColumn, textColumn } from '../../lib/columns';
import { chartBase, columnChart, topColumnLabel, tooltipFormatter } from '../../lib/chart';

const sourceColors = {
  1: '#1baf7a',
  2: '#1677ff',
  4: '#4a3aa7',
  11: '#e87ba4',
};

const getRows = (data, key) => (Array.isArray(data?.[key]) ? data[key] : null);

const formatShare = (value) => (value == null ? '—' : `${formatNumber(Number(value.toFixed(1)))}%`);

export const mapTopCustomers = (data) => {
  const customers = getRows(data, 'topCustomers');
  if (!customers) {
    return null;
  }

  const totalRevenue = data.salesRevenue.currentMonth;
  return customers.map((customer, index) => ({
    key: customer.customerId ?? `${customer.customerName ?? 'customer'}-${index}`,
    name: customer.customerName || 'Chưa xác định',
    revenue: customer.revenue,
    orderCount: customer.orderCount,
    share: totalRevenue > 0 ? (customer.revenue / totalRevenue) * 100 : null,
  }));
};

export const mapTopEmployees = (data) => {
  const employees = getRows(data, 'topEmployees');
  if (!employees) {
    return null;
  }

  return employees.map((employee, index) => ({
    key: employee.employeeId ?? `${employee.employeeName ?? 'employee'}-${index}`,
    rank: index + 1,
    name: employee.employeeName || 'Chưa xác định',
    revenue: employee.revenue,
    orders: employee.orderCount,
  }));
};

export const mapSalesByLeadSource = (data) => {
  const sources = getRows(data, 'salesByLeadSource');
  if (!sources) {
    return null;
  }

  return sources.map((source) => ({
    key: source.sourceId,
    sourceId: source.sourceId,
    channel: source.sourceName,
    revenue: source.revenue,
    orderCount: source.orderCount,
    color: sourceColors[source.sourceId],
  }));
};

export const getTopCustomerShare = (customers) => {
  if (!customers || customers.length === 0) {
    return null;
  }
  if (customers.some((customer) => customer.share == null)) {
    return null;
  }
  return customers.reduce((total, customer) => total + customer.share, 0);
};

export const getTopSource = (sources) =>
  sources?.reduce((top, source) => (source.revenue > top.revenue ? source : top), sources[0]) ??
  null;

export const leadSourceChartConfig = (sources) =>
  columnChart({
    ...chartBase,
    data: sources,
    xField: 'channel',
    yField: 'revenue',
    seriesField: 'channel',
    color: sources.map((source) => source.color),
    padding: [20, 2, 26, 2],
    legend: false,
    label: topColumnLabel((datum) => formatCompactMoney(datum.revenue), { fill: '#595959' }),
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: false,
        style: {
          fontSize: 10,
        },
      },
      tickLine: null,
      line: {
        style: {
          stroke: '#f0f0f0',
        },
      },
    },
    hideYAxis: true,
    tooltip: {
      formatter: tooltipFormatter('channel', (datum) => formatCompactMoney(datum.revenue)),
    },
  });

export const customerColumns = [
  textColumn('Khách hàng', 'name'),
  numberColumn('Doanh số', 'revenue', (value) => `${formatNumber(value)} đ`),
  numberColumn('Số đơn', 'orderCount'),
  {
    title: 'Tỷ trọng',
    dataIndex: 'share',
    align: 'right',
    render: formatShare,
  },
];

export const leadSourceColumns = [
  textColumn('Nguồn lead', 'channel'),
  numberColumn('Doanh số', 'revenue', (value) => `${formatNumber(value)} đ`),
  numberColumn('Số đơn', 'orderCount'),
];

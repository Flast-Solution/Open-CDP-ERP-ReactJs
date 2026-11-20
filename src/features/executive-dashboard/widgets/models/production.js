import { dashboardDefectRate } from '../../mockData';
import { numberColumn, textColumn } from '../../lib/columns';
import { chartBase, columnChart, tooltipFormatter } from '../../lib/chart';

export const latestDefectRate = dashboardDefectRate[dashboardDefectRate.length - 1].value;

export const lowestDefectRate = Math.min(...dashboardDefectRate.map((item) => item.value));

const weeklyStatusFields = [
  { field: 'inProgress', label: 'Đang sản xuất', color: '#1677ff' },
  { field: 'delayed', label: 'Trễ tiến độ', color: '#ff4d4f' },
  { field: 'expectedToFinish', label: 'Dự kiến hoàn thành', color: '#faad14' },
  { field: 'notStarted', label: 'Chưa bắt đầu', color: '#8c8c8c' },
];

export const mapWeeklySummaryToChart = (weeklySummary) =>
  weeklySummary.flatMap((week) =>
    weeklyStatusFields.map(({ field, label }) => ({
      week: `Tuần ${week.week}`,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      status: label,
      value: week[field],
    })),
  );

export const weeklySummaryColumns = [
  textColumn('Tuần', 'weekLabel'),
  textColumn('Thời gian', 'dateRange'),
  numberColumn('Đang sản xuất', 'inProgress'),
  numberColumn('Trễ tiến độ', 'delayed'),
  numberColumn('Dự kiến hoàn thành', 'expectedToFinish'),
  numberColumn('Chưa bắt đầu', 'notStarted'),
];

export const mapWeeklySummaryToTable = (weeklySummary) =>
  weeklySummary.map((week) => ({
    ...week,
    key: week.week,
    weekLabel: `Tuần ${week.week}`,
    dateRange: `${week.weekStart} – ${week.weekEnd}`,
  }));

export const productionStatusLegend = weeklyStatusFields.map(({ label, color }) => ({
  label,
  color,
}));

export const createProductionConfig = (data) =>
  columnChart({
    ...chartBase,
    data,
    xField: 'week',
    yField: 'value',
    seriesField: 'status',
    isStack: true,
    color: weeklyStatusFields.map(({ color }) => color),
    meta: {
      status: {
        values: weeklyStatusFields.map(({ label }) => label),
      },
    },
    legend: false,
    xAxis: {
      grid: null,
    },
    yAxis: {
      min: 0,
    },
    tooltip: {
      formatter: tooltipFormatter('status', 'value'),
    },
  });

const formatDeadline = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));

export const mapOrdersDueForManufacture = (orders) =>
  orders.map((order) => ({
    ...order,
    key: order.orderId,
    deadlineLabel: formatDeadline(order.deliveryDeadline),
    remainingQuantity: order.totalQuantity - order.producedQuantity,
    progressPercent: (order.producedQuantity / order.totalQuantity) * 100,
  }));

export const ordersDueForManufactureColumns = [
  textColumn('Mã đơn', 'orderCode'),
  textColumn('Hạn giao', 'deadlineLabel'),
  numberColumn('Tiến độ', 'progressPercent', (value) => `${value.toFixed(1)}%`),
  numberColumn('Đã sản xuất', 'producedQuantity'),
  numberColumn('Tổng cần sản xuất', 'totalQuantity'),
  numberColumn('Còn thiếu', 'remainingQuantity'),
];

export const defectRateConfig = {
  ...chartBase,
  data: dashboardDefectRate,
  xField: 'week',
  yField: 'value',
  smooth: true,
  color: '#1677ff',
  point: {
    size: 3,
    shape: 'circle',
    style: {
      fill: '#1677ff',
      stroke: '#fff',
      lineWidth: 2,
    },
  },
  areaStyle: {
    fill: '#1677ff',
    fillOpacity: 0.1,
  },
  legend: false,
  annotations: [
    {
      type: 'text',
      position: ['14/09', 2.8],
      content: '2,8%',
      offsetX: -16,
      offsetY: -10,
      style: {
        fill: '#1f1f1f',
        fontSize: 11,
        fontWeight: 600,
        textAlign: 'right',
      },
    },
  ],
  xAxis: {
    label: {
      autoRotate: false,
      autoHide: false,
      style: {
        fontSize: 10,
      },
    },
    line: null,
    tickLine: null,
  },
  yAxis: {
    min: 0,
    max: 4,
    tickCount: 3,
    label: {
      formatter: (value) => `${value}%`,
    },
    grid: {
      line: {
        style: {
          stroke: '#f0f0f0',
        },
      },
    },
  },
  tooltip: {
    formatter: tooltipFormatter(
      () => 'Tỷ lệ lỗi',
      (datum) => `${datum.value}%`,
    ),
  },
};

export const productionDefectTable = dashboardDefectRate.map((item) => ({
  ...item,
  key: item.week,
}));

export const productionDefectColumns = [
  textColumn('Tuần từ', 'week'),
  numberColumn('Tỷ lệ lỗi', 'value', (value) => `${value}%`),
];

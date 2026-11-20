import { sumBy } from './common';
import { dashboardReceivables, dashboardDebtors, dashboardCashflow } from '../../mockData';
import { MILLION, formatMillion } from '../../lib/format';
import { numberColumn, textColumn } from '../../lib/columns';
import {
  chartBase,
  columnChart,
  topColumnLabel,
  tooltipFormatter,
} from '../../lib/chart';
import { pivot } from '../../lib/pivot';

export const receivableTotalMillions = dashboardReceivables.total / MILLION;

export const receivableOverdueMillions = dashboardReceivables.overdue / MILLION;

export const receivableAging = dashboardReceivables.aging;

export const overdueShare = Math.round(
  (receivableOverdueMillions / receivableTotalMillions) * 100,
);

export const overdueWithin30DaysShare = Math.round(
  (receivableAging[1].value / receivableOverdueMillions) * 100,
);

export const debtorMaxTotal = Math.max(...dashboardDebtors.map((item) => item.total));

export const topOverdueDebtors = [...dashboardDebtors]
  .sort((left, right) => right.overdue - left.overdue)
  .slice(0, 2);

export const topOverdueDebtorShare = Math.round(
  (sumBy(topOverdueDebtors, (item) => item.overdue) / receivableOverdueMillions) * 100,
);

export const cashflowConfig = columnChart({
  ...chartBase,
  data: dashboardCashflow,
  isGroup: true,
  xField: 'week',
  yField: 'value',
  seriesField: 'type',
  colorField: 'type',
  color: ['#1677ff', '#e87ba4'],
  legend: false,
  meta: {
    value: {
      min: 0,
      max: 760,
    },
  },
  padding: [22, 4, 38, 4],
  label: topColumnLabel((datum) => String(datum.value)),
  xAxis: {
    label: {
      style: {
        fontSize: 10,
      },
    },
    line: {
      style: {
        stroke: '#f0f0f0',
      },
    },
    tickLine: null,
    grid: null,
  },
  hideYAxis: true,
  tooltip: {
    formatter: tooltipFormatter('type', (datum) => formatMillion(datum.value)),
  },
});

export const cashflowTable = pivot(dashboardCashflow, {
  indexBy: (item) => item.week,
  createRow: (item) => ({
    key: item.week,
    week: item.week,
    range: item.range,
  }),
  columnBy: (item) => item.type,
  valueBy: (item) => item.value,
});

export const cashflowSummary = cashflowTable.map((item) => ({
  ...item,
  net: item['Thu dự kiến'] - item['Trả dự kiến'],
}));

export const cashflowWeekTwo = cashflowSummary.find((item) => item.week === 'Tuần 2');

export const overdueAging = receivableAging.slice(1).map((item) => ({
  label: item.label.replace('Quá hạn ', ''),
  value: item.value,
  color: item.color,
}));

export const receivableAgingColumns = [
  textColumn('Nhóm tuổi nợ', 'label'),
  numberColumn('Số tiền', 'value', formatMillion),
  numberColumn('Tỷ trọng', 'share', (value) => `${value}%`),
];

export const receivableAgingTable = receivableAging.map((item) => ({
  ...item,
  key: item.label,
  share: Math.round((item.value / receivableTotalMillions) * 100),
}));

export const receivableAgingConfig = columnChart({
  ...chartBase,
  data: overdueAging,
  xField: 'label',
  yField: 'value',
  seriesField: 'label',
  color: overdueAging.map((item) => item.color),
  meta: {
    label: {
      values: overdueAging.map((item) => item.label),
    },
    value: {
      min: 0,
      max: 360,
    },
  },
  padding: [24, 4, 26, 4],
  legend: false,
  label: topColumnLabel((datum) => String(datum.value)),
  xAxis: {
    label: {
      style: {
        fill: '#8c8c8c',
        fontSize: 9,
      },
    },
    line: null,
    tickLine: null,
    grid: null,
  },
  hideYAxis: true,
  tooltip: {
    formatter: tooltipFormatter('label', (datum) => formatMillion(datum.value)),
  },
});

export const debtorColumns = [
  textColumn('Khách hàng', 'name'),
  numberColumn('Tổng nợ', 'total', formatMillion),
  numberColumn('Quá hạn', 'overdue', formatMillion),
];

export const debtorTable = dashboardDebtors.map((item) => ({
  ...item,
  key: item.name,
}));

export const cashflowColumns = [
  textColumn('Thời gian', 'range'),
  numberColumn('Thu dự kiến', 'Thu dự kiến', formatMillion),
  numberColumn('Trả dự kiến', 'Trả dự kiến', formatMillion),
  numberColumn('Thuần', 'net', formatMillion),
];

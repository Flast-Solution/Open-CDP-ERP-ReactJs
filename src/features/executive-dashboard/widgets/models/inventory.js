import { sumBy } from './common';
import { dashboardStockCategories, dashboardStockAge } from '../../mockData';
import { MILLION, formatMillion, formatCompactMoney } from '../../lib/format';
import { numberColumn, textColumn } from '../../lib/columns';
import {
  chartBase,
  columnChart,
  topColumnLabel,
  tooltipFormatter,
} from '../../lib/chart';

export const stockCategoryTotal = sumBy(dashboardStockCategories, (item) => item.value);

export const highestStockCategory = dashboardStockCategories.reduce((top, item) =>
  item.value > top.value ? item : top,
);

export const highestStockCategoryShare = Math.round(
  (highestStockCategory.value / stockCategoryTotal) * 100,
);

export const agedStock = dashboardStockAge.find((item) => item.label === '> 90 ngày');

export const stockConfig = {
  ...chartBase,
  data: dashboardStockCategories,
  angleField: 'value',
  colorField: 'category',
  color: ['#1677ff', '#1baf7a', '#4a3aa7', '#e87ba4'],
  radius: 0.94,
  innerRadius: 0.68,
  legend: false,
  label: false,
  statistic: {
    title: {
      style: {
        fontSize: 20,
        fontWeight: 600,
      },
      formatter: () => formatCompactMoney(stockCategoryTotal * MILLION),
    },
    content: {
      style: {
        fontSize: 12,
        color: '#8c8c8c',
      },
      formatter: () => 'Tổng tồn kho',
    },
  },
  tooltip: {
    formatter: tooltipFormatter('category', (datum) => formatMillion(datum.value)),
  },
};

export const stockAgeConfig = columnChart({
  ...chartBase,
  data: dashboardStockAge,
  xField: 'label',
  yField: 'value',
  seriesField: 'label',
  color: ['#3987e5', '#3987e5', '#3987e5', '#c98200'],
  meta: {
    label: {
      values: dashboardStockAge.map((item) => item.label),
    },
    value: {
      min: 0,
      max: 1000,
    },
  },
  padding: [34, 8, 4, 8],
  legend: false,
  label: topColumnLabel((datum) => formatMillion(datum.value)),
  xAxis: {
    label: false,
    tickLine: null,
    line: {
      style: {
        stroke: '#d9d9d9',
      },
    },
    grid: null,
  },
  hideYAxis: true,
  tooltip: {
    formatter: tooltipFormatter('label', (datum) => formatMillion(datum.value)),
  },
});

export const stockCategoriesTable = dashboardStockCategories.map((item) => ({
  ...item,
  key: item.category,
  share: `${((item.value / stockCategoryTotal) * 100).toFixed(0)}%`,
}));

export const stockAgeTable = dashboardStockAge.map((item) => ({
  ...item,
  key: item.label,
}));

export const stockCategoryColumns = [
  textColumn('Loại tồn kho', 'category'),
  numberColumn('Giá trị', 'value', formatMillion),
  {
    title: 'Tỷ trọng',
    dataIndex: 'share',
    align: 'right',
  },
];

export const stockAgeColumns = [
  textColumn('Thời gian tồn', 'label'),
  numberColumn('Giá trị', 'value', formatMillion),
  numberColumn('Tỷ trọng', 'share', (value) => `${value}%`),
];

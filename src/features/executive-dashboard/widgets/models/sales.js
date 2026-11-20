import { dashboardSalesDaysElapsed, dashboardSalesTrend, dashboardFunnel } from '../../mockData';
import { MILLION, formatMillion, formatCompactMoney } from '../../lib/format';
import { numberColumn, textColumn } from '../../lib/columns';
import { chartBase, chartGridLine, tooltipFormatter } from '../../lib/chart';
import { pivot } from '../../lib/pivot';
import { COLORS } from '../../lib/theme';

export const salesTrendDays = Math.max(...dashboardSalesTrend.map((item) => item.day));

export const salesTrendMaxValue = Math.max(...dashboardSalesTrend.map((item) => item.value));

export const currentSalesValue = dashboardSalesTrend.find(
  (item) => item.series === 'Tháng này' && item.day === dashboardSalesDaysElapsed,
)?.value;

export const plannedSalesValue = dashboardSalesTrend.find(
  (item) => item.series === 'Kế hoạch' && item.day === salesTrendDays,
)?.value;

export const salesPlanAtElapsedDays = dashboardSalesTrend.find(
  (item) => item.series === 'Kế hoạch' && item.day === dashboardSalesDaysElapsed,
)?.value;

export const previousSalesAtElapsedDays = dashboardSalesTrend.find(
  (item) => item.series === 'Tháng trước' && item.day === dashboardSalesDaysElapsed,
)?.value;

export const salesPlanProgressPercent = Math.round((currentSalesValue / plannedSalesValue) * 100);

export const salesAheadOfPlanPercent = Math.round(
  ((currentSalesValue - salesPlanAtElapsedDays) / salesPlanAtElapsedDays) * 100,
);

export const salesMonthChangePercent = Math.round(
  ((currentSalesValue - previousSalesAtElapsedDays) / previousSalesAtElapsedDays) * 100,
);

export const conversationToOrderPercent = Math.round(
  (dashboardFunnel[dashboardFunnel.length - 1].value / dashboardFunnel[0].value) * 100,
);

export const conversationToLeadPercent = Math.round(
  (dashboardFunnel[1].value / dashboardFunnel[0].value) * 100,
);

export const salesTrendConfig = {
  ...chartBase,
  data: dashboardSalesTrend,
  xField: 'day',
  yField: 'value',
  seriesField: 'series',
  smooth: false,
  color: (datum) =>
    ({
      'Tháng này': COLORS.blue,
      'Tháng trước': COLORS.gray,
      'Kế hoạch': '#595959',
    })[datum.series],
  areaStyle: (datum) => ({
    fillOpacity: datum.series === 'Tháng này' ? 0.1 : 0,
  }),
  line: {
    style: (datum) => ({
      lineDash: datum.series === 'Kế hoạch' ? [5, 4] : [],
      lineWidth: datum.series === 'Kế hoạch' ? 1.5 : 2,
    }),
  },
  point: {
    size: (datum) => {
      const isEndPoint = datum.day === dashboardSalesDaysElapsed || datum.day === 30;
      return isEndPoint && (datum.series === 'Tháng này' || datum.series === 'Kế hoạch') ? 4 : 0;
    },
    shape: 'circle',
    style: {
      stroke: '#ffffff',
      lineWidth: 2,
    },
  },
  legend: false,
  padding: [12, 38, 36, 44],
  meta: {
    day: {
      min: 1,
      max: salesTrendDays,
      ticks: [1, 7, 14, 21, 28].filter((day) => day <= salesTrendDays),
      nice: false,
    },
    value: {
      min: 0,
      max: Math.ceil(salesTrendMaxValue / 1000) * 1000,
      ticks: Array.from(
        { length: Math.ceil(salesTrendMaxValue / 1000) + 1 },
        (_, index) => index * 1000,
      ),
      nice: false,
    },
  },
  xAxis: {
    label: {
      formatter: (value) =>
        Number(value) === dashboardSalesDaysElapsed
          ? 'Hôm nay'
          : dashboardSalesTrend.find((item) => item.day === Number(value))?.date || value,
      style: {
        fill: '#8c8c8c',
        fontSize: 12,
      },
    },
    line: {
      style: {
        stroke: '#d9d9d9',
      },
    },
    tickLine: null,
    grid: null,
  },
  yAxis: {
    label: {
      formatter: (value) => (Number(value) === 0 ? '0' : `${Number(value) / 1000} tỷ`),
      style: {
        fill: '#8c8c8c',
        fontSize: 12,
      },
    },
    line: null,
    tickLine: null,
    grid: chartGridLine,
  },
  tooltip: {
    formatter: tooltipFormatter('series', (datum) => formatMillion(datum.value)),
  },
  annotations: [
    {
      type: 'region',
      start: [dashboardSalesDaysElapsed, 0],
      end: [salesTrendDays, salesTrendMaxValue],
      style: {
        fill: '#fafafa',
        fillOpacity: 0.7,
      },
    },
    {
      type: 'text',
      position: [25.5, 250],
      content: `Còn ${salesTrendDays - dashboardSalesDaysElapsed} ngày`,
      style: {
        fill: '#8c8c8c',
        fontSize: 12,
      },
    },
    {
      type: 'text',
      position: [dashboardSalesDaysElapsed, 3550],
      content: formatCompactMoney(currentSalesValue * MILLION),
      offsetX: -4,
      style: {
        fill: '#1f1f1f',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'right',
      },
    },
    {
      type: 'text',
      position: [salesTrendDays, salesTrendMaxValue * 0.98],
      content: `Kế hoạch ${formatCompactMoney(plannedSalesValue * MILLION)}`,
      offsetX: -2,
      style: {
        fill: '#1f1f1f',
        fontSize: 12,
        fontWeight: 600,
        textAlign: 'right',
      },
    },
  ],
};

export const salesTrendByDate = pivot(dashboardSalesTrend, {
  indexBy: (point) => point.day,
  createRow: (point) => ({ key: point.day, date: point.date }),
  columnBy: (point) =>
    ({
      'Tháng này': 'current',
      'Kế hoạch': 'plan',
      'Tháng trước': 'previous',
    })[point.series],
  valueBy: (point) => point.value,
});

export const salesTrendTable = salesTrendByDate.filter(
  (row) => row.key <= dashboardSalesDaysElapsed && row.key % 3 === 0,
);

export const funnelTable = dashboardFunnel.map((item, index) => ({
  ...item,
  key: item.stage,
  conversion: index
    ? `${((item.value / dashboardFunnel[index - 1].value) * 100).toFixed(1)}%`
    : '—',
}));

export const salesTrendColumns = [
  textColumn('Ngày', 'date'),
  numberColumn('Tháng này', 'current', formatMillion),
  numberColumn('Kế hoạch', 'plan', formatMillion),
  numberColumn('Tháng trước', 'previous', formatMillion),
];

export const funnelColumns = [
  textColumn('Bước', 'stage'),
  numberColumn('Số lượng', 'value'),
  {
    title: 'Chuyển đổi',
    dataIndex: 'conversion',
    align: 'right',
  },
];

import { COLORS } from './theme';

export const chartBase = {
  autoFit: true,
  renderer: 'canvas',
  animation: false,
};

export const columnChart = ({ hideYAxis = false, ...options }) => ({
  ...options,
  maxColumnWidth: 24,
  columnWidthRatio: 0.62,
  columnStyle: {
    radius: [3, 3, 0, 0],
    ...options.columnStyle,
  },
  ...(hideYAxis ? { yAxis: false } : {}),
});

export const topColumnLabel = (formatter, style = {}) => ({
  position: 'top',
  formatter,
  style: {
    fill: '#262626',
    fontSize: 10,
    fontWeight: 600,
    ...style,
  },
});

export const tooltipFormatter = (name, value) => (datum) => ({
  name: typeof name === 'function' ? name(datum) : datum[name],
  value: typeof value === 'function' ? value(datum) : datum[value],
});

export const chartGridLine = {
  line: {
    style: {
      stroke: COLORS.grid,
      lineWidth: 1,
    },
  },
};

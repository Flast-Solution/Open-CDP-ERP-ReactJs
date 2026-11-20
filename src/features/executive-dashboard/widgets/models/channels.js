import { dashboardChannelReplies } from '../../mockData';
import { textColumn } from '../../lib/columns';
import { chartBase, tooltipFormatter } from '../../lib/chart';

export const channelReplyConfig = (item) => ({
  ...chartBase,
  data: [item],
  xField: 'minutes',
  yField: 'channel',
  color: item.color,
  maxBarWidth: 18,
  barWidthRatio: 0.8,
  barBackground: {
    style: {
      fill: '#f0f0f0',
    },
  },
  padding: [4, 2, 4, 2],
  legend: false,
  xAxis: false,
  yAxis: false,
  meta: {
    minutes: {
      min: 0,
      max: 60,
      nice: false,
    },
  },
  tooltip: {
    formatter: tooltipFormatter('channel', (datum) => `${datum.minutes} phút`),
  },
});

export const channelReplyItems = [
  ...dashboardChannelReplies,
  { channel: 'Trực tiếp', minutes: 0, color: '#8c8c8c', notApplicable: true },
];

export const channelReplyDisplay = channelReplyItems.map((item) => ({
  ...item,
  responseTime: item.notApplicable ? 'Không áp dụng' : `${item.minutes} phút`,
}));

export const channelReplyDelayRatio = (
  dashboardChannelReplies.find((item) => item.channel === 'Facebook').minutes /
  dashboardChannelReplies.find((item) => item.channel === 'Zalo').minutes
).toFixed(1);

export const channelReplyTable = channelReplyDisplay.map((item) => ({
  ...item,
  key: item.channel,
}));

export const channelReplyColumns = [
  textColumn('Kênh', 'channel'),
  textColumn('Phản hồi đầu tiên TB', 'responseTime'),
];

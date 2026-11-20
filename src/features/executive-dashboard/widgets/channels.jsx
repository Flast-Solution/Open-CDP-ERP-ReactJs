import DashboardEmptyState from '../components/DashboardEmptyState';
import DashboardWidget from '../components/DashboardWidget';
import { DashboardCard } from '../components/DashboardCard';
import {
  getTopSource,
  leadSourceChartConfig,
  leadSourceColumns,
  mapSalesByLeadSource,
} from './models/monthlySummaryCharts';
import {
  channelReplyColumns,
  channelReplyTable,
  channelReplyItems,
  channelReplyConfig,
  channelReplyDelayRatio,
} from './models/channels';
import { Column, Bar } from '@ant-design/plots';
import { MessageOutlined, RightOutlined } from '@ant-design/icons';
import { Empty, Spin, Typography } from 'antd';
import { formatCompactMoney } from '../lib/format';
const { Text } = Typography;

export const ChannelsWidget = ({
  widgetId,
  monthlySummaryData,
  monthlySummaryError,
  monthlySummaryLoading,
}) => {
  const sources = monthlySummaryData ? mapSalesByLeadSource(monthlySummaryData) : null;
  const topSource = getTopSource(sources);

  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        title={
          topSource
            ? `${topSource.channel} dẫn đầu doanh số theo nguồn lead`
            : 'Doanh số theo nguồn lead'
        }
        subtitle="Doanh số đơn hàng theo nguồn lead trong tháng hiện tại"
        tableColumns={leadSourceColumns}
        tableData={sources}
      >
        {monthlySummaryError ? (
          <DashboardEmptyState />
        ) : monthlySummaryLoading ? (
          <Spin />
        ) : !sources?.length ? (
          <Empty description="Chưa có dữ liệu doanh số theo nguồn lead." />
        ) : (
          <div className="dashboard-channel-metrics">
            <div className="dashboard-channel-metric">
              <div className="dashboard-channel-metric__heading">
                <Text>Doanh số</Text>
                <Text strong>
                  {formatCompactMoney(sources.reduce((sum, item) => sum + item.revenue, 0))}
                </Text>
              </div>
              <Column {...leadSourceChartConfig(sources)} height={220} />
            </div>
          </div>
        )}
      </DashboardCard>
    </DashboardWidget>
  );
};

export const ChannelRepliesWidget = ({ widgetId }) => {
  return (
    <DashboardWidget widgetId={widgetId}>
      <DashboardCard
        sampleData
        cardClassName="dashboard-channel-reply-card"
        title={`Facebook trả lời chậm gấp ${channelReplyDelayRatio} lần Zalo`}
        subtitle="Thời gian phản hồi đầu tiên trung bình"
        tableColumns={channelReplyColumns}
        tableData={channelReplyTable}
        foot={
          <div className="dashboard-channel-reply-alert">
            <MessageOutlined />
            <span>
              <Text strong>14 hội thoại</Text> đang chờ phản hồi quá 2 giờ
            </span>
            <RightOutlined />
          </div>
        }
      >
        <div className="dashboard-channel-replies">
          {channelReplyItems.map((item) => (
            <div className="dashboard-channel-reply-row" key={item.channel}>
              <div className="dashboard-channel-reply-heading">
                <Text>{item.channel}</Text>
                <Text strong>{item.notApplicable ? 'Không áp dụng' : `${item.minutes} phút`}</Text>
              </div>
              {!item.notApplicable && <Bar {...channelReplyConfig(item)} height={36} />}
            </div>
          ))}
        </div>
      </DashboardCard>
    </DashboardWidget>
  );
};

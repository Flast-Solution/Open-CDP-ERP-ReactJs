import { Tag, Typography } from 'antd';
const { Text, Title } = Typography;

const DashboardSection = ({ alertGroupCount, children, group }) => {
  if (!group.widgets.length) return null;

  return (
    <section className={`dashboard-section ${group.className}`}>
      {group.title && (
        <div className="dashboard-section__heading">
          <Title level={5}>{group.title}</Title>
          {group.id === 'alerts' && alertGroupCount != null && (
            <Tag>{alertGroupCount} nhóm theo dõi</Tag>
          )}
          {group.note && <Text type="secondary">{group.note}</Text>}
        </div>
      )}
      <div className={`dashboard-widget-grid dashboard-widget-grid--${group.id}`}>{children}</div>
    </section>
  );
};

export default DashboardSection;

import { Card, Skeleton } from 'antd';
import DashboardWidget from '../components/DashboardWidget';
import { KpiCard } from '../components/KpiCard';

export const KpiWidget = ({ kpiItems, kpiLoading, widgetId }) => {
  if (kpiLoading) {
    return (
      <DashboardWidget widgetId={widgetId}>
        <Card className="dashboard-card dashboard-kpi">
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </Card>
      </DashboardWidget>
    );
  }

  const item = kpiItems?.find((kpi) => kpi.id === widgetId);
  return item ? (
    <DashboardWidget widgetId={widgetId}>
      <KpiCard item={item} />
    </DashboardWidget>
  ) : null;
};

import DashboardEmptyState from '../components/DashboardEmptyState';
import DashboardWidget from '../components/DashboardWidget';
import { useState } from 'react';
import { Skeleton } from 'antd';
import { AlertCard } from '../components/AlertCard';
import BusinessAlertDrawer from '../components/BusinessAlertDrawer';

export const AlertsWidget = ({ alertData, alertError, alertItems, alertLoading, widgetId }) => {
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const selectedAlert = alertItems?.find((item) => item.id === selectedAlertId) || null;

  return (
    <DashboardWidget widgetId={widgetId}>
      {alertLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : alertError ? (
        <DashboardEmptyState panel />
      ) : alertItems ? (
        <div className="dashboard-alerts">
          {alertItems.map((item) => (
            <AlertCard item={item} key={item.id} onActivate={() => setSelectedAlertId(item.id)} />
          ))}
        </div>
      ) : null}
      {alertData && (
        <BusinessAlertDrawer
          alert={selectedAlert}
          data={alertData}
          onClose={() => setSelectedAlertId(null)}
        />
      )}
    </DashboardWidget>
  );
};

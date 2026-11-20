import { DASHBOARD_WIDGETS } from '../dashboardLayout';

const widgetById = new Map(DASHBOARD_WIDGETS.map((widget) => [widget.id, widget]));

const DashboardWidget = ({ children, widgetId }) => {
  const widget = widgetById.get(widgetId);
  if (!widget) return children;

  return (
    <div className={`dashboard-widget dashboard-widget--${widget.size} ${widget.className || ''}`}>
      {children}
    </div>
  );
};

export default DashboardWidget;

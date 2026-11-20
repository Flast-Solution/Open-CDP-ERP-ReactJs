import DashboardEmptyState from './components/DashboardEmptyState';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Space, Typography, message } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import DashboardSection from './components/DashboardSection';
import { DASHBOARD_WIDGET_GROUPS } from './dashboardLayout';
import { WidgetRegistry } from './widgets/registry';
import businessAlertsService from './services/businessAlerts';
import manufactureWeeklySummaryService from './services/manufactureWeeklySummary';
import monthlySalesSummaryService from './services/monthlySalesSummary';
import { mapBusinessAlertsToCards } from './widgets/models/businessAlerts';
import { mapMonthlySummaryToKpis } from './widgets/models/kpis';
import { getDebtReport } from './services/debtReport';
import './styles/dashboard.css';

const { Text, Title } = Typography;

function useDashboardQuery(fetchData, onLoaded) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const requestId = useRef(0);
  const load = useCallback(async () => {
    const id = ++requestId.current;
    setState({ data: null, error: null, loading: true });
    try {
      const data = await fetchData();
      if (id === requestId.current) {
        setState({ data, error: null, loading: false });
        onLoaded();
      }
      return true;
    } catch (error) {
      if (id === requestId.current) setState({ data: null, error, loading: false });
      return false;
    }
  }, [fetchData, onLoaded]);
  useEffect(() => {
    load();
    return () => {
      requestId.current += 1;
    };
  }, [load]);
  return { ...state, load };
}

const DashboardPage = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const onLoaded = useCallback(() => setLastUpdated(new Date()), []);
  const alerts = useDashboardQuery(businessAlertsService.getBusinessAlerts, onLoaded);
  const monthly = useDashboardQuery(monthlySalesSummaryService.getMonthlySalesSummary, onLoaded);
  const manufacture = useDashboardQuery(
    manufactureWeeklySummaryService.getManufactureWeeklySummary,
    onLoaded,
  );
  const debt = useDashboardQuery(getDebtReport, onLoaded);
  const handleRefresh = async () => {
    const results = await Promise.all([
      alerts.load(),
      monthly.load(),
      manufacture.load(),
      debt.load(),
    ]);
    if (results.every(Boolean)) {
      message.success('Đã làm mới tổng quan điều hành');
    } else {
      message.info('Một số mục chưa có dữ liệu cập nhật');
    }
  };
  const businessAlerts = alerts.data ? mapBusinessAlertsToCards(alerts.data) : null;
  const kpiItems = monthly.data ? mapMonthlySummaryToKpis(monthly.data) : null;

  return (
    <main className="executive-dashboard">
      <div className="dashboard-page-header">
        <div>
          <Title level={3}>Tổng quan điều hành</Title>
          <Text type="secondary">
            Tình hình kinh doanh và vận hành
            {lastUpdated &&
              ` · Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh',
              })}`}
          </Text>
        </div>
        <Space wrap className="dashboard-page-actions">
          <Space>
            <CalendarOutlined />
            <Text>
              {(lastUpdated ?? new Date()).toLocaleDateString('vi-VN', {
                month: 'long',
                year: 'numeric',
                timeZone: 'Asia/Ho_Chi_Minh',
              })}
            </Text>
          </Space>
          <Button
            icon={<ReloadOutlined />}
            loading={alerts.loading || monthly.loading || manufacture.loading || debt.loading}
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {DASHBOARD_WIDGET_GROUPS.map((group) => (
        <DashboardSection
          alertGroupCount={group.id === 'alerts' ? businessAlerts?.length : null}
          group={group}
          key={group.id}
        >
          {group.id === 'kpis' && monthly.error ? (
            <div className="dashboard-kpi-empty">
              <DashboardEmptyState panel />
            </div>
          ) : (
            group.widgets.map((widgetId) => (
              <WidgetRegistry
                alertError={alerts.error}
                alertData={alerts.data}
                alertItems={widgetId === 'alerts' ? businessAlerts : null}
                alertLoading={alerts.loading}
                kpiItems={group.id === 'kpis' ? kpiItems : null}
                kpiLoading={group.id === 'kpis' ? monthly.loading : false}
                monthlySummaryData={monthly.data}
                monthlySummaryError={monthly.error}
                monthlySummaryLoading={monthly.loading}
                manufactureSummaryData={manufacture.data}
                manufactureSummaryError={manufacture.error}
                manufactureSummaryLoading={manufacture.loading}
                debtReport={debt}
                key={widgetId}
                widgetId={widgetId}
              />
            ))
          )}
        </DashboardSection>
      ))}
    </main>
  );
};

export default DashboardPage;

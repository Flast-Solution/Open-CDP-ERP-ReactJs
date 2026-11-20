import { AlertsWidget } from './alerts';
import { KpiWidget } from './kpi';
import { SalesTrendWidget } from './sales';
import { SalesFunnelWidget } from './sales';
import { TopCustomersWidget } from './sales';
import { SalesRepsWidget } from './sales';
import { ChannelsWidget } from './channels';
import { ChannelRepliesWidget } from './channels';
import { ProductionStatusWidget } from './production';
import { ProductionDefectWidget } from './production';
import { ProductionTimelineWidget } from './production';
import { StockMixWidget } from './inventory';
import { StockAgeWidget } from './inventory';
import { ShortagesWidget } from './inventory';
import { ReceivablesWidget } from './finance';
import { PayablesWidget } from './finance';
import { AgingWidget } from './finance';
import { DebtorsWidget } from './finance';
import { CashflowWidget } from './finance';

const widgetRegistry = {
  alerts: AlertsWidget,
  sales: KpiWidget,
  orders: KpiWidget,
  pipeline: KpiWidget,
  ontime: KpiWidget,
  stock: KpiWidget,
  leads: KpiWidget,
  'sales-trend': SalesTrendWidget,
  'sales-funnel': SalesFunnelWidget,
  'top-customers': TopCustomersWidget,
  'sales-reps': SalesRepsWidget,
  channels: ChannelsWidget,
  'channel-replies': ChannelRepliesWidget,
  'production-status': ProductionStatusWidget,
  'production-defect': ProductionDefectWidget,
  'production-timeline': ProductionTimelineWidget,
  'stock-mix': StockMixWidget,
  'stock-age': StockAgeWidget,
  shortages: ShortagesWidget,
  receivables: ReceivablesWidget,
  payables: PayablesWidget,
  aging: AgingWidget,
  debtors: DebtorsWidget,
  cashflow: CashflowWidget,
};

export const WidgetRegistry = ({ widgetId, ...props }) => {
  const Widget = widgetRegistry[widgetId];
  return Widget ? <Widget {...props} widgetId={widgetId} /> : null;
};

import { DASHBOARD_WIDGET_GROUPS } from './dashboardLayout';

describe('executive dashboard layout', () => {
  it('keeps widgets in their default dashboard sections', () => {
    const channelGroup = DASHBOARD_WIDGET_GROUPS.find((group) => group.id === 'channels');
    const productionGroup = DASHBOARD_WIDGET_GROUPS.find((group) => group.id === 'production');
    const financeGroup = DASHBOARD_WIDGET_GROUPS.find((group) => group.id === 'finance');

    expect(channelGroup.widgets).toEqual(['channels', 'channel-replies']);
    expect(productionGroup.widgets).toEqual([
      'production-status',
      'production-defect',
      'production-timeline',
    ]);
    expect(financeGroup.widgets).toEqual([
      'receivables',
      'payables',
      'aging',
      'debtors',
      'cashflow',
    ]);
  });
});

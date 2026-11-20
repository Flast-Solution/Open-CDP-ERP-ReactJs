import {
  mapOrdersDueForManufacture,
  mapWeeklySummaryToChart,
  mapWeeklySummaryToTable,
} from './production';

describe('production dashboard data mapping', () => {
  it('maps weekly API statuses without aggregating across weeks', () => {
    const weeklySummary = [
      {
        week: 1,
        weekStart: '2026-11-01',
        weekEnd: '2026-11-01',
        inProgress: 4,
        delayed: 2,
        expectedToFinish: 3,
        notStarted: 5,
      },
    ];

    expect(mapWeeklySummaryToChart(weeklySummary)).toEqual([
      {
        week: 'Tuần 1',
        weekStart: '2026-11-01',
        weekEnd: '2026-11-01',
        status: 'Đang sản xuất',
        value: 4,
      },
      {
        week: 'Tuần 1',
        weekStart: '2026-11-01',
        weekEnd: '2026-11-01',
        status: 'Trễ tiến độ',
        value: 2,
      },
      {
        week: 'Tuần 1',
        weekStart: '2026-11-01',
        weekEnd: '2026-11-01',
        status: 'Dự kiến hoàn thành',
        value: 3,
      },
      {
        week: 'Tuần 1',
        weekStart: '2026-11-01',
        weekEnd: '2026-11-01',
        status: 'Chưa bắt đầu',
        value: 5,
      },
    ]);
    expect(mapWeeklySummaryToTable(weeklySummary)[0]).toMatchObject({
      key: 1,
      weekLabel: 'Tuần 1',
      dateRange: '2026-11-01 – 2026-11-01',
    });
  });

  it('calculates remaining production quantity and completion progress', () => {
    expect(
      mapOrdersDueForManufacture([
        {
          orderId: 123,
          orderCode: 'DH-001',
          totalQuantity: 100,
          producedQuantity: 65,
          deliveryDeadline: '2026-11-14T00:00:00.000+07:00',
        },
      ]),
    ).toEqual([
      {
        key: 123,
        orderId: 123,
        orderCode: 'DH-001',
        totalQuantity: 100,
        producedQuantity: 65,
        deliveryDeadline: '2026-11-14T00:00:00.000+07:00',
        deadlineLabel: '14/11/2026',
        remainingQuantity: 35,
        progressPercent: 65,
      },
    ]);
  });
});

import { RequestUtils } from 'utils/strictRequest';
import manufactureWeeklySummaryService from './manufactureWeeklySummary';

jest.mock('utils/strictRequest', () => ({
  RequestUtils: {
    strict: {
      get: jest.fn(),
    },
  },
}));

const responseData = {
  weeklySummary: [
    {
      week: 1,
      weekStart: '2026-11-01',
      weekEnd: '2026-11-01',
      inProgress: 4,
      delayed: 2,
      expectedToFinish: 3,
      notStarted: 5,
    },
  ],
  ordersDueForManufacture: [
    {
      orderId: 123,
      orderCode: 'DH-001',
      totalQuantity: 100,
      producedQuantity: 65,
      deliveryDeadline: '2026-11-14T00:00:00.000+07:00',
    },
  ],
};

describe('manufacture weekly summary service', () => {
  beforeEach(() => {
    RequestUtils.strict.get.mockReset();
  });

  it('requests and validates weekly status and due order data', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: responseData,
    });

    await expect(manufactureWeeklySummaryService.getManufactureWeeklySummary()).resolves.toEqual(
      responseData,
    );
    expect(RequestUtils.strict.get).toHaveBeenCalledWith(
      '/erp/dashboard/manufacture-weekly-summary',
    );
  });

  it('accepts empty weekly and due-order lists', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: { weeklySummary: [], ordersDueForManufacture: [] },
    });

    await expect(manufactureWeeklySummaryService.getManufactureWeeklySummary()).resolves.toEqual({
      weeklySummary: [],
      ordersDueForManufacture: [],
    });
  });

  it('rejects due orders with no remaining production quantity', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: {
        ...responseData,
        ordersDueForManufacture: [
          { ...responseData.ordersDueForManufacture[0], producedQuantity: 100 },
        ],
      },
    });

    await expect(manufactureWeeklySummaryService.getManufactureWeeklySummary()).rejects.toThrow(
      'Dữ liệu tiến độ sản xuất không hợp lệ: ordersDueForManufacture[0].',
    );
  });
});

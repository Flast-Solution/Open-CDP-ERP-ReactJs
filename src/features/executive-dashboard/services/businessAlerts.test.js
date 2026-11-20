import { RequestUtils } from 'utils/strictRequest';
import businessAlertsService from './businessAlerts';

jest.mock('utils/strictRequest', () => ({
  RequestUtils: {
    strict: {
      get: jest.fn(),
    },
  },
}));

const validData = {
  deliveryRisk: { count: 0, items: [] },
  materialShortage: { count: 0, items: [] },
  accountsReceivable: { count: 0, items: [], totalOutstanding: 0 },
  conversations: { count: 0, items: [] },
  inventory: { count: 0, items: [], stockQuantity: 0 },
  accountsPayable: { count: 0, items: [] },
};

describe('business alerts service', () => {
  beforeEach(() => {
    RequestUtils.strict.get.mockReset();
  });

  it('requests and validates the endpoint response', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: validData,
    });

    await expect(businessAlertsService.getBusinessAlerts()).resolves.toEqual(validData);
    expect(RequestUtils.strict.get).toHaveBeenCalledWith('/erp/dashboard/business-alerts');
  });

  it('maps delivery and receivable tuples to the documented fields', async () => {
    const tupleData = {
      ...validData,
      deliveryRisk: {
        count: 2,
        items: [
          [34052, 'OEKR2326FJT', null, 1791763200000, 1],
          [34039, 'ORHC3326LYB', null, 1791936000000, 700],
        ],
      },
      accountsReceivable: {
        count: 1,
        items: [[34015, 'OXHL3226VQG', null, 46, 550000000, 0, 550000000]],
        totalOutstanding: 550000000,
      },
      inventory: { count: 1, items: [], stockQuantity: 701 },
    };
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: tupleData,
    });

    await expect(businessAlertsService.getBusinessAlerts()).resolves.toMatchObject({
      deliveryRisk: {
        items: [
          {
            id: 34052,
            code: 'OEKR2326FJT',
            order_name: null,
            receivedAt: '2026-10-12T00:00:00.000Z',
            receivedQuantity: 1,
          },
          {
            id: 34039,
            code: 'ORHC3326LYB',
            order_name: null,
            receivedAt: '2026-10-14T00:00:00.000Z',
            receivedQuantity: 700,
          },
        ],
      },
      accountsReceivable: {
        items: [
          {
            id: 34015,
            code: 'OXHL3226VQG',
            orderName: null,
            customerId: 46,
            total: 550000000,
            paid: 0,
            outstanding: 550000000,
          },
        ],
      },
    });
  });

  it('rejects invalid response data instead of hiding contract errors', async () => {
    RequestUtils.strict.get.mockResolvedValue({
      errorCode: 200,
      success: true,
      data: { ...validData, inventory: { count: '1', items: [], stockQuantity: 12 } },
    });

    await expect(businessAlertsService.getBusinessAlerts()).rejects.toThrow(
      'Dữ liệu cảnh báo kinh doanh không hợp lệ: inventory.',
    );
  });
});

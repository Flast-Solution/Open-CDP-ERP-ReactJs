import { RequestUtils } from 'utils/strictRequest';
import { getDebtReport } from './debtReport';

jest.mock('utils/strictRequest', () => ({ RequestUtils: { strict: { get: jest.fn() } } }));

const data = {
  accountsReceivable: {
    openCount: 12,
    openAmount: 92000000,
    overdueCount: 3,
    overdueAmount: 18000000,
    dueWithinWeekCount: 0,
    dueWithinWeekAmount: 0,
  },
  accountsPayable: {
    openCount: 7,
    openAmount: 45000000,
    overdueCount: 1,
    overdueAmount: 5000000,
    dueWithinWeekCount: 2,
    dueWithinWeekAmount: 10000000,
  },
};
const ok = (data) => ({ errorCode: 200, success: true, message: 'success', data });

test('loads both debt summaries in one request and preserves zero amounts', async () => {
  RequestUtils.strict.get.mockResolvedValue(ok(data));
  await expect(getDebtReport()).resolves.toEqual(data);
  expect(RequestUtils.strict.get).toHaveBeenCalledTimes(1);
  expect(RequestUtils.strict.get).toHaveBeenCalledWith('/finance/debt-report');
});

test('rejects missing payable amounts instead of displaying zero', async () => {
  RequestUtils.strict.get.mockResolvedValue(
    ok({ ...data, accountsPayable: { ...data.accountsPayable, openAmount: null } }),
  );
  await expect(getDebtReport()).rejects.toThrow('accountsPayable.openAmount');
});

test('surfaces a business error from the report', async () => {
  RequestUtils.strict.get.mockResolvedValue({
    success: false,
    message: 'Không có quyền xem công nợ',
  });
  await expect(getDebtReport()).rejects.toThrow('Không có quyền xem công nợ');
});

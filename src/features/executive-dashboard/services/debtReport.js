import { RequestUtils } from 'utils/strictRequest';
import { SUCCESS_CODE } from 'configs';

// FINANCE-REPORT-API.md — GET /finance/debt-report
export async function getDebtReport() {
  const response = await RequestUtils.strict.get('/finance/debt-report');
  if (response?.success !== true || response.errorCode !== SUCCESS_CODE) {
    throw new Error(response?.message || 'Không thể tải báo cáo công nợ.');
  }
  for (const key of ['accountsReceivable', 'accountsPayable']) {
    const section = response.data?.[key];
    for (const prefix of ['open', 'overdue', 'dueWithinWeek']) {
      const amount = section?.[`${prefix}Amount`];
      const count = section?.[`${prefix}Count`];
      if (!Number.isFinite(amount) || amount < 0 || !Number.isInteger(count) || count < 0) {
        throw new Error(
          `Dữ liệu công nợ không hợp lệ ở ${key}.${prefix}Amount hoặc ${prefix}Count.`,
        );
      }
    }
  }
  return response.data;
}

import { RequestUtils } from 'utils/strictRequest';
import { SUCCESS_CODE } from 'configs';

const BASE_PATH = '/erp/dashboard/manufacture-weekly-summary';

const isNonNegativeNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;
const isDateString = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
};
const isDateTimeString = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
  !Number.isNaN(Date.parse(value));

const requireWeeklySummary = (data) => {
  if (!Array.isArray(data.weeklySummary)) {
    throw new Error('Dữ liệu tiến độ sản xuất không hợp lệ: weeklySummary.');
  }

  data.weeklySummary.forEach((week, index) => {
    if (
      !week ||
      typeof week !== 'object' ||
      !Number.isInteger(week.week) ||
      week.week < 1 ||
      !isDateString(week.weekStart) ||
      !isDateString(week.weekEnd) ||
      week.weekStart > week.weekEnd ||
      !Number.isInteger(week.inProgress) ||
      !Number.isInteger(week.delayed) ||
      !Number.isInteger(week.expectedToFinish) ||
      !Number.isInteger(week.notStarted) ||
      !isNonNegativeNumber(week.inProgress) ||
      !isNonNegativeNumber(week.delayed) ||
      !isNonNegativeNumber(week.expectedToFinish) ||
      !isNonNegativeNumber(week.notStarted)
    ) {
      throw new Error(`Dữ liệu tiến độ sản xuất không hợp lệ: weeklySummary[${index}].`);
    }
  });
};

const requireOrdersDueForManufacture = (data) => {
  if (!Array.isArray(data.ordersDueForManufacture)) {
    throw new Error('Dữ liệu tiến độ sản xuất không hợp lệ: ordersDueForManufacture.');
  }

  data.ordersDueForManufacture.forEach((order, index) => {
    if (
      !order ||
      typeof order !== 'object' ||
      Array.isArray(order) ||
      !Number.isInteger(order.orderId) ||
      order.orderId < 0 ||
      typeof order.orderCode !== 'string' ||
      !isNonNegativeNumber(order.totalQuantity) ||
      !isNonNegativeNumber(order.producedQuantity) ||
      order.totalQuantity <= order.producedQuantity ||
      !isDateTimeString(order.deliveryDeadline)
    ) {
      throw new Error(`Dữ liệu tiến độ sản xuất không hợp lệ: ordersDueForManufacture[${index}].`);
    }
  });
};

const validateManufactureWeeklySummary = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Dữ liệu tiến độ sản xuất không hợp lệ.');
  }

  requireWeeklySummary(data);
  requireOrdersDueForManufacture(data);
  return data;
};

const unwrapResponse = (response) => {
  if (response?.errorCode !== SUCCESS_CODE || response.success !== true) {
    throw new Error(response?.message || 'Không thể tải tiến độ sản xuất.');
  }
  return validateManufactureWeeklySummary(response.data);
};

const manufactureWeeklySummaryService = {
  async getManufactureWeeklySummary() {
    return unwrapResponse(await RequestUtils.strict.get(BASE_PATH));
  },
};

export default manufactureWeeklySummaryService;

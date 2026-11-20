import { RequestUtils } from 'utils/strictRequest';
import { SUCCESS_CODE } from 'configs';

const BASE_PATH = '/erp/dashboard/monthly-sales-summary';

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isNonNegativeNumber = (value) => isFiniteNumber(value) && value >= 0;
const isNullableNumber = (value) => value === null || isFiniteNumber(value);
const isNullableNonNegativeNumber = (value) => value === null || isNonNegativeNumber(value);

const requireComparison = (data, key, valueValidator = isNonNegativeNumber) => {
  const comparison = data?.[key];
  if (
    !comparison ||
    !valueValidator(comparison.currentMonth) ||
    !valueValidator(comparison.previousMonth) ||
    !isNullableNumber(comparison.changePercent)
  ) {
    throw new Error(`Dữ liệu tổng quan kinh doanh không hợp lệ: ${key}.`);
  }
  return comparison;
};

const requireDeliveryPeriod = (value, key) => {
  if (
    !value ||
    !isNonNegativeNumber(value.deliveredOrders) ||
    !isNonNegativeNumber(value.onTimeOrders) ||
    value.onTimeOrders > value.deliveredOrders
  ) {
    throw new Error(`Dữ liệu tổng quan kinh doanh không hợp lệ: onTimeDeliveries.${key}.`);
  }
  return value;
};

const isStringOrNull = (value) => value === null || typeof value === 'string';

const normalizeOptionalTupleArray = (data, key, tupleFields) => {
  if (!Object.prototype.hasOwnProperty.call(data, key)) {
    return undefined;
  }

  if (!Array.isArray(data[key])) {
    throw new Error(`Dữ liệu tổng quan kinh doanh không hợp lệ: ${key} (expected array).`);
  }

  return data[key].map((tuple, index) => {
    if (!Array.isArray(tuple) || tuple.length !== tupleFields.length) {
      throw new Error(
        `Dữ liệu tổng quan kinh doanh không hợp lệ: ${key}[${index}] (expected tuple of ${tupleFields.length} values).`,
      );
    }

    return tupleFields.reduce((item, [field, validate], fieldIndex) => {
      const value = tuple[fieldIndex];
      if (!validate(value)) {
        throw new Error(
          `Dữ liệu tổng quan kinh doanh không hợp lệ: ${key}[${index}][${fieldIndex}] (${field}).`,
        );
      }
      item[field] = value;
      return item;
    }, {});
  });
};

const isValidLeadSourceId = (value) => [1, 2, 4, 11].includes(value);

const optionalTupleFields = {
  topCustomers: [
    ['customerId', isNullableNonNegativeNumber],
    ['customerName', isStringOrNull],
    ['revenue', isNonNegativeNumber],
    ['orderCount', isNonNegativeNumber],
  ],
  topEmployees: [
    ['employeeId', isNonNegativeNumber],
    ['employeeName', isStringOrNull],
    ['revenue', isNonNegativeNumber],
    ['orderCount', isNonNegativeNumber],
  ],
  salesByLeadSource: [
    ['sourceId', isValidLeadSourceId],
    ['sourceName', (value) => typeof value === 'string'],
    ['revenue', isNonNegativeNumber],
    ['orderCount', isNonNegativeNumber],
  ],
};

const normalizeOptionalArrays = (data) => {
  const normalized = {};
  Object.entries(optionalTupleFields).forEach(([key, tupleFields]) => {
    const values = normalizeOptionalTupleArray(data, key, tupleFields);
    if (values !== undefined) {
      normalized[key] = values;
    }
  });
  return normalized;
};

const validateMonthlySalesSummary = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Dữ liệu tổng quan kinh doanh không hợp lệ.');
  }

  requireComparison(data, 'salesRevenue');
  requireComparison(data, 'newOrders');
  requireComparison(data, 'opportunities');
  requireComparison(data, 'newLeads');

  const onTimeDeliveries = data.onTimeDeliveries;
  if (!onTimeDeliveries || !isNullableNumber(onTimeDeliveries.changePercent)) {
    throw new Error('Dữ liệu tổng quan kinh doanh không hợp lệ: onTimeDeliveries.');
  }
  requireDeliveryPeriod(onTimeDeliveries.currentMonth, 'currentMonth');
  requireDeliveryPeriod(onTimeDeliveries.previousMonth, 'previousMonth');

  const inventory = data.inventory;
  if (!inventory || !isNullableNumber(inventory.changePercent)) {
    throw new Error('Dữ liệu tổng quan kinh doanh không hợp lệ: inventory.');
  }
  for (const period of ['currentMonth', 'previousMonth']) {
    const value = inventory[period];
    if (!value || !isNonNegativeNumber(value.orders) || !isNonNegativeNumber(value.amount)) {
      throw new Error(`Dữ liệu tổng quan kinh doanh không hợp lệ: inventory.${period}.`);
    }
  }

  return {
    ...data,
    ...normalizeOptionalArrays(data),
  };
};

const unwrapResponse = (response) => {
  if (response?.errorCode !== SUCCESS_CODE || response.success !== true) {
    throw new Error(response?.message || 'Không thể tải tổng quan kinh doanh.');
  }
  return validateMonthlySalesSummary(response.data);
};

const monthlySalesSummaryService = {
  async getMonthlySalesSummary() {
    return unwrapResponse(await RequestUtils.strict.get(BASE_PATH));
  },
};

export default monthlySalesSummaryService;

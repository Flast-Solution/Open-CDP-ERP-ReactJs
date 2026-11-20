import { RequestUtils } from 'utils/strictRequest';
import { SUCCESS_CODE } from 'configs';

const BASE_PATH = '/erp/dashboard/business-alerts';

const isNonNegativeNumber = (value) => Number.isFinite(value) && value >= 0;

const requireCountAndItems = (data, key) => {
  const section = data?.[key];
  if (
    !section ||
    !Number.isInteger(section.count) ||
    section.count < 0 ||
    !Array.isArray(section.items)
  ) {
    throw new Error(`Dữ liệu cảnh báo kinh doanh không hợp lệ: ${key}.`);
  }
  return section;
};

const requireEmptyItems = (data, key) => {
  const section = requireCountAndItems(data, key);
  if (section.items.length) {
    throw new Error(`Dữ liệu cảnh báo kinh doanh không hợp lệ: ${key}.items phải rỗng.`);
  }
};

const normalizeTupleSection = (data, key, fields, transform = (item) => item) => {
  const section = requireCountAndItems(data, key);
  const items = section.items.map((tuple) => {
    if (!Array.isArray(tuple) || tuple.length !== fields.length) {
      throw new Error(`Dữ liệu cảnh báo kinh doanh không hợp lệ: ${key}.items.`);
    }

    const item = fields.reduce((result, field, index) => {
      result[field] = tuple[index];
      return result;
    }, {});
    return transform(item);
  });

  return { ...section, items };
};

const requireFields = (item, fields, section) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`Dữ liệu cảnh báo kinh doanh không hợp lệ: ${section}.items.`);
  }

  for (const [field, isValid] of fields) {
    if (!isValid(item[field])) {
      throw new Error(`Dữ liệu cảnh báo kinh doanh không hợp lệ: ${section}.items[].${field}.`);
    }
  }
};

const isString = (value) => typeof value === 'string';
const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isNullableString = (value) => value === null || isString(value);
const isNullableNumber = (value) => value === null || isNumber(value);
const isValidEpochMilliseconds = (value) =>
  isNumber(value) && Number.isFinite(new Date(value).getTime());

const normalizeBusinessAlertTuples = (data) => {
  const deliveryRisk = normalizeTupleSection(
    data,
    'deliveryRisk',
    ['id', 'code', 'order_name', 'receivedAt', 'receivedQuantity'],
    (item) => {
      if (!isValidEpochMilliseconds(item.receivedAt)) {
        throw new Error(
          'Dữ liệu cảnh báo kinh doanh không hợp lệ: deliveryRisk.items[].receivedAt.',
        );
      }
      return { ...item, receivedAt: new Date(item.receivedAt).toISOString() };
    },
  );
  const accountsReceivable = normalizeTupleSection(data, 'accountsReceivable', [
    'id',
    'code',
    'orderName',
    'customerId',
    'total',
    'paid',
    'outstanding',
  ]);

  return { ...data, deliveryRisk, accountsReceivable };
};

const validateBusinessAlerts = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Dữ liệu cảnh báo kinh doanh không hợp lệ.');
  }

  const normalizedData = normalizeBusinessAlertTuples(data);
  const deliveryRisk = requireCountAndItems(normalizedData, 'deliveryRisk');
  deliveryRisk.items.forEach((item) => {
    requireFields(
      item,
      [
        ['id', isNumber],
        ['code', isString],
        ['order_name', isNullableString],
        ['receivedAt', isString],
        ['receivedQuantity', isNonNegativeNumber],
      ],
      'deliveryRisk',
    );
    if (!Number.isFinite(Date.parse(item.receivedAt))) {
      throw new Error('Dữ liệu cảnh báo kinh doanh không hợp lệ: deliveryRisk.items[].receivedAt.');
    }
  });

  const materialShortage = requireCountAndItems(data, 'materialShortage');
  materialShortage.items.forEach((item) => {
    requireFields(
      item,
      [
        ['id', isNumber],
        ['code', isString],
        ['orderCode', isNullableString],
        ['productId', isNullableNumber],
        ['materialId', isNullableNumber],
        ['materialName', isString],
        ['shortage', isNonNegativeNumber],
      ],
      'materialShortage',
    );
  });

  const accountsReceivable = requireCountAndItems(normalizedData, 'accountsReceivable');
  if (!isNonNegativeNumber(accountsReceivable.totalOutstanding)) {
    throw new Error(
      'Dữ liệu cảnh báo kinh doanh không hợp lệ: accountsReceivable.totalOutstanding.',
    );
  }
  accountsReceivable.items.forEach((item) => {
    requireFields(
      item,
      [
        ['id', isNumber],
        ['code', isString],
        ['orderName', isNullableString],
        ['customerId', isNullableNumber],
        ['total', isNonNegativeNumber],
        ['paid', isNonNegativeNumber],
        ['outstanding', isNonNegativeNumber],
      ],
      'accountsReceivable',
    );
  });

  requireEmptyItems(normalizedData, 'conversations');

  const inventory = requireCountAndItems(normalizedData, 'inventory');
  if (!isNonNegativeNumber(inventory.stockQuantity)) {
    throw new Error('Dữ liệu cảnh báo kinh doanh không hợp lệ: inventory.stockQuantity.');
  }
  requireEmptyItems(normalizedData, 'inventory');

  requireEmptyItems(normalizedData, 'accountsPayable');

  return normalizedData;
};

const unwrapResponse = (response) => {
  if (response?.errorCode !== SUCCESS_CODE || response.success !== true) {
    throw new Error(response?.message || 'Không thể tải đề xuất xử lý.');
  }
  return validateBusinessAlerts(response.data);
};

const businessAlertsService = {
  async getBusinessAlerts() {
    return unwrapResponse(await RequestUtils.strict.get(BASE_PATH));
  },
};

export default businessAlertsService;

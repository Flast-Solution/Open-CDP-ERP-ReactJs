// Epoch values describe an instant; never add/subtract a timezone offset here.
// Strings without an offset retain their existing meaning until BE specifies a timezone.
export const normalizeOmniTime = (value) => {
  if (value == null || value === '') {
    return null;
  }
  if (
    typeof value === 'number' ||
    /^\d{10}(?:\.\d+)?$|^\d{13}$/.test(String(value))
  ) {
    const number = Number(value);
    const date = new Date(number < 1e11 ? number * 1000 : number);
    return Number.isFinite(date.getTime()) ? date.toISOString() : null;
  }
  return value;
};

export const messageTimeMillis = (message) => {
  const value = normalizeOmniTime(message.sentAt ?? message.createdAt);
  return value == null ? NaN : new Date(value).getTime();
};

const isPending = (message) => String(message.id).startsWith('tmp_');
const numericId = (message) => String(message.id).replace(/^0+(?=\d)/, '');
const compareNumericIds = (left, right) => {
  const leftId = numericId(left);
  const rightId = numericId(right);
  return leftId.length - rightId.length || leftId.localeCompare(rightId);
};

export const sortMessagesInServerOrder = (messages) => {
  // Numeric message IDs provide server recording order. Provider and ERP timestamps
  // currently disagree, so sentAt cannot determine cross-direction order.
  // Use one fallback strategy for the entire confirmed list if IDs are absent.
  const useServerOrder = messages
    .filter((message) => !isPending(message))
    .every((message) => /^\d+$/.test(numericId(message)));
  return [...messages].sort((left, right) => {
    // A phone/computer clock can differ from the server clock. Pending messages
    // stay after confirmed history until the server confirms their message ID.
    const leftPending = isPending(left);
    const rightPending = isPending(right);
    if (leftPending !== rightPending) {
      return leftPending ? 1 : -1;
    }
    if (!leftPending && useServerOrder) {
      return compareNumericIds(left, right);
    }
    const leftTime = messageTimeMillis(left);
    const rightTime = messageTimeMillis(right);
    if (Number.isFinite(leftTime) !== Number.isFinite(rightTime)) {
      return Number.isFinite(leftTime) ? -1 : 1;
    }
    if (Number.isFinite(leftTime) && leftTime !== rightTime) {
      return leftTime - rightTime;
    }
    return 0;
  });
};

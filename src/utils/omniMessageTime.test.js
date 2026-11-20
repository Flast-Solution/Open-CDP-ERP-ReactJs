import {
  normalizeOmniTime,
  messageTimeMillis,
  sortMessagesInServerOrder,
} from './omniMessageTime';

test.each([1793343600, '1793343600', 1793343600000, '1793343600000'])(
  'normalizes epoch seconds/milliseconds without shifting timezone: %s',
  (value) => {
    expect(normalizeOmniTime(value)).toBe('2026-10-30T07:00:00.000Z');
  },
);

test('UTC, explicit Vietnam offset and decimal epoch values describe the same instant', () => {
  expect(messageTimeMillis({ sentAt: '2026-10-30T08:53:38Z' })).toBe(
    messageTimeMillis({ sentAt: '2026-10-30T15:53:38+07:00' }),
  );
  const vietnamTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(messageTimeMillis({ sentAt: '2026-10-30T08:53:38Z' })));
  expect(vietnamTime).toBe('15:53:38');
  expect(normalizeOmniTime('1793343600.125')).toBe('2026-10-30T07:00:00.125Z');
});

test('does not invent a timezone or substitute current time for absent/invalid timestamps', () => {
  expect(normalizeOmniTime('2026-10-30T15:53:38')).toBe('2026-10-30T15:53:38');
  expect(Number.isNaN(messageTimeMillis({}))).toBe(true);
  expect(Number.isNaN(messageTimeMillis({ sentAt: 'invalid' }))).toBe(true);
  expect(normalizeOmniTime(Infinity)).toBeNull();
});

test('preserves server sequence for the supplied contradictory inbound/outbound timestamps', () => {
  const records = [
    { id: 120, content: 'ưew', sentAt: '2026-10-30T08:52:03Z' },
    { id: 121, content: '1', sentAt: '2026-10-30T08:52:13Z' },
    { id: 119, content: 'hello', sentAt: '2026-10-30T08:53:38Z' },
  ];
  expect(
    sortMessagesInServerOrder(records).map((item) => item.content),
  ).toEqual(['hello', 'ưew', '1']);
  expect(records.map((item) => item.id)).toEqual([120, 121, 119]);
});

test('keeps pending messages at the end despite a slow client clock, then uses confirmed server ID', () => {
  const records = [
    { id: 'tmp_1', sentAt: '2026-10-29T00:00:00Z' },
    { id: '10', sentAt: '2026-10-30T08:00:00Z' },
    { id: 9, sentAt: '2026-10-30T08:01:00Z' },
  ];
  expect(sortMessagesInServerOrder(records).map((item) => item.id)).toEqual([
    9,
    '10',
    'tmp_1',
  ]);
});

test('compares large server IDs exactly and falls back consistently for non-numeric IDs', () => {
  expect(
    sortMessagesInServerOrder([
      { id: '9007199254740993' },
      { id: '9007199254740992' },
    ]).map((item) => item.id),
  ).toEqual(['9007199254740992', '9007199254740993']);
  expect(
    sortMessagesInServerOrder([
      { id: 'b', sentAt: '2026-10-30T08:00:00Z' },
      { id: 'a', sentAt: '2026-10-30T07:00:00Z' },
    ]).map((item) => item.id),
  ).toEqual(['a', 'b']);
});

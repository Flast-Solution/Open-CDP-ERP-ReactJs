import { formatCompactMoney, formatNumber } from '../../lib/format';

export const getBusinessAlertItemPath = (alertId, item) => {
  if (alertId === 'delivery-risk' || alertId === 'accounts-receivable') {
    return `/sale/order?code=${encodeURIComponent(item.code)}`;
  }

  return null;
};

const formatReceivedAt = (value) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value));

export const mapBusinessAlertsToCards = (data) => {
  const latestReceipt = data.deliveryRisk.items.reduce(
    (latest, item) => (!latest || item.receivedAt > latest.receivedAt ? item : latest),
    null,
  );
  return [
    {
      id: 'delivery-risk',
      icon: 'delivery',
      severity: data.deliveryRisk.count ? 'high' : 'mid',
      title: `${formatNumber(data.deliveryRisk.count)} đơn hàng nhập kho hơn 7 ngày chưa xác nhận giao`,
      description: latestReceipt
        ? `Gần nhất: ${latestReceipt.code} · ${formatReceivedAt(latestReceipt.receivedAt)}`
        : 'Không có thông tin đơn hàng chi tiết.',
    },
    {
      id: 'material-shortage',
      icon: 'inventory',
      severity: data.materialShortage.count ? 'high' : 'mid',
      title: `${formatNumber(data.materialShortage.count)} dòng lệnh sản xuất thiếu nguyên phụ liệu`,
      description: data.materialShortage.items.length
        ? data.materialShortage.items
            .slice(0, 2)
            .map(
              (item) =>
                `${item.materialName} · thiếu ${formatNumber(item.shortage)}${
                  item.orderCode ? ` · đơn ${item.orderCode}` : ''
                }`,
            )
            .join('; ')
        : 'Không có thông tin thiếu nguyên phụ liệu chi tiết.',
    },
    {
      id: 'accounts-receivable',
      icon: 'receivable',
      severity: data.accountsReceivable.count ? 'high' : 'mid',
      title: `Công nợ phải thu: ${formatCompactMoney(data.accountsReceivable.totalOutstanding)}`,
      description: `${formatNumber(data.accountsReceivable.count)} đơn còn tiền phải thu.`,
    },
    {
      id: 'conversations',
      icon: 'conversation',
      severity: data.conversations.count ? 'high' : 'mid',
      title: `${formatNumber(data.conversations.count)} hội thoại cần phản hồi`,
      description: data.conversations.count
        ? 'Chưa có dữ liệu chi tiết hội thoại.'
        : 'Chưa có dữ liệu hội thoại cần phản hồi.',
    },
    {
      id: 'inventory',
      icon: 'stock',
      severity: 'mid',
      title: `Tồn kho hiện tại: ${formatNumber(data.inventory.stockQuantity)} đơn vị`,
      description: `${formatNumber(data.inventory.count)} dòng hàng có tồn kho dương.`,
    },
    {
      id: 'accounts-payable',
      icon: 'payable',
      severity: 'mid',
      title: `${formatNumber(data.accountsPayable.count)} khoản phải trả cần theo dõi`,
      description: data.accountsPayable.count
        ? 'Chưa có dữ liệu chi tiết công nợ phải trả.'
        : 'Chưa có dữ liệu công nợ phải trả cần theo dõi.',
    },
  ];
};

const numberFormatter = new Intl.NumberFormat('vi-VN');
const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

export const MILLION = 1_000_000;
export const formatNumber = (value) => numberFormatter.format(value);
export const formatMoney = (value) => `${currencyFormatter.format(value)} đ`;
export const formatMillion = (value) => `${numberFormatter.format(value)} tr`;
export const formatCompactMoney = (value) =>
  value >= 1_000_000_000
    ? `${numberFormatter.format(value / 1_000_000_000)} tỷ`
    : `${numberFormatter.format(value / MILLION)} tr`;
export const formatChange = (change) =>
  `${change > 0 ? '+' : ''}${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2,
  }).format(change)}%`;
export const getInitials = (name) =>
  name
    .split(' ')
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

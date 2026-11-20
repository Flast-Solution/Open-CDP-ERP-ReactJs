export const sumBy = (items, selector) => items.reduce((total, item) => total + selector(item), 0);

export const pivot = (items, { columnBy, createRow, indexBy, valueBy }) => {
  const rows = new Map();

  items.forEach((item) => {
    const index = indexBy(item);
    const row = rows.get(index) || createRow(item, index);
    row[columnBy(item)] = valueBy(item);
    rows.set(index, row);
  });

  return [...rows.values()];
};

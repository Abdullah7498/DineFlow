export function currency(value) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function shortId(value) {
  return value ? value.slice(-6).toUpperCase() : '------';
}

const numberFormatter = new Intl.NumberFormat('en-AU')

export function formatAmount(value) {
  if (value === null || value === undefined || value === '') return ''
  const numeric = Number(String(value).replace(/,/g, '').trim())
  return Number.isFinite(numeric) ? `$${numberFormatter.format(numeric)}` : String(value)
}

export function formatDate(value) {
  if (!value) return ''
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value)
}

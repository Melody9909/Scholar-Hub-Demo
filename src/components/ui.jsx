export function Button({ variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    brand: 'bg-brand-600 text-white hover:bg-brand-700',
    outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}

export function Card({ className = '', children, ...props }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white ${className}`} {...props}>{children}</div>
}

export function Badge({ color = 'slate', children }) {
  const colors = { slate: 'bg-slate-100 text-slate-600', brand: 'bg-brand-50 text-brand-700' }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>{children}</span>
}

export function Pill({ active, children, ...props }) {
  return (
    <button className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active
      ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/20'
      : 'border-slate-300 bg-white text-slate-600 shadow-sm hover:border-slate-400 hover:shadow-md'}`} {...props}>
      {children}
    </button>
  )
}

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg aria-hidden="true" className="h-7 w-7 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-lg font-bold text-slate-900">Scholar Hub</span>
    </div>
  )
}

import { Button, Logo } from './ui'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-3" aria-label="Demo account">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 sm:inline-flex">Portfolio Demo · Mock Data</span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-600 bg-brand-600 text-sm font-semibold text-white shadow-sm" title="Alex Morgan" aria-label="Demo scholar: Alex Morgan">AM</div>
          <Button variant="outline" disabled title="Account actions are not available in this demo">Demo Scholar</Button>
        </nav>
      </div>
    </header>
  )
}

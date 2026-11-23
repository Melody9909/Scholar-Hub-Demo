import { useMemo, useState } from 'react'
import { Badge, Card, Pill } from '../components/ui'
import { LOCATIONS, mockOpportunities, RESEARCH_FIELDS } from '../data/mockOpportunities'
import { formatAmount, formatDate } from '../lib/format'

const TYPE_TABS = [
  ['all', 'My Recommendation'], ['grants', 'Grants'], ['scholarships', 'Scholarships'],
  ['internships', 'Internships'], ['conferences', 'Conferences'], ['fellowships', 'Fellowships'],
]
const TYPE_LABEL = { grants: 'Grant', scholarships: 'Scholarship', internships: 'Internship', conferences: 'Conference', fellowships: 'Fellowship' }
const MATCH_CODES = ['because_saved', 'field_match', 'keyword_match', 'semantic_match', 'type_match']

function recBadge(reasons = []) {
  const codes = new Set(reasons.map((reason) => reason.code))
  if (codes.has('field_related') || codes.has('not_preferred_type')) return { label: 'Related to your field', cls: 'bg-amber-100 text-amber-700' }
  if (MATCH_CODES.some((code) => codes.has(code))) return { label: 'Recommended', cls: 'bg-green-100 text-green-700', star: true }
  if (codes.has('popular')) return { label: 'Trending', cls: 'bg-sky-100 text-sky-700' }
  return null
}

export default function HomePage() {
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const [field, setField] = useState('')
  const [location, setLocation] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selected, setSelected] = useState(mockOpportunities[0])
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false)

  function selectOpportunity(opportunity) {
    setSelected(opportunity)
    setShowDetailedExplanation(false)
  }

  const filtered = useMemo(() => mockOpportunities.filter((opportunity) => {
    const text = query.trim().toLowerCase()
    return (type === 'all' || opportunity.opp_type === type)
      && (!text || `${opportunity.title} ${opportunity.organisation}`.toLowerCase().includes(text))
      && (!field || opportunity.research_field === field)
      && (!location || opportunity.zip_code === location)
  }), [field, location, query, type])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Portfolio Demo · Mock Data</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Research opportunities for you</h1>
        <p className="mt-2 text-base text-slate-500">Explore recommendations prepared for the fixed Demo Scholar profile.</p>
      </div>

      <div className="relative mx-auto mt-7 max-w-3xl">
        <div className="flex rounded-2xl border border-slate-300 bg-white p-1.5 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
          <svg className="ml-3 mt-2.5 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" placeholder="Search opportunities" aria-label="Search opportunities" />
          <button type="button" onClick={() => setShowFilters((value) => !value)} aria-expanded={showFilters} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100" title="Filter opportunities">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            {(field || location) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-600" />}
          </button>
        </div>
        {showFilters && <Filters field={field} setField={setField} location={location} setLocation={setLocation} />}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {TYPE_TABS.map(([key, label]) => <Pill key={key} active={type === key} onClick={() => { setType(key); setSelected(null); setShowDetailedExplanation(false) }}>{label}</Pill>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card className="p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">{TYPE_TABS.find(([key]) => key === type)?.[1]}</h2>
            <span className="text-sm text-slate-400">{filtered.length} mock recommendations</span>
          </div>
          <div className="max-h-[calc(100vh-330px)] min-h-96 space-y-3 overflow-y-auto pr-1">
            {filtered.length ? filtered.map((opportunity) => <OpportunityCard key={opportunity.internal_id} opportunity={opportunity} selected={selected?.internal_id === opportunity.internal_id} onSelect={() => selectOpportunity(opportunity)} />) : <p className="py-12 text-center text-sm text-slate-400">No opportunities match these filters.</p>}
          </div>
        </Card>
        {selected ? (
          <DetailPanel
            opportunity={selected}
            showDetailedExplanation={showDetailedExplanation}
            onToggleExplanation={() => setShowDetailedExplanation((shown) => !shown)}
            onClose={() => { setSelected(null); setShowDetailedExplanation(false) }}
          />
        ) : <EmptyDetail />}
      </div>
    </main>
  )
}

function Filters({ field, setField, location, setLocation }) {
  return (
    <div className="absolute right-0 top-full z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:w-[32rem]">
      <div className="grid gap-3 sm:grid-cols-2">
        <FilterSelect label="Research Field" value={field} onChange={setField} options={RESEARCH_FIELDS} empty="All research fields" />
        <FilterSelect label="Location" value={location} onChange={setLocation} options={LOCATIONS} empty="All locations" />
      </div>
      {(field || location) && <button type="button" onClick={() => { setField(''); setLocation('') }} className="mt-3 text-sm font-medium text-slate-500 hover:text-brand-700">Clear filters</button>}
    </div>
  )
}

function FilterSelect({ label, value, onChange, options, empty }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-600 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"><option value="">{empty}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function OpportunityCard({ opportunity, selected, onSelect }) {
  const badge = recBadge(opportunity.reason)
  return (
    <button type="button" onClick={onSelect} className={`w-full rounded-xl border p-4 text-left transition ${selected ? 'border-brand-500 bg-brand-50/40 shadow-md ring-1 ring-brand-200' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2"><Badge color="brand">{TYPE_LABEL[opportunity.opp_type]}</Badge>{badge && <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.cls}`}>{badge.star && '★'}{badge.label}</span>}</div>
      <h3 className="font-semibold text-slate-900">{opportunity.title}</h3>
      <PublisherLine opportunity={opportunity} />
      <p className="mt-1 text-sm text-slate-500">{formatAmount(opportunity.amount)} · Deadline {formatDate(opportunity.deadline_end)}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">{opportunity.reason.map((reason) => <span key={reason.code} className={`rounded-lg px-2 py-0.5 text-xs font-medium shadow-sm ${reason.code === 'because_saved' ? 'bg-violet-100 text-violet-700' : 'bg-brand-50 text-brand-700'}`}>{reason.text}</span>)}</div>
    </button>
  )
}

function PublisherLine({ opportunity }) {
  return <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">✓ Verified</span><span>Published by {opportunity.publisher_name}</span></div>
}

function DetailPanel({ opportunity, onClose, showDetailedExplanation, onToggleExplanation }) {
  const badge = recBadge(opportunity.reason)
  const tone = badge?.label === 'Related to your field' ? ['border-amber-100 bg-amber-50/60', 'text-amber-800', 'Why this is related to you'] : badge?.label === 'Trending' ? ['border-sky-100 bg-sky-50/60', 'text-sky-800', 'Why this is here'] : ['border-green-100 bg-green-50/60', 'text-green-800', 'Why we recommend this']
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-xl font-bold text-slate-900">{opportunity.title}</h2><PublisherLine opportunity={opportunity} /></div><button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-500 hover:bg-slate-50" aria-label="Close opportunity details">×</button></div>
      <div className={`mt-5 rounded-xl border p-4 shadow-sm ${tone[0]}`}>
        <div className={`text-sm font-semibold ${tone[1]}`}>★ {tone[2]}</div>
        <p className={`mt-2 text-sm leading-relaxed ${tone[1]}`}>{opportunity.reason[0]?.text}</p>
        <button
          type="button"
          onClick={onToggleExplanation}
          aria-expanded={showDetailedExplanation}
          className={`mt-3 text-sm font-semibold underline decoration-current/30 underline-offset-4 transition hover:decoration-current ${tone[1]}`}
        >
          {showDetailedExplanation ? 'Hide detailed explanation' : 'View detailed explanation'}
        </button>
        {showDetailedExplanation && (
          <div className="mt-3 border-t border-current/10 pt-3">
            <p className={`text-sm leading-relaxed ${tone[1]}`}>{opportunity.recommendation_text}</p>
            <p className="mt-2 text-[11px] italic text-slate-400">Mock explanation · No AI service used</p>
          </div>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-100 pt-6"><Field label="Opportunity Type" value={TYPE_LABEL[opportunity.opp_type]} /><Field label="Amount" value={formatAmount(opportunity.amount)} /><Field label="Application Opens" value={formatDate(opportunity.application_start)} /><Field label="Application Closes" value={formatDate(opportunity.application_end)} /><Field label="Research Field" value={opportunity.research_field} /><Field label="Location" value={opportunity.zip_code} /><Field label="Contact" value={opportunity.contact} /></div>
      <div className="mt-6 border-t border-slate-100 pt-6"><h3 className="font-semibold text-slate-900">Opportunity description</h3><div className="mt-4 grid gap-5 sm:grid-cols-2"><SummaryList title="What you can get" items={opportunity.ai_summary.what_you_can_get} /><SummaryList title="Eligibility" items={opportunity.ai_summary.eligibility} /></div></div>
    </Card>
  )
}

function Field({ label, value }) { return <div><div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div><div className="mt-0.5 text-sm text-slate-800">{value || '—'}</div></div> }
function SummaryList({ title, items }) { return <section><h4 className="text-sm font-semibold text-slate-900">{title}</h4><ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">{items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" /><span>{item}</span></li>)}</ul></section> }
function EmptyDetail() { return <Card className="flex min-h-96 items-center justify-center p-8 text-center shadow-sm"><div><svg className="mx-auto h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 5h16v14H4zM8 9h8M8 13h5" /></svg><p className="mt-3 text-sm text-slate-500">Select an opportunity to view details.</p></div></Card> }

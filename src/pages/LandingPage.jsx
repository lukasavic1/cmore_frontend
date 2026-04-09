import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { isValidEmail } from '../lib/validation'

/** Three headline features — each gets its own full section below. */
const LANDING_FEATURES = [
  {
    id: 'kanban',
    eyebrow: '01 · Workflow',
    title: 'Kanban board for every initiative',
    lead:
      'Tasks live on a three-column board — To do, In progress, and Done. Move work forward the way your team already thinks about delivery, without leaving the sustainability context.',
    points: [
      'Create and edit tasks with title, description, priority, and due date in one place.',
      'Drag cards between columns so status always matches reality on the ground.',
    ],
    visual: 'kanban',
  },
  {
    id: 'priority',
    eyebrow: '02 · Planning',
    title: 'Priorities and dates that stay visible',
    lead:
      'ESG and sustainability work competes with everything else on the calendar. This demo keeps priority and deadlines on the surface so the next action is never a guessing game.',
    points: [
      'Low, medium, and high priority with colour cues for quick scanning.',
      'Due dates and overdue highlighting so nothing important quietly slips.',
    ],
    visual: 'priority',
  },
  {
    id: 'insight',
    eyebrow: '03 · Overview',
    title: 'Search, filters, and live counts',
    lead:
      'Once the board fills up, you need a fast way to narrow in. The app combines live search, status filters, and a statistics strip so you can answer “where are we?” in seconds.',
    points: [
      'Search runs across titles and descriptions as you type.',
      'Totals for to do, in progress, completed, and overdue update with your data.',
    ],
    visual: 'insight',
  },
]

// ─── Section visuals (lightweight mock UI, no screenshots) ───────────────────

function KanbanMock() {
  const col = (title, items, tint) => (
    <div className="flex-1 min-w-[140px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">{title}</p>
      <div className="space-y-2">
        {items.map((label, i) => (
          <div
            key={i}
            className="rounded-lg border border-[var(--border)] px-2.5 py-2 text-xs text-[var(--text)] bg-[color-mix(in_srgb,var(--primary)_6%,white)]"
            style={{ borderLeftWidth: 3, borderLeftColor: tint }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
      {col('To do', ['Carbon report draft', 'Vendor survey'], 'var(--muted-2)')}
      {col('In progress', ['Scope 2 data'], 'var(--warning)')}
      {col('Done', ['Q1 disclosure'], 'var(--success)')}
    </div>
  )
}

function PriorityMock() {
  const badges = [
    { label: 'High', cls: 'bg-[color-mix(in_srgb,var(--danger)_12%,white)] text-[var(--danger)] border-[color-mix(in_srgb,var(--danger)_35%,var(--border))]' },
    { label: 'Medium', cls: 'bg-[color-mix(in_srgb,var(--warning)_18%,white)] text-[var(--warning)] border-[color-mix(in_srgb,var(--warning)_40%,var(--border))]' },
    { label: 'Low', cls: 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]' },
  ]
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] space-y-4">
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.label} className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${b.cls}`}>
            {b.label}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--border)] p-3 text-sm">
        <div className="flex justify-between items-start gap-3">
          <span className="font-medium text-[var(--text)]">Board diversity metrics</span>
          <span className="text-xs text-[var(--danger)] font-medium whitespace-nowrap">Overdue</span>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">Due 15 Apr · Medium priority</p>
      </div>
    </div>
  )
}

function InsightMock() {
  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {[
          { n: '12', l: 'Total' },
          { n: '4', l: 'To do' },
          { n: '3', l: 'In progress' },
          { n: '4', l: 'Done' },
          { n: '1', l: 'Overdue' },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center min-w-[4.5rem] shadow-[var(--shadow-sm)]"
          >
            <div className="text-lg font-bold text-[var(--text)]">{s.n}</div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--muted)] shadow-[var(--shadow-sm)] flex items-center gap-2">
        <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="truncate">Search tasks…</span>
      </div>
    </div>
  )
}

function FeatureVisual({ type }) {
  if (type === 'kanban') return <KanbanMock />
  if (type === 'priority') return <PriorityMock />
  return <InsightMock />
}

// ─── Google button ────────────────────────────────────────────────────────────

function GoogleButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-[var(--text)] text-sm shadow-[var(--shadow-sm)]"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" className="flex-shrink-0">
        <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
        <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
        <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
        <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
      </svg>
      {loading ? 'Signing in…' : 'Continue with Google'}
    </button>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({ label, type = 'text', value, onChange, placeholder, error, name, autoComplete, maxLength }) {
  const id = name ?? `auth-${String(label).replace(/\s+/g, '-').toLowerCase()}`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--text)] mb-1.5">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full px-3 py-2.5 text-sm bg-[var(--surface)] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_35%,transparent)] transition-colors placeholder-[var(--muted-2)] text-[var(--text)] shadow-[var(--shadow-sm)]
          ${error ? 'border-[color-mix(in_srgb,var(--danger)_55%,var(--border))]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'}`}
      />
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  )
}

// ─── Auth card ────────────────────────────────────────────────────────────────

function AuthCard() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

  const [tab, setTab]         = useState('google')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function clearErrors() { setError(null); setFieldErrors({}) }
  function handleTabChange(t) { setTab(t); clearErrors() }

  async function handleGoogle() {
    clearErrors()
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(friendlyError(err))
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleSignIn(e) {
    e.preventDefault()
    clearErrors()
    const emailTrim = email.trim()
    const errs = {}
    if (!emailTrim) errs.email = 'Email is required.'
    else if (!isValidEmail(emailTrim)) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setLoading(true)
    try {
      await signInWithEmail(emailTrim, password)
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    clearErrors()
    const emailTrim = email.trim()
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required.'
    else if (name.trim().length > 128) errs.name = 'Name must be 128 characters or fewer.'
    if (!emailTrim) errs.email = 'Email is required.'
    else if (!isValidEmail(emailTrim)) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    else if (password.length < 6) errs.password = 'Must be at least 6 characters.'
    if (password !== confirm) errs.confirm = 'Passwords do not match.'
    if (Object.keys(errs).length) { setFieldErrors(errs); return }

    setLoading(true)
    try {
      await signUpWithEmail(name.trim(), emailTrim, password)
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-6">
      <div className="flex rounded-xl border border-[var(--border)] overflow-hidden mb-5 bg-[var(--surface-2)] shadow-[var(--shadow-sm)]">
        {[['google', 'Google'], ['signin', 'Sign in'], ['signup', 'Sign up']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex-1 py-2 text-sm font-medium transition-all focus:outline-none
              ${tab === key
                ? 'bg-[var(--primary)] text-white'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/40'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-3 py-2.5 bg-[var(--danger-bg)] border border-[color-mix(in_srgb,var(--danger)_30%,var(--border))] rounded-xl text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {tab === 'google' && (
        <div className="flex flex-col gap-3">
          <GoogleButton onClick={handleGoogle} loading={loading} />
          <p className="text-xs text-[var(--muted)] text-center">No password needed · Secure Google sign-in</p>
        </div>
      )}

      {tab === 'signin' && (
        <form noValidate onSubmit={handleSignIn} className="flex flex-col gap-3">
          <Field
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            error={fieldErrors.email}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
            error={fieldErrors.password}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1 shadow-sm"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-xs text-[var(--muted)] text-center">
            No account?{' '}
            <button type="button" onClick={() => handleTabChange('signup')}
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
              Sign up
            </button>
          </p>
        </form>
      )}

      {tab === 'signup' && (
        <form noValidate onSubmit={handleSignUp} className="flex flex-col gap-3">
          <Field
            label="Full name"
            name="name"
            value={name}
            onChange={setName}
            placeholder="Your Name"
            autoComplete="name"
            maxLength={128}
            error={fieldErrors.name}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            error={fieldErrors.email}
          />
          <Field
            label="Password"
            name="new-password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <Field
            label="Confirm password"
            name="confirm-password"
            type="password"
            value={confirm}
            onChange={setConfirm}
            placeholder="••••••••"
            autoComplete="new-password"
            error={fieldErrors.confirm}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1 shadow-sm"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-xs text-[var(--muted)] text-center">
            Already have an account?{' '}
            <button type="button" onClick={() => handleTabChange('signin')}
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  )
}

// ─── Friendly Firebase error messages ─────────────────────────────────────────

function friendlyError(err) {
  const map = {
    'auth/invalid-email':            'Enter a valid email address.',
    'auth/user-not-found':           'No account found with that email.',
    'auth/wrong-password':           'Incorrect password.',
    'auth/invalid-credential':       'Incorrect email or password.',
    'auth/email-already-in-use':     'An account with that email already exists.',
    'auth/weak-password':            'Password must be at least 6 characters.',
    'auth/too-many-requests':        'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/unauthorized-domain':      'This domain is not authorised in Firebase Console.',
    'auth/operation-not-allowed':    'This sign-in method is not enabled in Firebase Console.',
  }
  return map[err?.code] ?? err?.response?.data?.message ?? err?.message ?? 'Something went wrong.'
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">

      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[color-mix(in_srgb,var(--primary)_10%,white)] border border-[color-mix(in_srgb,var(--primary)_18%,white)] flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-[var(--text)] text-base tracking-tight truncate">C-More Task Tracker</span>
          </div>
          <a
            href="#feature-kanban"
            className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] hidden sm:inline transition-colors"
          >
            What this demo includes
          </a>
        </div>
      </header>

      {/* Hero — explains demo purpose */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-20 min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 bg-[color-mix(in_srgb,var(--primary)_10%,white)] border border-[color-mix(in_srgb,var(--primary)_18%,white)] text-[var(--primary)] text-xs font-medium px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
              Demo application
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[var(--text)] tracking-tight mb-6 leading-[1.08]">
              A sample sustainability<br className="hidden sm:block" />
              <span className="text-[var(--primary)]"> task workspace</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-4">
              This is a deliberately small demo: a task tracker themed around ESG and sustainability work.
              It exists to show a credible product shell — sign-in, a Kanban board, and everyday task mechanics —
              wired to a real backend and auth, not to replace your production tooling.
            </p>
            <p className="text-sm text-[var(--muted-2)] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Sign in below to try it. The next sections walk through three things the UI is built to highlight,
              one at a time.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start items-center">
              <a
                href="#feature-kanban"
                className="inline-flex items-center justify-center text-sm font-medium text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_35%,var(--border))] bg-[color-mix(in_srgb,var(--primary)_6%,white)] hover:bg-[color-mix(in_srgb,var(--primary)_10%,white)] px-4 py-2.5 rounded-xl transition-colors"
              >
                Read the three highlights
              </a>
              <span className="text-xs text-[var(--muted)]">Laravel API · React · Firebase Auth</span>
            </div>
          </div>
          <div className="w-full lg:w-auto flex justify-center flex-shrink-0" id="sign-in">
            <AuthCard />
          </div>
        </div>
      </section>

      {/* One full-height-style section per feature */}
      {LANDING_FEATURES.map((f, index) => {
        const isReversed = index % 2 === 1
        return (
          <section
            key={f.id}
            id={`feature-${f.id}`}
            className={`border-t border-[var(--border)] scroll-mt-16 ${
              index % 2 === 0 ? 'bg-[var(--surface-2)]' : 'bg-[var(--bg)]'
            }`}
          >
            <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28 lg:py-32 min-h-[85dvh] flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
                    {f.eyebrow}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight leading-tight">
                    {f.title}
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-prose">
                    {f.lead}
                  </p>
                  <ul className="space-y-3 max-w-prose">
                    {f.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm sm:text-base text-[var(--text)] leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--success)_15%,white)] border border-[color-mix(in_srgb,var(--success)_35%,var(--border))] flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={isReversed ? 'lg:order-1' : ''}>
                  <FeatureVisual type={f.visual} />
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <footer className="border-t border-[var(--border)] py-10 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)] text-center sm:text-left">
          <span>© {new Date().getFullYear()} C-More Task Tracker — demo only</span>
          <a href="#sign-in" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
            Back to sign in
          </a>
        </div>
      </footer>
    </div>
  )
}

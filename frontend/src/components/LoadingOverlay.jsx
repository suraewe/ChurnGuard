export default function LoadingOverlay({ isDark }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}
    >
      {/* Apple-style spinner */}
      <div className="relative w-20 h-20 mb-8">
        <svg className="animate-spin w-20 h-20" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="36" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} strokeWidth="3" />
          <path
            d="M 40 4 A 36 36 0 0 1 76 40"
            stroke="url(#appleSpinGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="appleSpinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#007AFF" />
              <stop offset="100%" stopColor="#5AC8FA" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="text-center">
        <h3
          className="text-xl font-semibold mb-2 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Analyzing Customer Profile
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Running neural engine · Calculating risk factors...
        </p>

        {/* Minimal dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--apple-blue)',
                animation: `apDotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-56">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="h-full rounded-full" style={{ background: 'var(--apple-blue)', animation: 'apLoadProgress 1.8s ease-in-out forwards' }} />
        </div>
      </div>

      <style>{`
        @keyframes apDotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }
        @keyframes apLoadProgress {
          0% { width: 0%; }
          30% { width: 40%; }
          70% { width: 75%; }
          100% { width: 95%; }
        }
      `}</style>
    </div>
  );
}

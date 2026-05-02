export default function Footer({ isDark }) {
  return (
    <footer
      className="py-8 px-4"
      style={{
        borderTop: `0.5px solid var(--border-color)`,
        background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            ChurnGuard<span style={{ color: 'var(--apple-blue)', marginLeft: '2px' }}>AI</span>
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>v2.4.1</span>
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
          Built for hackathons, startups & ML showcases · Simulated data only
        </p>

        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <span className="flex items-center gap-1.5" style={{ color: 'var(--apple-green)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--apple-green)' }} />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

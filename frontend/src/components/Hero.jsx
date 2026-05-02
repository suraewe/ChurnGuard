import { useState, useEffect } from 'react';

const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

const StatCard = ({ label, value, suffix }) => (
  <div className="apple-card apple-card-hover text-center px-6 py-5">
    <div className="text-2xl font-bold mb-1 tracking-tight" style={{ color: 'var(--apple-blue)' }}>
      <AnimatedCounter target={value} suffix={suffix} />
    </div>
    <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
  </div>
);

const Badge = ({ icon, text, isDark }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
    style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: 'var(--text-secondary)' }}>
    {icon}{text}
  </div>
);

export default function Hero({ isDark, onAnalyzeClick }) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden"
      style={{ background: isDark ? '#000000' : '#ffffff' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isDark
          ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,122,255,0.08) 0%, transparent 60%)'
          : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,122,255,0.04) 0%, transparent 60%)',
      }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 animate-fade-in">
          <Badge icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>} text="AI-Powered Analytics" isDark={isDark} />
          <Badge icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>} text="Real-time Prediction" isDark={isDark} />
          <Badge icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} text="94.3% Accuracy" isDark={isDark} />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-slide-up tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Predict Customer{' '}<span style={{ color: 'var(--apple-blue)' }}>Churn</span>
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl font-medium" style={{ color: 'var(--text-tertiary)' }}>Before It Happens</span>
        </h1>

        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
          Harness machine learning to identify at-risk banking customers with{' '}
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>surgical precision</span>.
          Reduce churn, retain revenue, and drive proactive engagement.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button onClick={onAnalyzeClick} className="btn-primary px-8 py-3.5 text-base">Analyze Customer</button>
          <button className="px-8 py-3.5 rounded-full text-base font-medium transition-all duration-200"
            style={{ background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`, color: 'var(--apple-blue)' }}>
            View Demo →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <StatCard label="Customers Analyzed" value={124870} suffix="" />
          <StatCard label="Churn Prevented" value={18340} suffix="+" />
          <StatCard label="Model Accuracy" value={94} suffix="%" />
          <StatCard label="Revenue Saved" value={4} suffix="M+" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-float">
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Scroll</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--text-tertiary)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getRiskLevel } from '../utils/prediction';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, DoughnutController);

const AnimNum = ({ value, suffix = '', decimals = 0, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(parseFloat(start.toFixed(decimals)));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toFixed(decimals)}{suffix}</>;
};

const RiskBar = ({ score }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(score), 100); }, [score]);
  const gradient = score >= 75 ? 'linear-gradient(90deg, #FF3B30, #FF6961)'
    : score >= 55 ? 'linear-gradient(90deg, #FF9500, #FFCC00)'
    : score >= 35 ? 'linear-gradient(90deg, #FFCC00, #FFD60A)'
    : 'linear-gradient(90deg, #34C759, #30D158)';
  return (
    <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
      <div className="risk-bar-fill" style={{ width: `${width}%`, background: gradient }} />
    </div>
  );
};

const FactorChip = ({ factor, isDark }) => {
  const isRisk = factor.direction === 'risk';
  const impact = { high: 3, medium: 2, low: 1 }[factor.impact] || 1;
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm"
      style={{ background: isDark ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
      <span className="text-sm" style={{ color: isRisk ? 'var(--apple-red)' : 'var(--apple-green)' }}>{isRisk ? '↑' : '↓'}</span>
      <span style={{ color: 'var(--text-primary)' }}>{factor.label}</span>
      <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ background: isRisk ? 'rgba(255,59,48,0.1)' : 'rgba(52,199,89,0.1)', color: isRisk ? 'var(--apple-red)' : 'var(--apple-green)' }}>
        {'●'.repeat(impact)}
      </span>
    </div>
  );
};

const MiniStatCard = ({ label, value, icon, color, isDark }) => (
  <div className="apple-card apple-card-hover p-5">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{label}</span>
    </div>
    <div className="text-xl font-bold tracking-tight" style={{ color }}>{value}</div>
  </div>
);

export default function ResultsDashboard({ result, formData, isDark, onReset }) {
  const { prediction, probability, riskScore, confidence, factors, modelVersion, timestamp } = result;
  const isChurn = prediction === 1;
  const riskLevel = getRiskLevel(riskScore);
  const primaryColor = isChurn ? 'var(--apple-red)' : 'var(--apple-green)';
  const primaryHex = isChurn ? '#FF3B30' : '#34C759';

  const chartData = {
    datasets: [{ data: [riskScore, 100 - riskScore],
      backgroundColor: [primaryHex, isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'],
      borderColor: ['transparent', 'transparent'], borderWidth: 0, hoverOffset: 4,
    }],
  };
  const chartOptions = { cutout: '78%', plugins: { legend: { display: false }, tooltip: { enabled: false } }, animation: { duration: 1500, easing: 'easeInOutQuart' } };

  return (
    <section id="results" className="py-24 px-4" style={{ background: isDark ? '#000000' : '#ffffff' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <p className="text-sm font-medium mb-3" style={{ color: primaryColor }}>{isChurn ? '⚠ Risk Detected' : '✓ Analysis Complete'}</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>Prediction Results</h2>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{modelVersion} · {new Date(timestamp).toLocaleString()}</p>
        </div>

        <div className="apple-card p-8 mb-6 animate-scale-in overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-shrink-0 relative w-48 h-48">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight" style={{ color: primaryColor }}><AnimNum value={riskScore} suffix="%" /></span>
                <span className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Risk Score</span>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-tertiary)' }}>{riskLevel.label}</p>
              <h3 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight" style={{ color: primaryColor }}>
                {isChurn ? 'HIGH RISK' : 'LIKELY STAY'}
              </h3>
              <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {isChurn
                  ? `This customer has a ${(probability * 100).toFixed(1)}% probability of churning. Immediate intervention is recommended.`
                  : `This customer shows strong loyalty with only a ${(probability * 100).toFixed(1)}% churn probability. Continue standard engagement.`}
              </p>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Risk Level</span><span style={{ color: primaryColor }}>{riskScore}/100</span>
                </div>
                <RiskBar score={riskScore} />
                <div className="flex justify-between text-xs mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 text-center p-6 rounded-2xl" style={{ background: isDark ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', minWidth: '140px' }}>
              <div className="text-3xl font-bold mb-1 tracking-tight" style={{ color: 'var(--apple-blue)' }}><AnimNum value={confidence * 100} suffix="%" decimals={1} /></div>
              <div className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>AI Confidence</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>{isChurn ? 'CHURN' : 'RETAIN'}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Prediction</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <MiniStatCard label="Churn Probability" value={`${(probability * 100).toFixed(1)}%`} icon="📊" color={primaryHex} isDark={isDark} />
          <MiniStatCard label="Risk Score" value={`${riskScore}/100`} icon="🎯" color={riskLevel.color} isDark={isDark} />
          <MiniStatCard label="Model Confidence" value={`${(confidence * 100).toFixed(0)}%`} icon="🤖" color="#007AFF" isDark={isDark} />
          <MiniStatCard label="Customer Tenure" value={`${formData.tenure}y`} icon="📅" color="#FF9500" isDark={isDark} />
        </div>

        {factors && factors.length > 0 && (
          <div className="apple-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Key Contributing Factors</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {factors.map((f, i) => <FactorChip key={i} factor={f} isDark={isDark} />)}
            </div>
          </div>
        )}

        <div className="apple-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Customer Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Credit Score', value: formData.creditScore }, { label: 'Age', value: formData.age },
              { label: 'Balance', value: `$${Number(formData.balance).toLocaleString()}` },
              { label: 'Products', value: formData.numProducts }, { label: 'Geography', value: formData.geography },
              { label: 'Gender', value: formData.gender },
              { label: 'Salary', value: `$${Number(formData.estimatedSalary).toLocaleString()}` },
              { label: 'Active', value: formData.isActiveMember ? 'Yes' : 'No' },
              { label: 'Credit Card', value: formData.hasCrCard ? 'Yes' : 'No' },
              { label: 'Tenure', value: `${formData.tenure} years` },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>{item.label}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button onClick={onReset} className="btn-primary px-8 py-3.5 text-base">Analyze New Customer</button>
          <button className="px-8 py-3.5 rounded-full text-base font-medium transition-all duration-200"
            style={{ background: 'transparent', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`, color: 'var(--apple-blue)' }}>
            Export Report
          </button>
        </div>
      </div>
    </section>
  );
}

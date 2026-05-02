import { useState } from 'react';

const initialForm = {
  creditScore: '', age: '', tenure: '', balance: '',
  estimatedSalary: '', geography: '', gender: '',
  numProducts: '', hasCrCard: false, isActiveMember: false,
};

const Toggle = ({ checked, onChange, label }) => (
  <label className="toggle-switch cursor-pointer" title={label}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className="toggle-slider" />
  </label>
);

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide"
    style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem', letterSpacing: '0.04em' }}>
    {children}
    {required && <span style={{ color: 'var(--apple-red)' }} className="ml-1">*</span>}
  </label>
);

const InputField = ({ type = 'number', placeholder, value, onChange, error, min, max, step }) => (
  <div>
    <input className={`input-field ${error ? 'border-red-400' : ''}`}
      type={type} placeholder={placeholder} value={value}
      onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step} />
    {error && <p className="mt-1.5 text-xs" style={{ color: 'var(--apple-red)' }}>{error}</p>}
  </div>
);

const SelectField = ({ value, onChange, options, placeholder, error }) => (
  <div>
    <select className={`input-field ${error ? 'border-red-400' : ''}`}
      value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
    {error && <p className="mt-1.5 text-xs" style={{ color: 'var(--apple-red)' }}>{error}</p>}
  </div>
);

const validate = (form) => {
  const errors = {};
  if (!form.creditScore || form.creditScore < 300 || form.creditScore > 850) errors.creditScore = 'Must be 300–850';
  if (!form.age || form.age < 18 || form.age > 100) errors.age = 'Must be 18–100';
  if (form.tenure === '' || form.tenure < 0 || form.tenure > 50) errors.tenure = 'Must be 0–50 years';
  if (form.balance === '' || form.balance < 0) errors.balance = 'Must be ≥ 0';
  if (!form.estimatedSalary || form.estimatedSalary < 0) errors.estimatedSalary = 'Must be ≥ 0';
  if (!form.geography) errors.geography = 'Please select a region';
  if (!form.gender) errors.gender = 'Please select a gender';
  if (!form.numProducts || form.numProducts < 1 || form.numProducts > 4) errors.numProducts = 'Must be 1–4';
  return errors;
};

const FormSection = ({ title, children, isDark }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-5">
      <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</h3>
      <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
    </div>
    {children}
  </div>
);

export default function CustomerForm({ isDark, onSubmit, isLoading }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const set = (field) => (val) => {
    setForm((p) => ({ ...p, [field]: val }));
    if (touched[field]) {
      const newErrors = validate({ ...form, [field]: val });
      setErrors((p) => ({ ...p, [field]: newErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(initialForm).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({
      ...form, creditScore: Number(form.creditScore), age: Number(form.age),
      tenure: Number(form.tenure), balance: Number(form.balance),
      estimatedSalary: Number(form.estimatedSalary), numProducts: Number(form.numProducts),
    });
  };

  return (
    <section id="form" className="py-24 px-4" style={{ background: isDark ? '#000000' : 'var(--bg-secondary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14 animate-fade-in">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--apple-blue)' }}>Customer Analysis</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Customer Profile Input
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Enter customer data to generate an AI-powered churn risk assessment.
          </p>
        </div>

        <div className="apple-card p-8 sm:p-10 animate-slide-up">
          <form onSubmit={handleSubmit} noValidate>
            <FormSection title="Financial Profile" isDark={isDark}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div><FieldLabel required>Credit Score</FieldLabel><InputField placeholder="e.g. 650" value={form.creditScore} onChange={set('creditScore')} error={touched.creditScore && errors.creditScore} min={300} max={850} /></div>
                <div><FieldLabel required>Account Balance ($)</FieldLabel><InputField placeholder="e.g. 75000" value={form.balance} onChange={set('balance')} error={touched.balance && errors.balance} min={0} step={0.01} /></div>
                <div><FieldLabel required>Estimated Salary ($)</FieldLabel><InputField placeholder="e.g. 85000" value={form.estimatedSalary} onChange={set('estimatedSalary')} error={touched.estimatedSalary && errors.estimatedSalary} min={0} step={0.01} /></div>
              </div>
            </FormSection>

            <FormSection title="Personal Information" isDark={isDark}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div><FieldLabel required>Age</FieldLabel><InputField placeholder="e.g. 35" value={form.age} onChange={set('age')} error={touched.age && errors.age} min={18} max={100} /></div>
                <div><FieldLabel required>Tenure (years)</FieldLabel><InputField placeholder="e.g. 5" value={form.tenure} onChange={set('tenure')} error={touched.tenure && errors.tenure} min={0} max={50} /></div>
                <div><FieldLabel required>Geography</FieldLabel><SelectField value={form.geography} onChange={set('geography')} placeholder="Select Region" error={touched.geography && errors.geography} options={[{ value: 'France', label: 'France' },{ value: 'Germany', label: 'Germany' },{ value: 'Spain', label: 'Spain' }]} /></div>
                <div><FieldLabel required>Gender</FieldLabel><SelectField value={form.gender} onChange={set('gender')} placeholder="Select Gender" error={touched.gender && errors.gender} options={[{ value: 'Male', label: 'Male' },{ value: 'Female', label: 'Female' }]} /></div>
              </div>
            </FormSection>

            <FormSection title="Account Details" isDark={isDark}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div><FieldLabel required>Number of Products</FieldLabel><SelectField value={form.numProducts} onChange={set('numProducts')} placeholder="Select Count" error={touched.numProducts && errors.numProducts} options={[{ value: '1', label: '1 Product' },{ value: '2', label: '2 Products' },{ value: '3', label: '3 Products' },{ value: '4', label: '4 Products' }]} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{ background: isDark ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: `1px solid var(--border-color)` }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Has Credit Card</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Customer holds a bank credit card</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium" style={{ color: form.hasCrCard ? 'var(--apple-green)' : 'var(--text-tertiary)' }}>{form.hasCrCard ? 'Yes' : 'No'}</span>
                    <Toggle checked={form.hasCrCard} onChange={set('hasCrCard')} label="Has Credit Card" />
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{ background: isDark ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: `1px solid var(--border-color)` }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Active Member</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Customer is actively using services</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium" style={{ color: form.isActiveMember ? 'var(--apple-green)' : 'var(--text-tertiary)' }}>{form.isActiveMember ? 'Yes' : 'No'}</span>
                    <Toggle checked={form.isActiveMember} onChange={set('isActiveMember')} label="Active Member" />
                  </div>
                </div>
              </div>
            </FormSection>

            <div className="pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 text-base flex items-center justify-center"
                style={{ opacity: isLoading ? 0.7 : 1 }}>
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                    <span>Analyzing...</span>
                  </div>
                ) : 'Run Churn Prediction'}
              </button>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
                Powered by ChurnGuard Neural Engine v2.4 · ~1.5s inference time
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

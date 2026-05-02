import { useState, useRef } from 'react';
import Hero from '../components/Hero';
import CustomerForm from '../components/CustomerForm';
import ResultsDashboard from '../components/ResultsDashboard';
import LoadingOverlay from '../components/LoadingOverlay';
import { predictChurn } from '../utils/prediction';
import { toast } from '../components/Toast';

export default function Home({ isDark }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const formRef = useRef(null);
  const resultsRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (data) => {
    setFormData(data);
    setIsLoading(true);
    setResult(null);

    try {
      const prediction = await predictChurn(data);
      setResult(prediction);
      toast.success('Analysis complete! Prediction ready.');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err) {
      toast.error('Could not reach the backend server. Make sure it\'s running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    scrollToForm();
    toast.info('Form reset. Ready for new analysis.');
  };

  return (
    <>
      {isLoading && <LoadingOverlay isDark={isDark} />}

      <Hero isDark={isDark} onAnalyzeClick={scrollToForm} />

      <div ref={formRef}>
        <CustomerForm isDark={isDark} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {result && formData && (
        <div ref={resultsRef}>
          <ResultsDashboard
            result={result}
            formData={formData}
            isDark={isDark}
            onReset={handleReset}
          />
        </div>
      )}
    </>
  );
}

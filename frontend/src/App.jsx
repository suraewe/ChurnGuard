import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import { ToastContainer } from './components/Toast';

function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: isDark ? '#000000' : '#ffffff' }}
    >
      <Navbar
        isDark={isDark}
        toggleTheme={toggleTheme}
        onAnalyzeClick={() =>
          document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' })
        }
      />
      <main>
        <Home isDark={isDark} />
      </main>
      <Footer isDark={isDark} />
      <ToastContainer />
    </div>
  );
}

export default App;

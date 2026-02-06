import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrollToTop from './ScrollToTop';
import DepartmentPage from './DepartmentPage';
import ContactPage from './ContactPage';
import Login from './Login';
import DistrictPage from './DistrictPage';
import DiscoveriesPage from './DiscoveriesPage';
import NewsPage from './NewsPage';
import { departmentsData } from './DepartmentsData';
import { initGA, trackPageView } from './utils/analytics';

const departmentIcons = {
  'Hero stones': '/icons/Hero_stones.png',
  'Rock paintings': '/icons/Rock_paintings.png',
  'Inscriptions': '/icons/Inscriptions.png',
  'Forts': '/icons/fort.png',
  'Cairn Circles': '/icons/Cairn_Circle.png',
  'Dolmens': '/icons/Dolmen.png',
  'Menhir': '/icons/menhir.png',
  'Labyrinths': '/icons/Labyrinths.png',
  'Temples': '/icons/temple.png',
  'Statues': '/icons/Statue.png'
};

export default function App() {
  const [state, setState] = useState({
    menuOpen: false,
    darkMode: false,
    language: 'en',
    loading: false, // Set to false since we aren't fetching CSV data anymore
    isLoggedIn: localStorage.getItem('token') ? true : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  });

  const { darkMode, language, menuOpen, isLoggedIn } = state;
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname + window.location.search);
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const fullPath = location.pathname + location.search;
      trackPageView(fullPath);
    }
  }, [location]);

  // Auth synchronization
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setState(prev => ({
          ...prev,
          isLoggedIn: true,
          user: JSON.parse(userData)
        }));
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const toggleLang = () => setState(prev => ({
    ...prev,
    language: prev.language === 'en' ? 'ta' : 'en'
  }));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark", !state.darkMode);
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setState(prev => ({ ...prev, isLoggedIn: true, user: userData }));
    navigate('/admin/news');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState(prev => ({ ...prev, isLoggedIn: false, user: null }));
    navigate('/');
  };

  const texts = {
    en: {
      teamName: 'Krishnagiri History Research & Documentation Team',
      welcome: 'Welcome to Our Team',
      description: 'We are committed to uncovering, preserving, and presenting the rich and diverse history of Krishnagiri district.',
      youtube: 'Our YouTube Channel',
      visitChannel: 'Visit @khrdt-krishnagirihistory',
      books: 'Digital Library & Books',
      viewBook: 'Read Our Research Book',
      login: 'Login',
      darkMode: '🌙 Dark Mode',
      lightMode: '☀️ Light Mode',
      home: 'Home',
      news: 'News',
      discoveries: 'Discoveries',
      contact: 'Contact',
    },
    ta: {
      teamName: 'கிருஷ்ணகிரி வரலாற்று ஆய்வு மற்றும் ஆவணப்படுத்தும் குழு',
      welcome: 'எங்கள் குழுவில் வரவேற்கிறோம்',
      description: 'கிருஷ்ணகிரி மாவட்டத்தின் செழுமையான மற்றும் பலதரப்பட்ட வரலாற்றைக் கண்டறிந்து, பாதுகாத்து, வழங்குவதில் நாங்கள் உறுதியாக உள்ளோம்.',
      youtube: 'எங்கள் யூடியூப் சேனல்',
      visitChannel: '@khrdt-krishnagirihistory பக்கத்திற்குச் செல்ல',
      books: 'மின்-நூலகம் மற்றும் புத்தகங்கள்',
      viewBook: 'ஆய்வுப் புத்தகத்தைப் படிக்க',
      login: 'உள்நுழைவு',
      darkMode: '🌙 இருண்ட போக்கு',
      lightMode: '☀️ வெளிச்ச போக்கு',
      home: 'முகப்பு',
      news: 'செய்திகள்',
      discoveries: 'கண்டுபிடிப்புகள்',
      contact: 'தொடர்பு',
    },
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-sans transition-colors duration-300">
        
        <header className="flex justify-between items-center p-6 shadow-md sticky top-0 bg-white dark:bg-gray-900 z-50">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold">{texts[language].teamName}</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="transition-transform duration-200 hover:scale-110">{texts[language].home}</Link>
            <Link to="/news" className="transition-transform duration-200 hover:scale-110">{texts[language].news}</Link>
            <Link to="/discoveries" className="transition-transform duration-200 hover:scale-110">{texts[language].discoveries}</Link>
            <Link to="/contact" className="transition-transform duration-200 hover:scale-110">{texts[language].contact}</Link>
            <button onClick={toggleLang} className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              🌐 {language === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setState(prev => ({ ...prev, menuOpen: !prev.menuOpen }))}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {menuOpen && (
              <motion.div 
                className="absolute right-6 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-col p-4 space-y-2">
                  <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => setState(prev => ({ ...prev, menuOpen: false }))}>🏠 {texts[language].home}</Link>
                  <Link to="/news" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => setState(prev => ({ ...prev, menuOpen: false }))}>📰 {texts[language].news}</Link>
                  <Link to="/discoveries" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => setState(prev => ({ ...prev, menuOpen: false }))}>🔍 {texts[language].discoveries}</Link>
                  <Link to="/contact" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" onClick={() => setState(prev => ({ ...prev, menuOpen: false }))}>📞 {texts[language].contact}</Link>
                  <button onClick={toggleLang} className="text-left p-2">🌐 {language === 'en' ? 'தமிழ்' : 'English'}</button>
                  <button onClick={toggleDarkMode} className="text-left p-2">{darkMode ? texts[language].lightMode : texts[language].darkMode}</button>
                </div>
              </motion.div>
            )}
          </div>
        </header>

        <ScrollToTop />

        <Routes>
          <Route path="/" element={
            <>
              <section className="text-center py-20 px-6 bg-cover bg-center text-white relative" style={{ backgroundImage: "url('/images/bg1.jpeg')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <motion.div className="relative z-10 bg-black bg-opacity-50 p-8 rounded-xl inline-block backdrop-blur-sm" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-3xl font-semibold mb-4">{texts[language].welcome}</h2>
                  <p className="text-lg max-w-2xl mx-auto">{texts[language].description}</p>
                </motion.div>
              </section>

              {/* Departments Section */}
              <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-6 max-w-7xl mx-auto">
                {Object.keys(departmentsData).map((key, i) => (
                  <Link key={i} to={`/department/${encodeURIComponent(key)}`}>
                    <motion.div className="flex flex-col items-center justify-center border dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-800" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <img src={departmentIcons[key]} alt={key} className="w-12 h-12 object-contain mb-3" />
                      <div className="text-md font-medium text-center">{departmentsData[key][language].title}</div>
                    </motion.div>
                  </Link>
                ))}
              </section>

              {/* Bottom Information Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto">
                
                {/* Updated YouTube Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-inner border dark:border-gray-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="text-red-600 mr-2">▶</span> {texts[language].youtube}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {language === 'en' 
                        ? 'Watch our latest documentaries and historical research videos on our official channel.' 
                        : 'எங்கள் அதிகாரப்பூர்வ சேனலில் சமீபத்திய ஆவணப்படங்கள் மற்றும் வரலாற்று ஆய்வு வீடியோக்களைக் காணுங்கள்.'}
                    </p>
                  </div>
                  <a 
                    href="https://www.youtube.com/@khrdt-krishnagirihistory" 
                    target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    {texts[language].visitChannel}
                  </a>
                </div>

                {/* Updated Digital Library (Book) Section */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-inner border dark:border-gray-700 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <span className="text-blue-600 mr-2">📖</span> {texts[language].books}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {language === 'en' 
                        ? 'Explore our documented research and findings in our latest digital publications.' 
                        : 'எங்கள் சமீபத்திய வெளியீடுகளில் ஆவணப்படுத்தப்பட்ட ஆய்வுகள் மற்றும் கண்டுபிடிப்புகளை ஆராயுங்கள்.'}
                    </p>
                  </div>
                  <a 
                    href="https://khrdtinhistorybooks.blogspot.com/2026/01/khrdtinhistorybooks.html" 
                    target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    {texts[language].viewBook}
                  </a>
                </div>

              </section>
            </>
          } />

          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/krishnagiri/:placeName" element={<DistrictPage language={language} />} />
          <Route path="/department/:name" element={<DepartmentPage key={language} language={language} />} />
          <Route path="/news" element={<NewsPage language={language} isAdmin={isLoggedIn} onUnauthorized={handleLogout} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/discoveries" element={<DiscoveriesPage language={language} />} />
        </Routes>
        
        <footer className="text-center py-8 opacity-60 text-sm">
          &copy; {new Date().getFullYear()} {texts[language].teamName}
        </footer>
      </div>
    </div>
  );
}
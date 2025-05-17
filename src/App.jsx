import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ScrollToTop from './ScrollToTop';
import DepartmentPage from './DepartmentPage';
import ContactPage from './ContactPage';
import Login from './Login';
import DistrictPage from './DistrictPage';
import DiscoveriesPage from './DiscoveriesPage';
import NewsPage from './NewsPage'; // Import the NewsPage component
import { departmentsData } from './DepartmentsData';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5nmsMCASycB4LXk0DoAZ_VoGDNcDvujSTgu0mfyxVtg1XGuILjZFuP4ihXOblHynK2_uwJu3xIow/pub?gid=0&single=true&output=csv';

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
    youtubeLinks: [],
    menuOpen: false,
    darkMode: false,
    language: 'en',
    departments: {},
    loading: true,
    error: null
  });
  const { darkMode, language, menuOpen, youtubeLinks, departments, loading, error } = state;

  const toggleLang = () => setState(prev => ({
    ...prev,
    language: prev.language === 'en' ? 'ta' : 'en'
  }));

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark", !state.darkMode);
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const texts = {
    en: {
      teamName: 'Krishnagiri History Research & Documentation Team',
      welcome: 'Welcome to Our Team',
      description: 'We are committed to uncovering, preserving, and presenting the rich and diverse history...',
      departments: ['Hero stones', 'Rock paintings', 'Inscriptions', 'Forts', 'Cairn Circles', 'Dolmens', 'Menhir', 'Labyrinths', 'Temples', 'Statues'],
      youtube: 'Latest YouTube Links',
      map: 'Interactive Map Links',
      login: 'Login',
      darkMode: '🌙 Dark Mode',
      lightMode: '☀️ Light Mode',
      home: 'Home',
      news: 'News',
      discoveries: 'Discoveries',
      contact: 'Contact',
      noLinksAvailable: 'No links available',
      mapComingSoon: 'Interactive map links coming soon',
      newsComingSoon: 'News Page Coming Soon',
    },
    ta: {
      teamName: 'கிருஷ்ணகிரி வரலாற்று ஆய்வு மற்றும் ஆவணப்படுத்தும் குழு',
      welcome: 'எங்கள் குழுவில் வரவேற்கிறோம்',
      description: 'வரலாற்று அறிவை ஆய்வு செய்து, பாதுகாத்து, பகிர்வதில் எங்கள் குழு அர்ப்பணிக்கப்பட்டுள்ளது...',
      departments: ['நடுகற்கள்', 'பாறை ஓவியங்கள்', 'கல்வெட்டுகள்', 'கோட்டைகள்', 'கல்வட்டங்கள்', 'கற்திட்டைகள்', 'குத்துக்கல்', 'புதிர்நிலை', 'கோயில்கள்', 'சிலைகள்'],
      youtube: 'சமீபத்திய YouTube இணைப்புகள்',
      map: 'இயங்குதிறன் வரைபட இணைப்புகள்',
      login: 'உள்நுழைவு',
      darkMode: '🌙 இருண்ட போக்கு',
      lightMode: '☀️ வெளிச்ச போக்கு',
      home: 'முகப்பு',
      news: 'செய்திகள்',
      discoveries: 'கண்டுபிடிப்புகள்',
      contact: 'தொடர்பு',
      noLinksAvailable: 'இணைப்புகள் எதுவும் இல்லை',
      mapComingSoon: 'இயங்குதிறன் வரைபட இணைப்புகள் விரைவில்',
      newsComingSoon: 'செய்திகள் பக்கம் விரைவில்',
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch YouTube links
        const youtubeData = await new Promise((resolve) => {
          Papa.parse(SHEET_URL, {
            download: true,
            header: true,
            complete: (results) => {
              resolve(results.data.filter(row => row.title && row.url).slice(0, 3));
            },
            error: (err) => {
              console.error("CSV Parse Error", err);
              resolve([]);
            }
          });
        });

        setState(prev => ({
          ...prev,
          youtubeLinks: youtubeData,
          loading: false
        }));

      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="text-center bg-red-100 dark:bg-red-900 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  const handleLoginSuccess = (token, user) => {
    console.log('Login successful!', token, user);
    // Here you would typically update your app's state,
    // set authentication tokens, and potentially redirect the user.
  };



  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-sans">
        <header className="flex justify-between items-center p-6 shadow-md">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold">{texts[language].teamName}</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="transition-transform duration-200 hover:scale-110">
              {texts[language].home}
            </Link>
            <Link to="/news" className="transition-transform duration-200 hover:scale-110">
              {texts[language].news}
            </Link>
            <Link to="/discoveries" className="transition-transform duration-200 hover:scale-110">
              {texts[language].discoveries}
            </Link>
            <Link to="/contact" className="transition-transform duration-200 hover:scale-110">
              {texts[language].contact}
            </Link>
            <button onClick={toggleLang} className="px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              🌐 {language === 'en' ? 'English' : 'தமிழ்'}
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-4 relative">
            <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50">
                <div className="flex flex-col p-4 space-y-2">
                  <Link to="/" className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    🏠 {texts[language].home}
                  </Link>
                  <Link to="/news" className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    📰 {texts[language].news}
                  </Link>
                  <Link to="/discoveries" className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    🔍 {texts[language].discoveries}
                  </Link>
                  <Link to="/contact" className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    📞 {texts[language].contact}
                  </Link>
                  <button onClick={toggleLang} className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    🌐 {language === 'en' ? 'English' : 'தமிழ்'}
                  </button>
                  <button onClick={toggleDarkMode} className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                  <hr className="my-1 border-gray-300 dark:border-gray-600" />
                  <Link to="/login">
                    <button className="text-left text-blue-600 hover:underline px-3 py-2">{texts[language].login}</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <ScrollToTop />

        <Routes>
          <Route path="/" element={
            <>
              <section className="text-center py-20 px-6 bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/bg1.jpeg')" }}>
                <motion.div
                  className="bg-black bg-opacity-50 p-8 rounded-xl inline-block"
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <h2 className="text-3xl font-semibold mb-4">{texts[language].welcome}</h2>
                  <p className="text-lg max-w-2xl mx-auto">{texts[language].description}</p>
                </motion.div>
              </section>

              {/* Departments with Custom Icons */}
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6 max-w-6xl mx-auto">
                {Object.keys(departmentsData).map((key, i) => (
                  <Link key={i} to={`/department/${encodeURIComponent(key)}`}>
                    <motion.div
                      className="flex flex-col items-center justify-center border rounded-xl p-6 shadow hover:shadow-lg transition cursor-pointer"
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                    >
                      <div className="mb-3">
                        <img
                          src={departmentIcons[key]}
                          alt={departmentsData[key][language].title}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="text-lg font-medium text-center">
                        {departmentsData[key][language].title}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
                <div className="bg-gray-100 p-6 rounded-xl shadow dark:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-4">{texts[language].youtube}</h3>
                  <ul className="space-y-2">
                    {youtubeLinks.length === 0 ? (
                      <li className="text-gray-500">{texts[language].noLinksAvailable}</li>
                    ) : (
                      youtubeLinks.map((link, idx) => (
                        <li key={idx}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            ▶️ {link.title}
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="bg-gray-100 p-6 rounded-xl shadow dark:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-4">{texts[language].map}</h3>
                  <p className="text-gray-500">{texts[language].mapComingSoon}</p>
                </div>
              </section>
            </>
          } />

          {/* Pass handleLoginSuccess as a prop to the Login component */}
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/krishnagiri/:placeName" element={<DistrictPage language={language} />} />
          <Route path="/department/:name" element={<DepartmentPage key={language} language={language} departments={departments} />} />
          <Route path="/news" element={<NewsPage language={language} />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/discoveries" element={<DiscoveriesPage language={language} />} />
        </Routes>
      </div>
    </div>
  );
}

 
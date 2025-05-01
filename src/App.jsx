// ... all other imports remain unchanged
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Menu, X } from 'lucide-react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import DistrictPage from './DistrictPage';
import { motion } from 'framer-motion';
import { departmentsData } from './DepartmentsData';
import DepartmentPage from './DepartmentPage';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5nmsMCASycB4LXk0DoAZ_VoGDNcDvujSTgu0mfyxVtg1XGuILjZFuP4ihXOblHynK2_uwJu3xIow/pub?gid=0&single=true&output=csv';

export default function App() {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleLang = () => setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const texts = {
    en: {
      teamName: 'Krishnagiri History Research & Documentation Team',
      welcome: 'Welcome to Our Team',
      description:
        'We are committed to uncovering, preserving, and presenting the rich and diverse history of Krishnagiri and its surrounding regions. Our multidisciplinary team of passionate researchers, historians, archaeologists, and cultural documentarians work collaboratively to explore the past through various lenses—ranging from ancient monuments and inscriptions to oral traditions and modern historical events. By bridging rigorous research with public outreach, we strive to make history accessible, meaningful, and inspiring for students, educators, and the general public alike. Through digital archives, field studies, and community engagement, we aim to breathe life into forgotten stories and ensure that the legacy of our heritage continues to inform and enrich the future.',
      departments: [
        'Hero stones', 'Rock paintings', 'Inscriptions',
        'Forts', 'Cairn Circles', 'Dolmens',
        'Menhir', 'Labyrinths', 'Temples', 'Statues'
      ],
      youtube: 'Latest YouTube Links',
      map: 'Interactive Map Links',
      login: 'Login',
      signup: 'Sign Up',
      darkMode: '🌙 Dark Mode',
      lightMode: '☀️ Light Mode',
    },
    ta: {
      teamName: 'கிருஷ்ணகிரி வரலாற்று ஆய்வு மற்றும் ஆவணப்படுத்தும் குழு',
      welcome: 'எங்கள் குழுவில் வரவேற்கிறோம்',
      description:
        'வரலாற்று அறிவை ஆய்வு செய்து, பாதுகாத்து, பகிர்வதில் எங்கள் குழு அர்ப்பணிக்கப்பட்டுள்ளது...',
      departments: [
        'நடுகற்கள்', 'பாறை ஓவியங்கள்', 'கல்வெட்டுகள்', 'கோட்டைகள்',
        'கல்வட்டங்கள்', 'கற்திட்டைகள்', 'குத்துக்கல்', 'புதிர்நிலை', 'கோயில்கள்', 'சிலைகள்'
      ],
      youtube: 'சமீபத்திய YouTube இணைப்புகள்',
      map: 'இயங்குதிறன் வரைபட இணைப்புகள்',
      login: 'உள்நுழைவு',
      signup: 'பதிவு செய்யவும்',
      darkMode: '🌙 இருண்ட போக்கு',
      lightMode: '☀️ வெளிச்ச போக்கு',
    },
  };

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const links = results.data
          .filter(row => row.title && row.url)
          .slice(0, 3);
        setYoutubeLinks(links);
      },
      error: (err) => console.error("CSV Parse Error", err),
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-sans">

        {/* Header */}
        <header className="flex justify-between items-center p-6 shadow-md">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold">{texts[language].teamName}</span>
          </div>
          <div className="flex items-center space-x-4 relative">
            <button onClick={toggleLang} className="hidden md:block px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              🌐 {language === 'en' ? 'English' : 'தமிழ்'}
            </button>
            <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50">
                <div className="flex flex-col p-4 space-y-2">
                  <button onClick={toggleLang} className="md:hidden text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    🌐 {language === 'en' ? 'English' : 'தமிழ்'}
                  </button>
                  <button onClick={toggleDarkMode} className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded">
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                  <hr className="my-1 border-gray-300 dark:border-gray-600" />
                  <Link to="/login">
                    <button className="text-left text-blue-600 hover:underline px-3 py-2">{texts[language].login}</button>
                  </Link>
                  <Link to="/signup">
                    <button className="text-left bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">{texts[language].signup}</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <Routes>
          {/* Homepage */}
          <Route path="/" element={
            <>
              {/* Welcome Section with Background */}
              <section
                className="text-center py-20 px-6 bg-cover bg-center text-white"
                style={{ backgroundImage: "url('/images/bg1.jpeg')" }}
              >
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

              {/* Departments */}
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
        <div className="text-4xl mb-3">📜</div>
        <div className="text-lg font-medium text-center">
          {departmentsData[key][language].title}
        </div>
      </motion.div>
    </Link>
  ))}
</section>



              {/* YouTube and Map Links */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
                <div className="bg-gray-100 p-6 rounded-xl shadow dark:bg-gray-800">
                  <h3 className="text-xl font-semibold mb-4">{texts[language].youtube}</h3>
                  <ul className="space-y-2">
                    {youtubeLinks.length === 0 ? (
                      <li className="text-gray-500">No links available</li>
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
                </div>
              </section>
            </>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/krishnagiri/:placeName" element={<DistrictPage language={language} />} />
          <Route
            path="/department/:name"
            element={<DepartmentPage key={language} language={language} />}
          />

        </Routes>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Menu, X } from 'lucide-react'; // uses lucide icons
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5nmsMCASycB4LXk0DoAZ_VoGDNcDvujSTgu0mfyxVtg1XGuILjZFuP4ihXOblHynK2_uwJu3xIow/pub?gid=0&single=true&output=csv'; // keep this as is

export default function App() {
  
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

const toggleLang = () => {
  setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
};
const toggleDarkMode = () => {
  setDarkMode((prevMode) => !prevMode);
};
const texts = {
  en: {
    teamName: 'Krishnagiri History Research & Documentation Team',
    welcome: 'Welcome to Our Team',
    description:
      'We are dedicated to uncovering, preserving, and sharing historical knowledge. Our team consists of passionate researchers working across various domains to bring history to life for students and the public.',
    departments: [
      'Ancient History', 
      'Medieval Studies', 
      'Modern History', 
      'Archaeology', 
      'Ethnography', 
      'Digital Archives', 
      'Historical Geology', 
      'Historical Anthropology',
      'Epigraphy',
      'Numismatics'
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
      'வரலாற்று அறிவை ஆய்வு செய்து, பாதுகாத்து, பகிர்வதில் எங்கள் குழு அர்ப்பணிக்கப்பட்டுள்ளது. எங்கள் குழுவினர் பல்வேறு துறைகளில் ஆர்வமுள்ள ஆராய்ச்சியாளர்களாக உள்ளனர், மாணவர்களுக்கும் பொதுமக்களுக்கும் வரலாற்றை உயிரோட்டமாகக் கொண்டு வருவதற்காக பணி செய்கின்றனர்.',
    departments: ['நடுகற்கள்', 'பாறை ஓவியங்கள்', 'கல்வெட்டுகள்', 'கோட்டைகள்', 'கல்வட்டங்கள்', 'கற்திட்டைகள்','குத்துக்கல்','புதிர்நிலை','கோயில்கள்','சிலைகள்'],
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
        console.log("Parsed data:", results.data); // Add this
        const links = results.data
          .filter(row => row.title && row.url)
          .slice(0, 3);
        setYoutubeLinks(links);
      },
      error: (err) => console.error("CSV Parse Error", err), // Optional
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

          {/* Right side: Translate + Hamburger */}
          <div className="flex items-center space-x-4 relative">
            {/* Translate toggle (desktop only) */}
            <button
              onClick={toggleLang}
              className="hidden md:block px-3 py-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🌐 {language === 'en' ? 'English' : 'தமிழ்'}
            </button>

            {/* Hamburger button (always visible) */}
            <button
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50">
                <div className="flex flex-col p-4 space-y-2">
                  {/* Translate (mobile only) */}
                  <button
                    onClick={toggleLang}
                    className="md:hidden text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  >
                    🌐 {language === 'en' ? 'English' : 'தமிழ்'}
                  </button>

                  {/* Appearance toggle */}
                  <button
                    onClick={toggleDarkMode}
                    className="text-left hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded"
                  >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>

                  <hr className="my-1 border-gray-300 dark:border-gray-600" />

                  {/* Login/Signup */}
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

        {/* Content Sections */}
        <section className="text-center py-10 px-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{texts[language].welcome}</h2>
          <p className="text-gray-600">{texts[language].description}</p>
        </section>

        {/* Departments */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6 max-w-6xl mx-auto">
          {texts[language].departments.map((dept, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-3">📜</div>
              <div className="text-lg font-medium text-center">{dept}</div>
            </div>
          ))}
        </section>


        {/* YouTube and Map Links */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">{texts[language].youtube}</h3>
            {<ul className="space-y-2">
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
            }
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">{texts[language].map}</h3>
            {/* Add your links */}
          </div>
        </section>
      </div>
    </div>
  );
}
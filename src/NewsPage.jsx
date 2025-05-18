import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NEWS_API_URL =  'https://khrdt-site.onrender.com/api/news'|| 'http://localhost:5050/api/news';;

export default function NewsPage({ language }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('News data received:', data);
        setNews(data.data || []); // Change newsItems to data // Access newsItems from the response
      } catch (e) {
        setError(e.message);
        console.error('Error fetching news:', e); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {language === 'en' ? 'Error Loading News' : 'செய்திகளை ஏற்றுவதில் பிழை'}
        </h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {language === 'en' ? 'No News Available' : 'செய்திகள் எதுவும் இல்லை'}
        </h1>
        <p className="text-gray-500">
          {language === 'en'
            ? 'Stay tuned for the latest updates!'
            : 'சமீபத்திய புதுப்பிப்புகளுக்காக காத்திருங்கள்!'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        {language === 'en' ? 'Latest News' : 'சமீபத்திய செய்திகள்'}
      </h1>
      {news.map((newsItem, index) => (
        <motion.div
          key={index}
          className={`flex flex-col md:flex-row ${
            index % 2 === 1 ? 'md:flex-row-reverse' : ''
          } items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <div className="md:w-1/2 w-full h-64 md:h-auto">
            <img
              src={newsItem.image}
              alt={newsItem[language]?.title || 'News Image'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2 w-full">
            <h2 className="text-xl font-semibold mb-2">
              {newsItem[language]?.title || newsItem.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {newsItem[language]?.description || newsItem.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

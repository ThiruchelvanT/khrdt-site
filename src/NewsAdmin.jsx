import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';



const NewsAdmin = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingNews, setEditingNews] = useState(null); // ID of the news item being edited
  const [titleEn, setTitleEn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageEn, setImageEn] = useState('');
  const [titleTa, setTitleTa] = useState('');
  const [descriptionTa, setDescriptionTa] = useState('');
  const [imageTa, setImageTa] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  // In your fetchNews function, update the error handling:
  
  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const startTime = performance.now();
      const response = await fetch('http://localhost:5050/api/news');
      const data = await response.json();
      const endTime = performance.now();
      
      console.log(`API response time: ${(endTime - startTime).toFixed(2)}ms`);
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch news');
      
      setNewsItems(data.newsItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNews = () => {
    setIsAdding(true);
    setEditingNews(null);
    setTitleEn('');
    setDescriptionEn('');
    setImageEn('');
    setTitleTa('');
    setDescriptionTa('');
    setImageTa('');
  };

  const handleEditNews = (newsItem) => {
    setIsAdding(false);
    setEditingNews(newsItem._id || newsItem.id); // Handle both cases
    setTitleEn(newsItem.en.title);
    setDescriptionEn(newsItem.en.description);
    setImageEn(newsItem.en.image || '');
    setTitleTa(newsItem.ta.title);
    setDescriptionTa(newsItem.ta.description);
    setImageTa(newsItem.ta.image || '');
  };
  

  const handleDeleteNews = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this news item?');
    if (!confirmDelete) return;

    setLoading(true);
    setError('');
    try {
        const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/api/news/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the header
          },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNews(); // Refresh news list after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete news.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newsData = {
      en: { title: titleEn, description: descriptionEn, image: imageEn },
      ta: { title: titleTa, description: descriptionTa, image: imageTa },
    };

    const method = editingNews ? 'PUT' : 'POST';
    const url = editingNews ? `http://localhost:5050/api/news/${editingNews}` : 'http://localhost:5050/api/news';

    try {
        const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsAdding(false);
      setEditingNews(null);
      fetchNews(); // Refresh news list
    } catch (err) {
      setError(err.message || `Failed to ${editingNews ? 'update' : 'add'} news.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAddEdit = () => {
    setIsAdding(false);
    setEditingNews(null);
  };

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <motion.div
      className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">News Management</h2>

      <button onClick={handleAddNews} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
        Add New News
      </button>

      {isAdding || editingNews ? (
        <motion.div
        key={news._id || news.id}
        className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4 flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-xl font-semibold mb-4 dark:text-white">{isAdding ? 'Add New News' : 'Edit News'}</h3>
          <form onSubmit={handleSaveNews} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="titleEn">
                Title (English):
              </label>
              <input
                type="text"
                id="titleEn"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="descriptionEn">
                Description (English):
              </label>
              <textarea
                id="descriptionEn"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="imageEn">
                Image URL (English):
              </label>
              <input
                type="text"
                id="imageEn"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={imageEn}
                onChange={(e) => setImageEn(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="titleTa">
                Title (Tamil):
              </label>
              <input
                type="text"
                id="titleTa"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={titleTa}
                onChange={(e) => setTitleTa(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="descriptionTa">
                Description (Tamil):
              </label>
              <textarea
                id="descriptionTa"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={descriptionTa}
                onChange={(e) => setDescriptionTa(e.target.value)}
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="imageTa">
                Image URL (Tamil):
              </label>
              <input
                type="text"
                id="imageTa"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                value={imageTa}
                onChange={(e) => setImageTa(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancelAddEdit}
                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingNews ? 'Save Changes' : 'Add News'}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div>
          {newsItems.map((news) => (
            <motion.div
              key={news.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h4 className="text-lg font-semibold dark:text-white">{news.en.title} ({news.ta.title})</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{news.en.description.substring(0, 100)}... ({news.ta.description.substring(0, 100)}...)</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditNews(news)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNews(news.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
          {newsItems.length === 0 && <p className="dark:text-white">No news items available.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default NewsAdmin;
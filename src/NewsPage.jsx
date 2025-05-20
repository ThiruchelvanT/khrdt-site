import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, X, Save, Upload, LogOut } from 'lucide-react'; // Added LogOut icon

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://khrdt-site.onrender.com' 
  : 'http://localhost:5050';

const NEWS_API_URL = `${API_BASE_URL}/api/news`;
const UPLOAD_API_URL = `${API_BASE_URL}/api/upload`;

export default function NewsPage({ language, isAdmin = false, onUnauthorized }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newNews, setNewNews] = useState({
    en: { title: '', description: '', image: '' },
    ta: { title: '', description: '', image: '' }
  });
  const [isCreating, setIsCreating] = useState(false);
  const [token] = useState(localStorage.getItem('token'));
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      window.location.href = '/login';
    }
  };

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setNews(data.data || []);
      } catch (e) {
        setError(e.message);
        console.error('Error fetching news:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleInputChange = (e, lang, field) => {
    setNewNews(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: e.target.value
      }
    }));
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return `${API_BASE_URL}/images/bg1.jpeg`;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/images')) return `${API_BASE_URL}${imagePath}`;
    return `${API_BASE_URL}/images/${imagePath}`;
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setError('Authentication required. Please log in again.');
      setIsUploading(false);
      if (onUnauthorized) onUnauthorized();
      return;
    }

    try {
      const response = await fetch(UPLOAD_API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${currentToken}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        
        if (response.status === 403) {
          if (errorData.code === 'TOKEN_EXPIRED') {
            setError('Session expired. Please log in again.');
            if (onUnauthorized) onUnauthorized();
          } else {
            setError(`Upload forbidden: ${errorData.error || 'Invalid token'}`);
          }
        } else {
          setError(errorData.error || 'Upload failed');
        }
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      const imageUrl = `${API_BASE_URL}${result.imageUrl}`;

      setNewNews(prev => ({
        en: { ...prev.en, image: imageUrl },
        ta: { ...prev.ta, image: imageUrl }
      }));
    } catch (err) {
      console.error('Upload error:', err);
      if (!error) {
        setError(err.message || 'Upload failed');
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderImageInput = () => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {language === 'en' ? 'Image' : 'படம்'}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newNews.en.image} // Using en image as the single source
          onChange={(e) => {
            const value = e.target.value;
            setNewNews(prev => ({
              en: { ...prev.en, image: value },
              ta: { ...prev.ta, image: value }
            }));
          }}
          className="w-full p-2 border rounded dark:bg-gray-700"
          placeholder={language === 'en' ? 'Image URL' : 'பட URL'}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          disabled={isUploading}
          title={language === 'en' ? 'Upload image' : 'படத்தை பதிவேற்றவும்'}
        >
          {isUploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <Upload size={18} />
          )}
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {newNews.en.image && (
        <div className="mt-2">
          <img 
            src={newNews.en.image} 
            alt="Preview" 
            className="h-20 object-cover rounded"
            onError={(e) => {
              e.target.src = `${API_BASE_URL}/images/bg1.jpeg`;
            }}
          />
        </div>
      )}
    </div>
  );

  // Handle editing a news item
  const handleEdit = (newsItem) => {
    setEditingId(newsItem.id);
    setNewNews({
      en: {
        title: newsItem.en?.title || '',
        description: newsItem.en?.description || '',
        image: newsItem.en?.image || ''
      },
      ta: {
        title: newsItem.ta?.title || '',
        description: newsItem.ta?.description || '',
        image: newsItem.ta?.image || newsItem.en?.image || '' // Fallback to English image
      }
    });
  };

  // Save edited news item
  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`${NEWS_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          en: {
            title: newNews.en.title,
            description: newNews.en.description,
            image: newNews.en.image.replace(API_BASE_URL, '')
          },
          ta: {
            title: newNews.ta.title,
            description: newNews.ta.description,
            image: newNews.en.image.replace(API_BASE_URL, '') // Using English image for both
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update news');

      const updatedNews = await response.json();
      setNews(news.map(item => item.id === id ? {
        ...updatedNews.data,
        en: { ...updatedNews.data.en, image: `${API_BASE_URL}${updatedNews.data.en.image}` },
        ta: { ...updatedNews.data.ta, image: `${API_BASE_URL}${updatedNews.data.en.image}` } // Same image for both
      } : item));
      setEditingId(null);
    } catch (error) {
      setError(error.message);
      console.error('Error updating news:', error);
    }
  };

  // Create new news item
  const handleCreate = async () => {
    try {
      const freshToken = localStorage.getItem('token');
      if (!freshToken) throw new Error('Please login again');

      const response = await fetch(NEWS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshToken}`
        },
        body: JSON.stringify({
          en: {
            title: newNews.en.title,
            description: newNews.en.description,
            image: newNews.en.image.replace(API_BASE_URL, '')
          },
          ta: {
            title: newNews.ta.title,
            description: newNews.ta.description,
            image: newNews.en.image.replace(API_BASE_URL, '') // Same image for both
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403 && data.error?.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        throw new Error(data.message || 'Failed to create news');
      }

      const newsWithFullUrl = {
        ...data.data,
        en: { 
          ...data.data.en, 
          image: `${API_BASE_URL}${data.data.en.image}` 
        },
        ta: { 
          ...data.data.ta, 
          image: `${API_BASE_URL}${data.data.en.image}` // Same image for both
        }
      };

      setNews([newsWithFullUrl, ...news]);
      setIsCreating(false);
      setNewNews({
        en: { title: '', description: '', image: '' },
        ta: { title: '', description: '', image: '' }
      });
    } catch (error) {
      setError(error.message);
      console.error('Error creating news:', error);
    }
  };

  // Delete news item
  const handleDelete = async (id) => {
    if (!window.confirm(language === 'en' 
      ? 'Are you sure you want to delete this news item?' 
      : 'இந்த செய்தியை நீக்க விரும்புகிறீர்களா?')) {
      return;
    }

    try {
      const response = await fetch(`${NEWS_API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete news');

      setNews(news.filter(item => item.id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting news:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {language === 'en' ? 'Error Loading News' : 'செய்திகளை ஏற்றுவதில் பிழை'}
        </h1>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {language === 'en' ? 'Retry' : 'மீண்டும் முயற்சிக்கவும்'}
        </button>
      </div>
    );
  }

  // Empty state
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
        {isAdmin && (
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            {language === 'en' ? 'Add News' : 'செய்தியைச் சேர்க்கவும்'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Latest News' : 'சமீபத்திய செய்திகள்'}
        </h1>
        
        {isAdmin && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
            >
              <Plus size={18} />
              {language === 'en' ? 'Add News' : 'செய்தியைச் சேர்க்கவும்'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2 hover:bg-red-600"
              title={language === 'en' ? 'Logout' : 'வெளியேறு'}
            >
              <LogOut size={18} />
              {language === 'en' ? 'Logout' : 'வெளியேறு'}
            </button>
          </div>
        )}
      </div>

      {/* Create News Form */}
      {isCreating && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Create New News' : 'புதிய செய்தியை உருவாக்கவும்'}
            </h2>
            <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Form */}
            <div>
              <h3 className="font-medium mb-2">English</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newNews.en.title}
                    onChange={(e) => handleInputChange(e, 'en', 'title')}
                    className="w-full p-2 border rounded dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newNews.en.description}
                    onChange={(e) => handleInputChange(e, 'en', 'description')}
                    className="w-full p-2 border rounded dark:bg-gray-700"
                    rows="3"
                  />
                </div>
              </div>
            </div>
            
            {/* Tamil Form */}
            <div>
              <h3 className="font-medium mb-2">தமிழ்</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">தலைப்பு</label>
                  <input
                    type="text"
                    value={newNews.ta.title}
                    onChange={(e) => handleInputChange(e, 'ta', 'title')}
                    className="w-full p-2 border rounded dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">விளக்கம்</label>
                  <textarea
                    value={newNews.ta.description}
                    onChange={(e) => handleInputChange(e, 'ta', 'description')}
                    className="w-full p-2 border rounded dark:bg-gray-700"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Single Image Upload Section */}
          <div className="mt-6">
            {renderImageInput()}
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {language === 'en' ? 'Cancel' : 'ரத்து செய்'}
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 hover:bg-blue-600"
            >
              <Save size={18} />
              {language === 'en' ? 'Create' : 'உருவாக்கு'}
            </button>
          </div>
        </motion.div>
      )}

      {/* News List */}
      {news.map((newsItem, index) => (
        <motion.div
          key={newsItem.id}
          className={`relative flex flex-col md:flex-row ${
            index % 2 === 1 ? 'md:flex-row-reverse' : ''
          } items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              {editingId === newsItem.id ? (
                <>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                    title={language === 'en' ? 'Cancel' : 'ரத்து செய்'}
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => handleSaveEdit(newsItem.id)}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    title={language === 'en' ? 'Save' : 'சேமி'}
                  >
                    <Save size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(newsItem)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    title={language === 'en' ? 'Edit' : 'திருத்து'}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(newsItem.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title={language === 'en' ? 'Delete' : 'நீக்கு'}
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Edit Form */}
          {editingId === newsItem.id ? (
            <div className="w-full p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Edit Form */}
                <div>
                  <h3 className="font-medium mb-2">English</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <input
                        type="text"
                        value={newNews.en.title}
                        onChange={(e) => handleInputChange(e, 'en', 'title')}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newNews.en.description}
                        onChange={(e) => handleInputChange(e, 'en', 'description')}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Tamil Edit Form */}
                <div>
                  <h3 className="font-medium mb-2">தமிழ்</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">தலைப்பு</label>
                      <input
                        type="text"
                        value={newNews.ta.title}
                        onChange={(e) => handleInputChange(e, 'ta', 'title')}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">விளக்கம்</label>
                      <textarea
                        value={newNews.ta.description}
                        onChange={(e) => handleInputChange(e, 'ta', 'description')}
                        className="w-full p-2 border rounded dark:bg-gray-700"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Single Image Upload Section */}
              <div className="mt-6">
                {renderImageInput()}
              </div>
            </div>
          ) : (
            <>
              {/* News Image */}
              <div className="md:w-1/2 w-full h-64 md:h-auto">
                <img
                  src={getFullImageUrl(newsItem[language]?.image || newsItem.image)}
                  alt={newsItem[language]?.title || newsItem.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.target.src !== `${API_BASE_URL}/images/bg1.jpeg`) {
                      e.target.src = `${API_BASE_URL}/images/bg1.jpeg`;
                    } else {
                      e.target.onerror = null;
                      console.warn('Both primary and fallback images failed to load');
                    }
                  }}
                />
              </div>
              
              {/* News Content */}
              <div className="p-6 md:w-1/2 w-full">
                <h2 className="text-xl font-semibold mb-2">
                  {newsItem[language]?.title || newsItem.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {newsItem[language]?.description || newsItem.description}
                </p>
                {newsItem.createdAt && (
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(newsItem.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ta-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}
import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1EzudhKSHzJbU6lvszRfrP2EvT2weAO6nyWy848v0wHI/export?usp=sharing';
const CACHE_TTL = 5 * 60 * 1000; // 5 minute cache

export async function fetchDiscoveries(filters = {}) {
  try {
    const rawData = await new Promise((resolve, reject) => {
      Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err)
      });
    });

    // Transform and clean data
    const cleanData = rawData
      .filter(row => row.date && row.title) // Remove empty rows
      .map(row => ({
        date: row.date || 'N/A',
        title: row.title || '',
        description: row.description || '',
        state: row.state || '',
        district: row.district || '',
        taluk: row.taluk || '',
        village: row.village || '',
        youtubeLink: row.youtubeLink || '',
        blogLink: row.blogLink || '',
        // Derived field
        location: [row.village, row.taluk, row.district]
          .filter(Boolean).join(', ')
      }));

    // Apply filters
    return cleanData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase() === value.toLowerCase();
      });
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}
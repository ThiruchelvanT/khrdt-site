
 
  import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const DiscoveriesPage = ({ language }) => {
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    taluk: '',
    village: ''
  });

  // Sheet URLs for different languages
  const SHEET_URLS = {
    en: 'https://docs.google.com/spreadsheets/d/1EzudhKSHzJbU6lvszRfrP2EvT2weAO6nyWy848v0wHI/export?format=csv',
    ta: 'https://docs.google.com/spreadsheets/d/1DZdfbIfJgArV4CO4bm8AphMB6Vy5HICoJpYRYFnDOJo/export?format=csv'
  }

  // Get unique values for filter dropdowns
  const getFilterOptions = (data) => {
    const options = {
      states: [],
      districts: [],
      taluks: [],
      villages: []
    };

    data.forEach(item => {
      if (item.state && !options.states.includes(item.state)) options.states.push(item.state);
      if (item.district && !options.districts.includes(item.district)) options.districts.push(item.district);
      if (item.taluk && !options.taluks.includes(item.taluk)) options.taluks.push(item.taluk);
      if (item.village && !options.villages.includes(item.village)) options.villages.push(item.village);
    });

    return options;
  };

  const [filterOptions, setFilterOptions] = useState({
    states: [],
    districts: [],
    taluks: [],
    villages: []
  });

  // Column headers for different languages
  const columnHeaders = {
    en: {
      taluk: 'Taluk',
      village: 'Village',
      findings: 'Findings',
      description: 'Description',
      location: 'Location',
      youtube: 'YouTube',
      blogspot: 'Blogspot',
      noData: 'No discoveries found matching your filters'
    },
    ta: {
      taluk: 'தாலுகா',
      village: 'கிராமம்',
      findings: 'கண்டுபிடிப்புகள்',
      description: 'விளக்கம்',
      location: 'இடம்',
      youtube: 'யூடியூப்',
      blogspot: 'வலைப்பதிவு',
      noData: 'உங்கள் வடிகட்டலுடன் பொருந்தக்கூடிய கண்டுபிடிப்புகள் எதுவும் இல்லை'
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sheetUrl = SHEET_URLS[language];
        
        Papa.parse(sheetUrl, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const cleanData = results.data
              .filter(row => row.title) // Only rows with title
              .map(row => ({
                // Common fields (should exist in both sheets)
                taluk: row.taluk || 'N/A',
                village: row.village || 'N/A',
                title: row.title || '',
                description: row.description || '',
                state: row.state || '',
                district: row.district || '',
                youtubeLink: row.youtubeLink || '',
                blogLink: row.blogLink || '',
                locationLink: row.locationLink || '',
                latitude: row.latitude || '',
                longitude: row.longitude || '',
                // Language-specific fields can be added here
                ...(language === 'ta' && {
                  // Tamil-specific fields if needed
                })
              }));
            
            setDiscoveries(cleanData);
            setFilterOptions(getFilterOptions(cleanData));
            setLoading(false);
          },
          error: (err) => {
            console.error("CSV Parse Error", err);
            setError("Failed to load discoveries data");
            setLoading(false);
          }
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    loadData();
  }, [language]); // Reload when language changes

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderLocationCell = (discovery) => {
    if (discovery.locationLink) {
      return (
        <a 
          href={discovery.locationLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {language === 'en' ? 'View on Map' : 'வரைபடத்தில் காண்க'}
        </a>
      );
    } else if (discovery.latitude && discovery.longitude) {
      const mapsUrl = `https://www.google.com/maps?q=${discovery.latitude},${discovery.longitude}`;
      return (
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {language === 'en' ? 'View Coordinates' : 'ஆள்கூறுகளைக் காட்டு'}
        </a>
      );
    }
    return 'N/A';
  };

  const filteredDiscoveries = discoveries.filter(item => {
    return (
      (!filters.state || item.state === filters.state) &&
      (!filters.district || item.district === filters.district) &&
      (!filters.taluk || item.taluk === filters.taluk) &&
      (!filters.village || item.village === filters.village)
    );
  });

  if (loading) return <div className="text-center py-10">{language === 'en' ? 'Loading discoveries...' : 'கண்டுபிடிப்புகள் ஏற்றப்படுகின்றன...'}</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{language === 'en' ? 'Discoveries' : 'கண்டுபிடிப்புகள்'}</h1>
      
      {/* Filters Section */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{language === 'en' ? 'State' : 'மாநிலம்'}</label>
          <select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">{language === 'en' ? 'All States' : 'அனைத்து மாநிலங்கள்'}</option>
            {filterOptions.states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{language === 'en' ? 'District' : 'மாவட்டம்'}</label>
          <select
            name="district"
            value={filters.district}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">{language === 'en' ? 'All Districts' : 'அனைத்து மாவட்டங்கள்'}</option>
            {filterOptions.districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{language === 'en' ? 'Taluk' : 'தாலுகா'}</label>
          <select
            name="taluk"
            value={filters.taluk}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">{language === 'en' ? 'All Taluks' : 'அனைத்து தாலுகாக்கள்'}</option>
            {filterOptions.taluks.map(taluk => (
              <option key={taluk} value={taluk}>{taluk}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{language === 'en' ? 'Village' : 'கிராமம்'}</label>
          <select
            name="village"
            value={filters.village}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded dark:bg-gray-700"
          >
            <option value="">{language === 'en' ? 'All Villages' : 'அனைத்து கிராமங்கள்'}</option>
            {filterOptions.villages.map(village => (
              <option key={village} value={village}>{village}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Discoveries Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">{columnHeaders[language].taluk}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].village}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].findings}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].description}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].location}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].youtube}</th>
              <th className="py-3 px-4 text-left">{columnHeaders[language].blogspot}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredDiscoveries.length > 0 ? (
              filteredDiscoveries.map((discovery, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">{discovery.taluk}</td>
                  <td className="py-3 px-4">{discovery.village}</td>
                  <td className="py-3 px-4 font-medium">{discovery.title}</td>
                  <td className="py-3 px-4">{discovery.description}</td>
                  <td className="py-3 px-4">
                    {renderLocationCell(discovery)}
                  </td>
                  <td className="py-3 px-4">
                    {discovery.youtubeLink ? (
                      <a 
                        href={discovery.youtubeLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        {language === 'en' ? 'YouTube' : 'யூடியூப்'}
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    {discovery.blogLink ? (
                      <a 
                        href={discovery.blogLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        {language === 'en' ? 'View more' : 'மேலும் காண்க'}
                      </a>
                    ) : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  {columnHeaders[language].noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscoveriesPage ;
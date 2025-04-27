import React from 'react';
import { useParams } from 'react-router-dom';

const placeData = {
  'ancient-fort': {
    en: {
      title: 'Ancient Fort',
      description: 'This fort was built in the 16th century and has witnessed many historical battles.',
    },
    ta: {
      title: 'பழமையான கோட்டை',
      description: 'இந்த கோட்டை 16ஆம் நூற்றாண்டில் கட்டப்பட்டு பல வரலாற்றுப் போர்களுக்கு சாட்சி நின்றது.',
    },
    image: '/images/ancient-fort.jpg',
  },
  'old-temple': {
    en: {
      title: 'Old Temple',
      description: 'A beautiful temple dating back to the Chola dynasty period.',
    },
    ta: {
      title: 'பழைய கோவில்',
      description: 'இது சோழர் காலத்தை சேர்ந்த அழகான கோவில்.',
    },
    image: '/images/old-temple.jpg',
  },
  // Add more places here
};

export default function DistrictPage({ language = 'en' }) {
  const { placeName } = useParams();
  const place = placeData[placeName];

  if (!place) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">{language === 'en' ? 'Place Not Found' : 'இடம் கிடைக்கவில்லை'}</h1>
        <p className="mt-4 text-gray-600">
          {language === 'en'
            ? "We couldn't find any information about this place."
            : 'இந்த இடம் பற்றிய தகவல் கிடைக்கவில்லை.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{place[language].title}</h1>
      <p className="mb-6 text-gray-700">{place[language].description}</p>
      {place.image && (
        <img src={place.image} alt={place[language].title} className="rounded-xl shadow-lg mx-auto" />
      )}
    </div>
  );
}

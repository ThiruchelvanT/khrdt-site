import React from 'react';
import { useParams } from 'react-router-dom';

const placeData = {
  'ancient-fort': {
    en: {
      title: 'Ancient Fort',
      description: 'This fort was built in the 16th century and has witnessed many historical battles.',
      link: 'https://en.wikipedia.org/wiki/Example_Ancient_Fort',
    },
    ta: {
      title: 'பழமையான கோட்டை',
      description: 'இந்த கோட்டை 16ஆம் நூற்றாண்டில் கட்டப்பட்டு பல வரலாற்றுப் போர்களுக்கு சாட்சி நின்றது.',
      link: 'https://en.wikipedia.org/wiki/Example_Ancient_Fort',
    },
    image: '/images/ancient-fort.jpg',
  },
  'old-temple': {
    en: {
      title: 'Old Temple',
      description: 'A beautiful temple dating back to the Chola dynasty period.',
      link: 'https://en.wikipedia.org/wiki/Example_Old_Temple',
    },
    ta: {
      title: 'பழைய கோவில்',
      description: 'இது சோழர் காலத்தை சேர்ந்த அழகான கோவில்.',
      link: 'https://en.wikipedia.org/wiki/Example_Old_Temple',
    },
    image: '/images/old-temple.jpg',
  },
  'chennanur': {
    en: {
      title: 'Chennanur',
      description: 'Excavation site',
      link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_27.html',
    },
    ta: {
      title: 'பழைய கோவில்',
      description: 'அகழ்வாய்வு தளம்',
      link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_27.html',
    },
    
  },
  'chinnakothur-1': {
  en: {
    title: 'Chinnakothur',
    description: 'Shiva temple',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post.html',
  },
  ta: {
    title: 'சின்ன கொத்தூர்',
    description: 'சிவன்கோவில் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post.html',
  }
},
'nakkanayanapanda': {
  en: {
    title: "Nakkanayanapanda",
description: "Tamil Nadu's largest rock carving & rock painting",
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_5.html',
  },
  ta: {
    title: 'நக்கநாயனபண்டா ',
    description: 'தமிழகத்தின்மிகப்பெரிய பாறைக்கீரல் & பாறை ஓவியம் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_5.html',
  }
},
'mallasandiram': {
  en: {
    title: 'Mallasandiram',
    description: 'Megalithic blocks',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_3.html',
  },
  ta: {
    title: 'மல்லசந்திரம்',
    description: 'பெருங்கற்காலகற்திட்டைகள்',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_3.html',
  }
},
'mallikarjuna_durgam': {
  en: {
    title: 'Mallikarjuna Durgam',
    description: 'Sculpture',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_92.html',
  },
  ta: {
    title: 'மல்லிகார்சுன தூர்கம்',
    description: 'சிற்பக்கலை',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_92.html',
  }
},
'berigai': {
  en: {
    title: 'Berigai',
    description: 'Sculpture - Beautiful Goddess',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_81.html',
  },
  ta: {
    title: 'பேரிகை',
    description: 'சிற்ப்பக்கலை - அழகிய அம்மன்',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_81.html',
  }
},
'madagondapalli': {
  en: {
    title: 'Madagondapalli',
    description: 'Vijayanagara architecture',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_71.html',
  },
  ta: {
    title: 'மதகொண்டப்பள்ளி',
    description: 'விஜயநகர கட்டிடக்கலை ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_71.html',
  }
},
'periyakottapalli': {
  en: {
    title: 'Periyakottapalli',
    description: 'Rock painting symbols',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_0.html',
  },
  ta: {
    title: 'பெரியகோட்டப்பள்ளி',
    description: 'பாறை ஓவிய குறியீடுகள்',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_0.html',
  }
},
'mayiladumparai': {
  en: {
    title: 'Mayiladumparai',
    description: 'Rock paintings',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_83.html',
  },
  ta: {
    title: 'மயிலாடும்பாறை ',
    description: 'பாறை ஓவியங்கள் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_83.html',
  }
},
'krishnagiri': {
  en: {
    title: 'Krishnagiri - Someshwar Temple',
    description: 'Someshwar Temple Inscriptions',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_84.html',
  },
  ta: {
    title: 'கிருஷ்ணகிரி - சோமேஷ்வர் கோவில்',
    description: 'சோமேஷ்வர் கோவில் கல்வெட்டுகள் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_84.html',
  }
},
'bethathalapalli': {
  en: {
    title: 'Bethathalapalli',
    description: 'Rock paintings',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_31.html',
  },
  ta: {
    title: 'பெத்ததாளாப்பள்ளி ',
    description: 'பாறை ஓவியங்கள் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_31.html',
  }
},
'aandimalai': {
  en: {
    title: 'Aandimalai',
    description: 'Rock painting symbols',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_58.html',
  },
  ta: {
    title: 'ஆண்டிமலை ',
    description: 'பாறை ஓவியங்கள்  குறியீடுகள் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_58.html',
  }
},
'kundhukottai': {
  en: {
    title: 'Kundhukottai',
    description: 'Adhiyaman inscription',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_55.html',
  },
  ta: {
    title: 'குந்துக்கோட்டை',
    description: 'அதியமான்  கல்வெட்டு ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_55.html',
  }
},
'thogarapalli': {
  en: {
    title: 'Thogarapalli',
    description: 'Tombstone of those who died fighting against Adiyaman when he led his army to Thokarapalli - Thokarapalli',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_44.html',
  },
  ta: {
    title: 'தொகரப்பள்ளி',
    description: 'அதியமான் தொகரப்பள்ளிக்கு படை எடுத்து வந்த போது எதிர்த்து போரிட்டு உயிரிழந்தவர்களின் நடுகல் தொகுதி -தொகரப்பள்ளி',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_44.html',
  }
},
'ganganapalli-1': {
  en: {
    title: 'Konnganapalli',
    description: "Tamil Nadu's largest black sandalwood painting collection - Konkanapalli Veppanapalli Union",
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_99.html',
  },
  ta: {
    title: 'கொங்கணப்பள்ளி',
    description: 'தமிழகத்தின் பெரிய கருஞ்சாந்து ஓவியத் தொகுதி - கொங்கணப்பள்ளி வேப்பனப்பள்ளி ஒன்றியம்',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_99.html',
  }
},
'ganganapalli-2': {
  en: {
    title: 'Konnganapalli',
    description: 'Thumbu inscription of Chola king Rajathirajan, 1050 AD',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/1050.html',
  },
  ta: {
    title: 'கொங்கணப்பள்ளி',
    description: 'சோழ மன்னன் ராஜாதிராஜனின் கிபி.1050 தூம்பு கல்வெட்டு',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/1050.html',
  }
},
'penneswaramadam': {
  en: {
    title: 'Penneswaramadam',
    description: 'Kulontunga Chola III',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_93.html',
  },
  ta: {
    title: 'பெண்ணேஸ்வரமடம்',
    description: 'மூன்றாம் குலோந்துங்கச்சோழன் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_93.html',
  }
},
'kelamangalam': {
  en: {
    title: 'Kelamangalam',
    description: 'Nadugal Block (Back of the school)',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_51.html',
  },
  ta: {
    title: 'கெலமங்கலம் ',
    description: 'நடுகல் தொகுதி (பள்ளியின் பின் பக்கம் )',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_51.html',
  }
},
'chinnakothur-2': {
  en: {
    title: 'Chinnakothur',
    description: 'Stone blocks 127',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_51.html',
  },
  ta: {
    title: 'சின்னகொத்தூர்',
    description: 'கற்திட்டைகள் 127',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_51.html',
  }
},
'samanthamalai': {
  en: {
    title: 'Samanthamalai',
    description: 'Sting stone',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_14.html',
  },
  ta: {
    title: 'சாமந்தமலை ',
    description: 'குத்துககல் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/04/blog-post_14.html',
  }
},
'kathujuganapalli': {
  en: {
    title: 'Kathujuganapalli',
    description: 'stone',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_38.html',
  },
  ta: {
    title: 'ஜோடிப்பாறை',
    description: 'காட்சிப்பொருள்',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_38.html',
  }
},
'nedusalai': {
  en: {
    title: 'Nedusalai',
    description: 'temple',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_14.html',
  },
  ta: {
    title: 'நெடுசாலை ',
    description: 'பிற்கால சோழர்கால சிவன்கோவில் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_14.html',
  }
},
'jagadab': {
  en: {
    title: 'Jagadab',
    description: 'inscription',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_18.html',
  },
  ta: {
    title: 'ஜெகதாப்',
    description: 'பௌத்தப்பள்ளி கல்வெட்டு',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_18.html',
  }
},
'mallapadi': {
  en: {
    title: 'Rock Painting',
    description: 'Rock Painting',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_58.html',
  },
  ta: {
    title: 'மல்லப்பாடி',
    description: 'பாறைஓவியம் , கோவில் கல்வெட்டுகள் ',
    link: 'https://khrdthistoryofkrishnagiri.blogspot.com/2025/05/blog-post_58.html',
  }
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

  const placeInfo = place[language];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{placeInfo.title}</h1>
      <p className="mb-6 text-gray-700">{placeInfo.description}</p>

      {/* 🛠 Corrected Link Section */}
      {placeInfo.link && (
        <div className="mb-6">
          <a
            href={placeInfo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {language === 'en' ? `Learn more about ${placeInfo.title}` : `${placeInfo.title} பற்றி மேலும் அறிக`}
          </a>
        </div>
      )}

      {place.image && (
        <img src={place.image} alt={placeInfo.title} className="rounded-xl shadow-lg mx-auto" />
      )}
    </div>
  );
}

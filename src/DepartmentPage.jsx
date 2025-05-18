// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { departmentsData } from './DepartmentsData';

// const DepartmentPage = ({ language }) => {
//   const { name } = useParams();

//   // Always use English key from URL
//   const department = departmentsData[name];

//   if (!department) {
//     return (
//       <div className="text-center p-10 text-red-600 text-xl">
//         Department not found
//       </div>
//     );
//   }

//   const { title, description } = department[language];

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">{title}</h1>
//       <p className="text-lg leading-relaxed">{description}</p>
//     </div>
//   );
// };

// export default DepartmentPage;



// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { departmentsData } from './DepartmentsData';
// import { motion } from 'framer-motion';

// export default function DepartmentPage({ language }) {
//   const { name } = useParams();
//   const department = departmentsData[decodeURIComponent(name)];

//   // Placeholder images for each card (5 total)
//   const images = [
//     '/images/bg1.jpeg',
//     '/images/dept2.jpg',
//     '/images/dept3.jpg',
//     '/images/dept4.jpg',
//     '/images/dept5.jpg',
//   ];

//   if (!department) {
//     return <div className="p-10 text-center text-xl">Department not found.</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-12">
//       <h1 className="text-3xl font-bold text-center mb-10">
//         {department[language].title}
//       </h1>

//       {department[language].cards.map((card, index) => (
//   <motion.div
//     key={index}
//     className={`flex flex-col md:flex-row ${
//       index % 2 === 1 ? 'md:flex-row-reverse' : ''
//     } items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
//     initial={{ opacity: 0, y: 50 }}
//     whileInView={{ opacity: 1, y: 0 }}
//     viewport={{ once: true }}
//     transition={{ duration: 0.6, delay: index * 0.2 }}
//   >
//     {/* Image */}
//     <div className="md:w-1/2 w-full h-64 md:h-auto">
//       <img
//         src={card.image}
//         alt={card.title}
//         className="w-full h-full object-cover"
//       />
//     </div>

//     {/* Text */}
//     <div className="p-6 md:w-1/2 w-full">
//       <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
//       <p className="text-gray-700 dark:text-gray-300">{card.description}</p>
//     </div>
//   </motion.div>
// ))}

//     </div>
//   );
// }



// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { departmentsData } from './DepartmentsData';
// import { motion } from 'framer-motion';

// export default function DepartmentPage({ language }) {
//   const { name } = useParams();
//   const department = departmentsData[decodeURIComponent(name)];

//   // Scroll to top on page load
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [name]);

//   if (!department) {
//     return <div className="p-10 text-center text-xl">Department not found.</div>;
//   }

//   const { title, description, images } = department[language];

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-12">
//       <h1 className="text-3xl font-bold text-center mb-10">{title}</h1>

//       {images.slice(0, 5).map((imgSrc, index) => (
//         <motion.div
//           key={index}
//           className={`flex flex-col md:flex-row ${
//             index % 2 === 1 ? 'md:flex-row-reverse' : ''
//           } items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6, delay: index * 0.2 }}
//         >
//           {/* Image */}
//           <div className="md:w-1/2 w-full h-64 md:h-auto">
//             <img
//               src={imgSrc}
//               alt={`${title} Image ${index + 1}`}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Text */}
//           <div className="p-6 md:w-1/2 w-full">
//             <h2 className="text-xl font-semibold mb-2">
//               {title} #{index + 1}
//             </h2>
//             <p className="text-gray-700 dark:text-gray-300">{description}</p>
//           </div>
//         </motion.div>
//       ))}
//     </div>
//   );
// }


import React from 'react';
import { useParams } from 'react-router-dom';
import { departmentsData } from './DepartmentsData'; // Ensure this path is correct
import { motion } from 'framer-motion';

export default function DepartmentPage({ language }) {
  const { name } = useParams();
  const department = departmentsData[decodeURIComponent(name)];

  // Placeholder images for each card (5 total)
  // Images are fetched from the data, so you may choose to have images dynamically in your `departmentsData.js`
  
  if (!department) {
    return <div className="p-10 text-center text-xl">Department not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        {department[language].title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-center mb-8">
                {department[language].summary}
            </p>

      {/* Render the cards */}
      {department[language].cards.map((card, index) => (
        <motion.div
          key={index}
          className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          {/* Image */}
          <div className="md:w-1/2 w-full h-64 md:h-auto">
            <img
              src={card.image}  // Image URL comes from the data
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="p-6 md:w-1/2 w-full">
            <h2 className="text-xl font-semibold mb-2">
              {card.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {card.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

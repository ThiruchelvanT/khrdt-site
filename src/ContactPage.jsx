import React from 'react';

const contactCards = [
  {
    title: 'General Inquiry',
    email: 'info@khrdt.in',
    phone: '123-456-7890',
    image: '/images/Contacts/Narayana_moorthy.jpeg',
  },
  {
    title: 'Research Team',
    email: 'research@khrdt.in',
    phone: '123-456-7891',
    image: '/images/Contacts/Tamil.jpeg',
  },
  {
    title: 'Documentation',
    email: 'docs@khrdt.in',
    phone: '123-456-7892',
    image: '/images/Contacts/Govindraj.jpeg',
  },
  {
    title: 'Media Inquiries',
    email: 'media@khrdt.in',
    phone: '123-456-7893',
    image: '/images/contacts/xxx.png',
  },
  {
    title: 'Volunteer',
    email: 'volunteer@khrdt.in',
    phone: '123-456-7894',
    image: '/images/contacts/volunteer.png',
  },
  {
    title: 'Website Feedback',
    email: 'web@khrdt.in',
    phone: '123-456-7895',
    image: '/images/contacts/web.png',
  },
  {
    title: 'Event Support',
    email: 'events@khrdt.in',
    phone: '123-456-7896',
    image: '/images/contacts/events.png',
  },
  {
    title: 'History Submissions',
    email: 'submit@khrdt.in',
    phone: '123-456-7897',
    image: '/images/contacts/submissions.png',
  },
  {
    title: 'Archive Access',
    email: 'archive@khrdt.in',
    phone: '123-456-7898',
    image: '/images/contacts/archive.png',
  },
  {
    title: 'Other Queries',
    email: 'help@khrdt.in',
    phone: '123-456-7899',
    image: '/images/contacts/other.png',
  },
];

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactCards.map((card, idx) => (
          <div
          key={idx}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition-transform transform hover:scale-105 h-80 flex flex-col items-center justify-start"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-36 h-36 object-cover rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">{card.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">📧 {card.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">📞 {card.phone}</p>
        </div>
        
        ))}
      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ language = 'en' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const texts = {
    en: {
      title: 'Login',
      email: 'Email address',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      signup: 'Sign Up',
    },
    ta: {
      title: 'உள்நுழைவு',
      email: 'மின்னஞ்சல் முகவரி',
      password: 'கடவுச்சொல்',
      login: 'உள்நுழை',
      noAccount: 'கணக்கு இல்லையா?',
      signup: 'பதிவு செய்யவும்',
    },
  };

  const t = texts[language];

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add validation or API call here
    alert(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">{t.title}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">{t.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 dark:text-gray-300">{t.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {t.login}
          </button>
        </form>
        <p className="mt-4 text-sm text-center dark:text-gray-300">
          {t.noAccount}{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">{t.signup}</Link>
        </p>
      </div>
    </div>
  );
}

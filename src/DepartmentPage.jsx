import React from 'react';
import { useParams } from 'react-router-dom';
import { departmentsData } from './DepartmentsData';

const DepartmentPage = ({ language }) => {
  const { name } = useParams();

  // Always use English key from URL
  const department = departmentsData[name];

  if (!department) {
    return (
      <div className="text-center p-10 text-red-600 text-xl">
        Department not found
      </div>
    );
  }

  const { title, description } = department[language];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg leading-relaxed">{description}</p>
    </div>
  );
};

export default DepartmentPage;

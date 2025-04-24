'use client'
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="pb-12">
      <h5 className="text-2xl font-medium text-gray-900">
        {title}
      </h5>
      <div className="border-b border-gray-200 my-4"></div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Section; 
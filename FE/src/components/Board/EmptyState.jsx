import React from 'react';

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        {Icon && <Icon size={28} className="text-gray-300" />}
      </div>

      <h3 className="text-gray-900 font-medium text-sm mb-1">
        {title}
      </h3>

      <p className="text-gray-400 text-xs max-w-[200px] leading-relaxed mx-auto">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
import React from 'react';

const GlassTable: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-full align-middle inline-block">
        <div className="overflow-hidden rounded-xl">
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-2">
            <div className="shadow-sm rounded-lg overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .glass-row:hover { background: linear-gradient(90deg, rgba(242,103,34,0.06), rgba(255,143,87,0.03)); transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default GlassTable;

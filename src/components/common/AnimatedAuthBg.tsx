import React from 'react';

const AnimatedAuthBg: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />

      {/* decorative blobs */}
      <div
        className="absolute -left-20 -top-20 w-72 h-72 rounded-full opacity-60 blur-3xl animate-blob-1"
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(242,103,34,0.25), transparent 40%)' }}
      />
      <div
        className="absolute -right-20 -bottom-24 w-80 h-80 rounded-full opacity-50 blur-3xl animate-blob-2"
        style={{ background: 'radial-gradient(circle at 80% 80%, rgba(34,211,238,0.18), transparent 40%)' }}
      />

      {/* subtle floating shapes */}
      <div
        className="absolute left-1/2 top-24 w-96 h-40 -translate-x-1/2 opacity-40 blur-xl animate-floating"
        style={{ background: 'linear-gradient(90deg, rgba(255,143,87,0.06), rgba(242,103,34,0.06))' }}
      />

      <style jsx global>{`
        @keyframes blob1 { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.05); } 100% { transform: translateY(0) scale(1); } }
        @keyframes blob2 { 0% { transform: translateY(0) scale(1); } 50% { transform: translateY(10px) scale(0.98); } 100% { transform: translateY(0) scale(1); } }
        @keyframes floating { 0% { transform: translateY(0); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0); } }
        .animate-blob-1 { animation: blob1 8s ease-in-out infinite; }
        .animate-blob-2 { animation: blob2 10s ease-in-out infinite; }
        .animate-floating { animation: floating 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AnimatedAuthBg;

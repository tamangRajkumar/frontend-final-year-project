import React from 'react';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';

const SocialButtons: React.FC<{onSocial?: (type: string) => void}> = ({ onSocial }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => onSocial && onSocial('google')}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition text-gray-800"
      >
        <FaGoogle className="h-5 w-5 text-red-500" />
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => onSocial && onSocial('linkedin')}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition text-gray-800"
      >
        <FaLinkedin className="h-5 w-5 text-blue-600" />
        Continue with LinkedIn
      </button>
    </div>
  );
};

export default SocialButtons;

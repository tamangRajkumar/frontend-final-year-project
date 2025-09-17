import React from 'react';

interface ProfileAvatarProps {
  user: {
    _id: string;
    fname: string;
    lname: string;
    userProfileImage?: {
      url: string;
      public_id?: string;
    };
    businessInfo?: {
      businessName?: string;
    };
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  user,
  size = 'md',
  showOnlineStatus = false,
  isOnline = false,
  className = '',
  onClick
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { container: 'w-6 h-6', text: 'text-xs', online: 'w-2 h-2' },
    sm: { container: 'w-8 h-8', text: 'text-xs', online: 'w-3 h-3' },
    md: { container: 'w-10 h-10', text: 'text-sm', online: 'w-3 h-3' },
    lg: { container: 'w-12 h-12', text: 'text-base', online: 'w-4 h-4' },
    xl: { container: 'w-16 h-16', text: 'text-lg', online: 'w-5 h-5' }
  };

  const config = sizeConfig[size];

  // Generate initials from name
  const getInitials = () => {
    if (user.businessInfo?.businessName) {
      // For business users, use business name initials
      const businessName = user.businessInfo.businessName;
      const words = businessName.trim().split(' ');
      if (words.length >= 2) {
        return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
      }
      return businessName.charAt(0).toUpperCase();
    } else {
      // For regular users, use first and last name initials
      const fname = user.fname || '';
      const lname = user.lname || '';
      return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase();
    }
  };

  // Get display name
  const getDisplayName = () => {
    return user.businessInfo?.businessName || `${user.fname} ${user.lname}`;
  };

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <div className={`${config.container} bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ${
        onClick ? 'cursor-pointer hover:bg-gray-300 transition-colors' : ''
      }`}>
        {user.userProfileImage?.url ? (
          <img
            src={user.userProfileImage.url}
            alt={getDisplayName()}
            className={`${config.container} rounded-full object-cover`}
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('span');
                fallback.className = `${config.text} text-gray-600 font-semibold`;
                fallback.textContent = getInitials();
                parent.appendChild(fallback);
              }
            }}
          />
        ) : (
          <span className={`${config.text} text-gray-600 font-semibold`}>
            {getInitials()}
          </span>
        )}
      </div>
      
      {/* Online status indicator */}
      {showOnlineStatus && isOnline && (
        <div className={`absolute -bottom-1 -right-1 ${config.online} bg-green-500 border-2 border-white rounded-full`}></div>
      )}
    </div>
  );
};

export default ProfileAvatar;

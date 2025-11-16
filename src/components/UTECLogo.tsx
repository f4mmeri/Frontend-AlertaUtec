interface UTECLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UTEC_LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTytuCcHyj3Gx8IPuUc8yjlsJwy_apHsEfag&s';

export default function UTECLogo({ className = '', size = 'md' }: UTECLogoProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <img
        src={UTEC_LOGO_URL}
        alt="UTEC Logo"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}


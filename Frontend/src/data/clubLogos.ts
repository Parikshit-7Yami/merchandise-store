// Pre-made club logo data for different club types
// These are SVG data URIs that can be used directly as image sources

export interface ClubLogoOption {
  id: string;
  name: string;
  category: 'cultural' | 'technical' | 'sports' | 'literary' | 'music' | 'photography' | 'social' | 'general';
  svg: string;
}

// Generate SVG data URIs for each club type
const createSvgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

export const clubLogos: ClubLogoOption[] = [
  // Cultural Club Logos
  {
    id: 'cultural-1',
    name: 'Cultural Arts',
    category: 'cultural',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="#8B1538" opacity="0.1"/>
      <path d="M50 15 L58 35 L80 35 L62 48 L70 70 L50 55 L30 70 L38 48 L20 35 L42 35 Z" fill="#8B1538"/>
      <circle cx="50" cy="50" r="12" fill="#1a237e"/>
      <path d="M35 75 Q50 85 65 75" stroke="#8B1538" stroke-width="3" fill="none"/>
    </svg>`)
  },
  {
    id: 'cultural-2',
    name: 'Dance Club',
    category: 'cultural',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="25" r="10" fill="#8B1538"/>
      <path d="M50 35 L50 55 M35 45 L65 45 M50 55 L35 80 M50 55 L65 80" stroke="#1a237e" stroke-width="4" stroke-linecap="round"/>
      <path d="M30 85 Q50 75 70 85" stroke="#8B1538" stroke-width="2" fill="none"/>
      <circle cx="50" cy="50" r="40" stroke="#8B1538" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
    </svg>`)
  },
  
  // Technical Club Logos
  {
    id: 'tech-1',
    name: 'Coding Club',
    category: 'technical',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="15" y="25" width="70" height="50" rx="5" fill="#1a237e" opacity="0.1" stroke="#1a237e" stroke-width="2"/>
      <path d="M30 45 L20 50 L30 55" stroke="#8B1538" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 45 L80 50 L70 55" stroke="#8B1538" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M55 35 L45 65" stroke="#1a237e" stroke-width="3" stroke-linecap="round"/>
      <rect x="35" y="78" width="30" height="5" rx="2" fill="#1a237e"/>
    </svg>`)
  },
  {
    id: 'tech-2',
    name: 'Robotics Club',
    category: 'technical',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="30" y="35" width="40" height="35" rx="5" fill="#1a237e"/>
      <circle cx="40" cy="48" r="5" fill="#fff"/>
      <circle cx="60" cy="48" r="5" fill="#fff"/>
      <rect x="42" y="58" width="16" height="5" rx="2" fill="#8B1538"/>
      <rect x="45" y="20" width="10" height="15" fill="#1a237e"/>
      <circle cx="50" cy="18" r="5" fill="#8B1538"/>
      <rect x="20" y="45" width="10" height="5" rx="2" fill="#1a237e"/>
      <rect x="70" y="45" width="10" height="5" rx="2" fill="#1a237e"/>
      <rect x="35" y="70" width="8" height="15" rx="2" fill="#1a237e"/>
      <rect x="57" y="70" width="8" height="15" rx="2" fill="#1a237e"/>
    </svg>`)
  },
  {
    id: 'tech-3',
    name: 'IEEE Branch',
    category: 'technical',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" fill="#1a237e" opacity="0.1" stroke="#1a237e" stroke-width="3"/>
      <path d="M30 50 L45 50 L50 35 L55 65 L60 50 L70 50" stroke="#8B1538" stroke-width="3" fill="none"/>
      <circle cx="50" cy="50" r="25" stroke="#1a237e" stroke-width="2" fill="none"/>
      <text x="50" y="85" text-anchor="middle" fill="#1a237e" font-size="10" font-weight="bold">IEEE</text>
    </svg>`)
  },
  
  // Sports Club Logos
  {
    id: 'sports-1',
    name: 'Sports Club',
    category: 'sports',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="35" fill="#8B1538" opacity="0.1"/>
      <circle cx="50" cy="50" r="25" fill="#1a237e"/>
      <path d="M35 50 L65 50 M50 35 L50 65 M38 38 L62 62 M62 38 L38 62" stroke="#fff" stroke-width="2"/>
      <circle cx="50" cy="50" r="8" fill="#8B1538"/>
    </svg>`)
  },
  {
    id: 'sports-2',
    name: 'Cricket Club',
    category: 'sports',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="55" rx="15" ry="25" fill="#8B1538"/>
      <rect x="46" y="20" width="8" height="15" fill="#1a237e"/>
      <line x1="30" y1="85" x2="70" y2="85" stroke="#1a237e" stroke-width="3"/>
      <line x1="35" y1="85" x2="35" y2="70" stroke="#1a237e" stroke-width="2"/>
      <line x1="50" y1="85" x2="50" y2="70" stroke="#1a237e" stroke-width="2"/>
      <line x1="65" y1="85" x2="65" y2="70" stroke="#1a237e" stroke-width="2"/>
    </svg>`)
  },
  {
    id: 'sports-3',
    name: 'Basketball Club',
    category: 'sports',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="35" fill="#f97316"/>
      <path d="M15 50 L85 50" stroke="#1a237e" stroke-width="2"/>
      <path d="M50 15 L50 85" stroke="#1a237e" stroke-width="2"/>
      <path d="M30 20 Q15 50 30 80" stroke="#1a237e" stroke-width="2" fill="none"/>
      <path d="M70 20 Q85 50 70 80" stroke="#1a237e" stroke-width="2" fill="none"/>
    </svg>`)
  },
  
  // Literary Club Logos
  {
    id: 'literary-1',
    name: 'Literary Club',
    category: 'literary',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="25" y="20" width="50" height="60" rx="3" fill="#1a237e" opacity="0.1" stroke="#1a237e" stroke-width="2"/>
      <path d="M30 20 L30 80 Q50 70 50 80 L50 20 Q50 30 30 20" fill="#8B1538"/>
      <path d="M70 20 L70 80 Q50 70 50 80 L50 20 Q50 30 70 20" fill="#1a237e"/>
      <line x1="35" y1="35" x2="45" y2="35" stroke="#fff" stroke-width="1"/>
      <line x1="35" y1="45" x2="45" y2="45" stroke="#fff" stroke-width="1"/>
      <line x1="55" y1="35" x2="65" y2="35" stroke="#fff" stroke-width="1"/>
      <line x1="55" y1="45" x2="65" y2="45" stroke="#fff" stroke-width="1"/>
    </svg>`)
  },
  {
    id: 'literary-2',
    name: 'Debate Club',
    category: 'literary',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <ellipse cx="30" cy="40" rx="20" ry="15" fill="#1a237e"/>
      <ellipse cx="70" cy="40" rx="20" ry="15" fill="#8B1538"/>
      <path d="M25 55 L20 70 L35 55" fill="#1a237e"/>
      <path d="M75 55 L80 70 L65 55" fill="#8B1538"/>
      <text x="30" y="44" text-anchor="middle" fill="#fff" font-size="12">VS</text>
      <path d="M40 75 L60 75" stroke="#1a237e" stroke-width="3"/>
      <path d="M35 82 L65 82" stroke="#8B1538" stroke-width="2"/>
    </svg>`)
  },
  
  // Music Club Logos
  {
    id: 'music-1',
    name: 'Music Club',
    category: 'music',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <ellipse cx="35" cy="70" rx="12" ry="8" fill="#1a237e"/>
      <ellipse cx="65" cy="60" rx="12" ry="8" fill="#8B1538"/>
      <path d="M47 70 L47 25 L77 15 L77 60" stroke="#1a237e" stroke-width="3" fill="none"/>
      <path d="M47 25 L77 15" stroke="#8B1538" stroke-width="4"/>
      <circle cx="50" cy="25" r="3" fill="#8B1538"/>
      <circle cx="55" cy="22" r="3" fill="#8B1538"/>
    </svg>`)
  },
  {
    id: 'music-2',
    name: 'Band Club',
    category: 'music',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="35" fill="#8B1538" opacity="0.1"/>
      <path d="M30 40 L30 70 M40 35 L40 75 M50 30 L50 80 M60 35 L60 75 M70 40 L70 70" stroke="#1a237e" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="35" stroke="#8B1538" stroke-width="3" fill="none"/>
    </svg>`)
  },
  
  // Photography Club Logos
  {
    id: 'photo-1',
    name: 'Photography Club',
    category: 'photography',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="30" width="60" height="45" rx="5" fill="#1a237e"/>
      <rect x="35" y="20" width="30" height="12" rx="3" fill="#1a237e"/>
      <circle cx="50" cy="52" r="15" fill="#8B1538"/>
      <circle cx="50" cy="52" r="10" fill="#1a237e"/>
      <circle cx="50" cy="52" r="5" fill="#fff"/>
      <circle cx="70" cy="38" r="4" fill="#8B1538"/>
    </svg>`)
  },
  {
    id: 'photo-2',
    name: 'Film Club',
    category: 'photography',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="25" y="25" width="50" height="50" rx="5" fill="#1a237e"/>
      <rect x="30" y="30" width="40" height="40" fill="#8B1538" opacity="0.3"/>
      <polygon points="45,40 45,60 60,50" fill="#fff"/>
      <circle cx="25" cy="25" r="8" fill="#1a237e" stroke="#8B1538" stroke-width="2"/>
      <circle cx="75" cy="25" r="8" fill="#1a237e" stroke="#8B1538" stroke-width="2"/>
      <circle cx="25" cy="75" r="8" fill="#1a237e" stroke="#8B1538" stroke-width="2"/>
      <circle cx="75" cy="75" r="8" fill="#1a237e" stroke="#8B1538" stroke-width="2"/>
    </svg>`)
  },
  
  // Social/NSS Club Logos
  {
    id: 'social-1',
    name: 'NSS',
    category: 'social',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="40" fill="#1a237e" opacity="0.1" stroke="#1a237e" stroke-width="3"/>
      <circle cx="50" cy="35" r="10" fill="#8B1538"/>
      <path d="M30 75 Q50 55 70 75" fill="#1a237e"/>
      <circle cx="35" cy="55" r="6" fill="#8B1538"/>
      <circle cx="65" cy="55" r="6" fill="#8B1538"/>
      <text x="50" y="92" text-anchor="middle" fill="#1a237e" font-size="8" font-weight="bold">NSS</text>
    </svg>`)
  },
  {
    id: 'social-2',
    name: 'Volunteer Club',
    category: 'social',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <path d="M50 80 L25 50 Q20 35 35 30 Q45 28 50 40 Q55 28 65 30 Q80 35 75 50 Z" fill="#8B1538"/>
      <circle cx="50" cy="25" r="8" fill="#1a237e"/>
      <path d="M42 25 L58 25 M50 17 L50 33" stroke="#fff" stroke-width="2"/>
    </svg>`)
  },
  
  // General Club Logos
  {
    id: 'general-1',
    name: 'General Club',
    category: 'general',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <polygon points="50,15 61,40 88,40 67,55 76,82 50,67 24,82 33,55 12,40 39,40" fill="#1a237e"/>
      <circle cx="50" cy="50" r="15" fill="#8B1538"/>
      <text x="50" y="55" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">★</text>
    </svg>`)
  },
  {
    id: 'general-2',
    name: 'Innovation Hub',
    category: 'general',
    svg: createSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="40" r="25" fill="#1a237e" opacity="0.2"/>
      <path d="M50 15 L50 25 M35 20 L40 28 M65 20 L60 28" stroke="#8B1538" stroke-width="2"/>
      <circle cx="50" cy="40" r="18" fill="#1a237e"/>
      <path d="M42 40 L48 46 L58 34" stroke="#fff" stroke-width="3" fill="none"/>
      <rect x="42" y="60" width="16" height="25" rx="3" fill="#8B1538"/>
      <rect x="45" y="85" width="10" height="5" fill="#1a237e"/>
    </svg>`)
  }
];

export const clubCategories = [
  { value: 'cultural', label: 'Cultural', color: '#8B1538' },
  { value: 'technical', label: 'Technical', color: '#1a237e' },
  { value: 'sports', label: 'Sports', color: '#f97316' },
  { value: 'literary', label: 'Literary', color: '#7c3aed' },
  { value: 'music', label: 'Music', color: '#ec4899' },
  { value: 'photography', label: 'Photography', color: '#06b6d4' },
  { value: 'social', label: 'Social Service', color: '#10b981' },
  { value: 'general', label: 'General', color: '#6b7280' }
];

export const getLogosByCategory = (category: string): ClubLogoOption[] => {
  return clubLogos.filter(logo => logo.category === category);
};

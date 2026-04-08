import { useState } from 'react';
import { cn } from '@/lib/utils';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import medicapsLogo from '@/assets/medicaps-logo.png';

interface GarmentPreviewProps {
  productType: 'tshirt' | 'sweatshirt' | 'athletic' | 'sleeveless';
  color: string;
  clubName: string;
  clubLogo?: string | null;
  customDesign?: string | null;
  gender: 'boys' | 'girls' | 'unisex' | 'teachers';
}

type ViewAngle = 'front' | 'back' | 'left' | 'right';

const GarmentPreview = ({
  productType,
  color,
  clubName,
  clubLogo,
  customDesign,
  gender
}: GarmentPreviewProps) => {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front');
  const [isRotating, setIsRotating] = useState(false);

  const angles: ViewAngle[] = ['front', 'left', 'back', 'right'];

  const rotateLeft = () => {
    setIsRotating(true);
    const currentIndex = angles.indexOf(viewAngle);
    const newIndex = (currentIndex - 1 + angles.length) % angles.length;
    setTimeout(() => {
      setViewAngle(angles[newIndex]);
      setIsRotating(false);
    }, 150);
  };

  const rotateRight = () => {
    setIsRotating(true);
    const currentIndex = angles.indexOf(viewAngle);
    const newIndex = (currentIndex + 1) % angles.length;
    setTimeout(() => {
      setViewAngle(angles[newIndex]);
      setIsRotating(false);
    }, 150);
  };

  const autoRotate = () => {
    let count = 0;
    const interval = setInterval(() => {
      rotateRight();
      count++;
      if (count >= 4) clearInterval(interval);
    }, 500);
  };

  // Determine contrast color for text
  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#1a237e' : '#ffffff';
  };

  const textColor = getContrastColor(color);

  // SVG paths for different garment types
  const renderGarment = () => {
    const isFront = viewAngle === 'front';
    const isBack = viewAngle === 'back';
    const isSide = viewAngle === 'left' || viewAngle === 'right';
    const isLeftSide = viewAngle === 'left';

    // Common garment styles based on gender
    const shoulderWidth = gender === 'girls' ? 140 : 160;
    const waistWidth = gender === 'girls' ? 120 : 150;
    const neckDepth = gender === 'girls' ? 25 : 15;

    switch (productType) {
      case 'tshirt':
        return (
          <svg viewBox="0 0 300 350" className="w-full h-full">
            {/* Shadow for 3D effect */}
            <ellipse cx="150" cy="340" rx="80" ry="10" fill="rgba(0,0,0,0.1)" />
            
            {isFront || isBack ? (
              <>
                {/* T-Shirt body */}
                <path
                  d={`
                    M${150 - shoulderWidth/2} 60
                    L${150 - shoulderWidth/2 - 40} 80
                    L${150 - shoulderWidth/2 - 40} 130
                    L${150 - waistWidth/2 - 20} 130
                    L${150 - waistWidth/2 - 10} 300
                    L${150 + waistWidth/2 + 10} 300
                    L${150 + waistWidth/2 + 20} 130
                    L${150 + shoulderWidth/2 + 40} 130
                    L${150 + shoulderWidth/2 + 40} 80
                    L${150 + shoulderWidth/2} 60
                    Q150 ${60 + neckDepth} ${150 - shoulderWidth/2} 60
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Collar */}
                <path
                  d={`M${150 - 25} 60 Q150 ${60 + neckDepth + 10} ${150 + 25} 60`}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="3"
                />
                {/* Sleeve seams */}
                <line x1={150 - shoulderWidth/2 - 20} y1="80" x2={150 - waistWidth/2 - 20} y2="130" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
                <line x1={150 + shoulderWidth/2 + 20} y1="80" x2={150 + waistWidth/2 + 20} y2="130" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              </>
            ) : (
              <>
                {/* Side view */}
                <path
                  d={`
                    M120 60
                    L100 80
                    L100 130
                    L110 130
                    L115 300
                    L185 300
                    L190 130
                    L200 130
                    L200 80
                    L180 60
                    Q150 70 120 60
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Side seam */}
                <line x1="150" y1="60" x2="150" y2="300" stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="5,5" />
              </>
            )}
          </svg>
        );

      case 'sweatshirt':
        return (
          <svg viewBox="0 0 300 350" className="w-full h-full">
            <ellipse cx="150" cy="340" rx="80" ry="10" fill="rgba(0,0,0,0.1)" />
            
            {isFront || isBack ? (
              <>
                {/* Sweatshirt body */}
                <path
                  d={`
                    M${150 - shoulderWidth/2} 50
                    L${150 - shoulderWidth/2 - 50} 80
                    L${150 - shoulderWidth/2 - 50} 160
                    L${150 - waistWidth/2 - 25} 165
                    L${150 - waistWidth/2 - 15} 290
                    L${150 + waistWidth/2 + 15} 290
                    L${150 + waistWidth/2 + 25} 165
                    L${150 + shoulderWidth/2 + 50} 160
                    L${150 + shoulderWidth/2 + 50} 80
                    L${150 + shoulderWidth/2} 50
                    Q150 ${55 + neckDepth} ${150 - shoulderWidth/2} 50
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Hood outline */}
                <path
                  d={`M${150 - 30} 50 Q${150 - 40} 25 150 20 Q${150 + 40} 25 ${150 + 30} 50`}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Kangaroo pocket */}
                {isFront && (
                  <path
                    d={`M100 200 Q100 220 120 220 L180 220 Q200 220 200 200 L200 240 Q200 260 180 260 L120 260 Q100 260 100 240 Z`}
                    fill="rgba(0,0,0,0.08)"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="1"
                  />
                )}
                {/* Cuffs */}
                <rect x={150 - shoulderWidth/2 - 50} y="155" width="30" height="8" fill="rgba(0,0,0,0.1)" rx="2" />
                <rect x={150 + shoulderWidth/2 + 20} y="155" width="30" height="8" fill="rgba(0,0,0,0.1)" rx="2" />
                <rect x={150 - waistWidth/2 - 15} y="285" width={waistWidth + 30} height="8" fill="rgba(0,0,0,0.1)" rx="2" />
              </>
            ) : (
              <>
                <path
                  d={`
                    M110 50
                    L80 80
                    L80 160
                    L95 165
                    L100 290
                    L200 290
                    L205 165
                    L220 160
                    L220 80
                    L190 50
                    Q150 60 110 50
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                <path
                  d={`M${isLeftSide ? 110 : 190} 50 Q150 20 ${isLeftSide ? 190 : 110} 50`}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        );

      case 'sleeveless':
        return (
          <svg viewBox="0 0 300 350" className="w-full h-full">
            <ellipse cx="150" cy="340" rx="80" ry="10" fill="rgba(0,0,0,0.1)" />
            
            {isFront || isBack ? (
              <>
                <path
                  d={`
                    M${150 - shoulderWidth/2 + 10} 55
                    L${150 - shoulderWidth/2 + 10} 70
                    Q${150 - shoulderWidth/2 - 10} 100 ${150 - waistWidth/2 - 10} 130
                    L${150 - waistWidth/2} 300
                    L${150 + waistWidth/2} 300
                    L${150 + waistWidth/2 + 10} 130
                    Q${150 + shoulderWidth/2 + 10} 100 ${150 + shoulderWidth/2 - 10} 70
                    L${150 + shoulderWidth/2 - 10} 55
                    Q150 ${55 + neckDepth + 5} ${150 - shoulderWidth/2 + 10} 55
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Arm holes */}
                <path
                  d={`M${150 - shoulderWidth/2 + 10} 70 Q${150 - shoulderWidth/2 - 5} 95 ${150 - waistWidth/2 - 10} 130`}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="2"
                />
                <path
                  d={`M${150 + shoulderWidth/2 - 10} 70 Q${150 + shoulderWidth/2 + 5} 95 ${150 + waistWidth/2 + 10} 130`}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="2"
                />
              </>
            ) : (
              <>
                <path
                  d={`
                    M130 55
                    L130 70
                    Q115 100 115 130
                    L118 300
                    L182 300
                    L185 130
                    Q185 100 170 70
                    L170 55
                    Q150 65 130 55
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        );

      case 'athletic':
        return (
          <svg viewBox="0 0 300 350" className="w-full h-full">
            <ellipse cx="150" cy="340" rx="80" ry="10" fill="rgba(0,0,0,0.1)" />
            
            {isFront || isBack ? (
              <>
                <path
                  d={`
                    M${150 - shoulderWidth/2} 55
                    L${150 - shoulderWidth/2 - 35} 75
                    L${150 - shoulderWidth/2 - 35} 120
                    L${150 - waistWidth/2 - 15} 125
                    L${150 - waistWidth/2 - 5} 300
                    L${150 + waistWidth/2 + 5} 300
                    L${150 + waistWidth/2 + 15} 125
                    L${150 + shoulderWidth/2 + 35} 120
                    L${150 + shoulderWidth/2 + 35} 75
                    L${150 + shoulderWidth/2} 55
                    Q150 ${55 + neckDepth} ${150 - shoulderWidth/2} 55
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
                {/* Athletic stripes */}
                <line x1={150 - shoulderWidth/2 - 25} y1="75" x2={150 - waistWidth/2 - 5} y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                <line x1={150 + shoulderWidth/2 + 25} y1="75" x2={150 + waistWidth/2 + 5} y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                {/* Mesh texture pattern */}
                <pattern id="mesh" patternUnits="userSpaceOnUse" width="10" height="10">
                  <circle cx="5" cy="5" r="1" fill="rgba(0,0,0,0.05)" />
                </pattern>
                <rect x="80" y="55" width="140" height="250" fill="url(#mesh)" />
              </>
            ) : (
              <>
                <path
                  d={`
                    M120 55
                    L100 75
                    L100 120
                    L110 125
                    L115 300
                    L185 300
                    L190 125
                    L200 120
                    L200 75
                    L180 55
                    Q150 65 120 55
                    Z
                  `}
                  fill={color}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Preview container with clean background */}
      <div className="bg-gradient-to-b from-muted/30 to-muted/50 rounded-xl p-6 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* View angle indicator */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
          {viewAngle} View
        </div>

        {/* Garment container */}
        <div 
          className={cn(
            "relative w-full aspect-[3/4] max-w-[280px] mx-auto transition-all duration-300",
            isRotating && "scale-95 opacity-80"
          )}
          style={{ transform: `perspective(1000px) rotateY(${isRotating ? (viewAngle === 'left' ? -15 : 15) : 0}deg)` }}
        >
          {/* Render garment SVG */}
          {renderGarment()}

          {/* Overlay content (logo, text) - only on front view */}
          {(viewAngle === 'front') && (
            <div className="absolute inset-0 flex flex-col items-center justify-start pt-[25%] pointer-events-none">
              {/* College Logo */}
              <div className="bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <img src={medicapsLogo} alt="Medicaps" className="h-8 w-auto" />
              </div>
              
              {/* College Name */}
              <p 
                className="text-[10px] font-medium mt-1 px-2 py-0.5 rounded bg-card/90"
                style={{ color: '#1a237e' }}
              >
                Medicaps University
              </p>

              {/* Club Name */}
              {clubName && (
                <p 
                  className="font-bold text-sm mt-2 px-3 py-1 rounded-full shadow-md"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: '#1a237e'
                  }}
                >
                  {clubName}
                </p>
              )}

              {/* Club Logo */}
              {clubLogo && (
                <div className="mt-3 bg-card/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <img 
                    src={clubLogo} 
                    alt="Club Logo" 
                    className="h-12 w-12 object-contain"
                  />
                </div>
              )}

              {/* Custom Design */}
              {customDesign && (
                <div className="mt-2 bg-card/95 backdrop-blur-sm rounded-lg p-1 shadow-lg">
                  <img 
                    src={customDesign} 
                    alt="Custom Design" 
                    className="h-10 w-auto object-contain max-w-[80px]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Back view content */}
          {viewAngle === 'back' && clubName && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p 
                className="font-bold text-lg px-4 py-2 rounded-lg shadow-md"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#1a237e'
                }}
              >
                {clubName}
              </p>
            </div>
          )}
        </div>

        {/* Rotation controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={rotateLeft}
            className="h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={autoRotate}
            className="gap-2 bg-card/90 backdrop-blur-sm"
          >
            <RotateCw className="h-4 w-4" />
            360° View
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={rotateRight}
            className="h-10 w-10 rounded-full bg-card/90 backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Angle dots */}
        <div className="flex justify-center gap-2 mt-3">
          {angles.map((angle) => (
            <button
              key={angle}
              onClick={() => setViewAngle(angle)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                viewAngle === angle 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`View ${angle}`}
            />
          ))}
        </div>
      </div>

      {/* Gender/Type indicator */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-muted-foreground capitalize">
        {gender} • {productType.replace('_', ' ')}
      </div>
    </div>
  );
};

export default GarmentPreview;

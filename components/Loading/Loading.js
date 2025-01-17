import React from 'react';

const Loading = () => {
  return (
    <div className="bg-white min-h-dvh w-full">
      <div className="flex flex-col justify-center items-center min-h-dvh gap-4">
        {/* Coin with bounce animation */}
        <div className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-20 h-20">
            <defs>
              <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:"#7BA4E8"}}/>
                <stop offset="45%" style={{stopColor:"#4169E1"}}/>
                <stop offset="55%" style={{stopColor:"#4169E1"}}/>
                <stop offset="100%" style={{stopColor:"#2850AA"}}/>
              </linearGradient>
              
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:"#2850AA"}}/>
                <stop offset="50%" style={{stopColor:"#4169E1"}}/>
                <stop offset="100%" style={{stopColor:"#2850AA"}}/>
              </linearGradient>

              <filter id="rimLight">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                <feOffset dx="1" dy="1" result="offsetblur"/>
                <feFlood floodColor="#1E40AF"/>
                <feComposite in2="offsetblur" operator="in"/>
                <feComposite in="SourceGraphic"/>
              </filter>
            </defs>

            <circle cx="100" cy="100" r="98" fill="url(#edgeGradient)" stroke="#2850AA" strokeWidth="3"/>
            <circle cx="100" cy="100" r="90" fill="url(#coinGradient)"/>
            <circle cx="100" cy="100" r="85" fill="none" stroke="#2850AA" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="82" fill="none" stroke="#2850AA" strokeWidth="0.5"/>
            
            <text x="100" y="125" 
                  fontFamily="Arial Black, Arial, sans-serif" 
                  fontSize="80" 
                  fontWeight="bold"
                  textAnchor="middle" 
                  fill="#FFFFFF"
                  style={{filter: "drop-shadow(1px 1px 1px #2850AA)"}}>
              BH
            </text>

            <path d="M 30,100 A 70,70 0 0,1 170,100" 
                  fill="none" 
                  stroke="#7BA4E8" 
                  strokeWidth="0.5"
                  opacity="0.3"/>

            <circle cx="100" cy="100" r="90" 
                    fill="url(#coinGradient)" 
                    opacity="0.1" 
                    filter="url(#rimLight)"/>
          </svg>
        </div>
        
        {/* Loading text */}
        <span className="text-gray-600 text-lg font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading


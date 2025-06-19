// A simple, static SVG background to add visual flair without extra libraries.
export function AuthBackground() {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        <svg
          className="absolute left-[max(50%,25rem)] top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(96, 165, 250, 0.3)" }} /> 
              <stop offset="100%" style={{ stopColor: "rgba(29, 78, 216, 0.1)" }} />
            </linearGradient>
          </defs>
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#grad1)"
            fillOpacity="0.7"
          />
        </svg>
      </div>
    );
  }
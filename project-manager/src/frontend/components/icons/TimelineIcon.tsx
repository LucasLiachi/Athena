import React from 'react';

// Ícone simples de timeline (linha horizontal com marcadores)
export const TimelineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M3 12h6M15 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="9" cy="12" r="2" fill="currentColor" />
    <circle cx="15" cy="12" r="2" fill="currentColor" />
  </svg>
);

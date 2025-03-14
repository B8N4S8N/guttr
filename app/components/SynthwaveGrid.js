'use client';

export default function SynthwaveGrid() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
      <div className="retro-grid-animated opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--secondary-rgb),0.05)_0%,transparent_100%)]" />
      <div className="scan-line opacity-10" />
    </div>
  );
} 
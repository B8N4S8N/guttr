'use client';

export default function FeatureCard({ icon, title, description, isActive, delay }) {
  return (
    <div
      className={`p-8 rounded-xl border backdrop-blur-sm transition-all duration-500 group hover:scale-105 ${
        isActive 
          ? 'scale-105 border-primary/50 shadow-xl bg-background/30' 
          : 'border-border/50 bg-background/20 hover:border-primary/30'
      } animate-reveal opacity-0`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
    </div>
  );
} 
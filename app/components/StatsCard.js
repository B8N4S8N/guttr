export default function StatsCard({ value, label, description, glowClass, delay }) {
  return (
    <div 
      className="p-8 rounded-xl border border-border/50 backdrop-blur-sm bg-background/20 text-center animate-reveal opacity-0 hover:scale-105 transition-all duration-300 group" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`text-5xl font-black ${glowClass} mb-4 group-hover:scale-110 transition-transform duration-300`}>{value}</div>
      <div className="text-xl font-bold mb-2">{label}</div>
      {description && (
        <div className="text-muted-foreground text-sm">{description}</div>
      )}
    </div>
  );
} 
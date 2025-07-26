// Enhanced modern glass "flower" with improved center (SSR-compatible)
const OUTER_PETALS = 10;
const INNER_PETALS = 10;
const OUTER_COLORS = [
  'var(--color-primary-300, #93c5fd)',
  'var(--color-secondary-300, #fbcfe8)',
  'var(--color-primary-200, #a5b4fc)',
  'var(--color-secondary-200, #f9a8d4)'
];
const INNER_COLORS = [
  'var(--color-primary-100, #dbeafe)',
  'var(--color-secondary-100, #fdf2f8)',
  'var(--color-primary-400, #60a5fa)',
  'var(--color-secondary-400, #f472b6)'
];

const HeroBackgroundArt = () => {
  return (
    <div className="hero-flower-bg pointer-events-none" aria-hidden="true">
      {/* Glow background */}
      <div className="hero-flower-glow" />
      {/* Outer petals */}
      {Array.from({ length: OUTER_PETALS }).map((_, i) => (
        <div
          key={`outer-${i}`}
          className="hero-flower-petal hero-flower-petal-outer"
          style={{
            '--petal-rotate': `${i * (360 / OUTER_PETALS)}deg`,
            '--petal-color': OUTER_COLORS[i % OUTER_COLORS.length],
            '--petal-anim-delay': `${i * 0.12}s`
          } as React.CSSProperties}
        />
      ))}
      {/* Inner petals */}
      {Array.from({ length: INNER_PETALS }).map((_, i) => (
        <div
          key={`inner-${i}`}
          className="hero-flower-petal hero-flower-petal-inner"
          style={{
            '--petal-rotate': `${i * (360 / INNER_PETALS) + 22.5}deg`,
            '--petal-color': INNER_COLORS[i % INNER_COLORS.length],
            '--petal-anim-delay': `${i * 0.10 + 0.3}s`
          } as React.CSSProperties}
        />
      ))}
      {/* Glassy center with enhancements */}
      <div className="hero-flower-center">
        <div className="hero-flower-center-glow" />
        <div className="hero-flower-center-inner-shadow" />
        <div className="hero-flower-center-shine" />
        <div className="hero-flower-highlight" />
      </div>
    </div>
  );
};

export default HeroBackgroundArt; 
import Image from "next/image";

export function HeroVisual() {
  return (
    <figure className="hero-visual" aria-labelledby="hero-visual-caption">
      <Image
        src="/images/hero/digilearn-learner-v2.webp"
        alt="Editorial visualization of an East African learner testing a responsive web project on a laptop and phone"
        fill
        priority
        sizes="(max-width: 900px) 100vw, 52vw"
      />
      <div className="hero-visual-shade" aria-hidden="true" />
      <figcaption id="hero-visual-caption" className="hero-proof-card">
        <span className="hero-proof-icon" aria-hidden="true">✓</span>
        <span><strong>Project-based learning</strong><small>Build work you can explain and demonstrate</small></span>
      </figcaption>
      <div className="hero-skill-card" aria-label="Learning activity">
        <span>Current project</span>
        <strong>Responsive portfolio</strong>
        <small>HTML · CSS · Accessibility</small>
      </div>
      <small className="hero-image-disclosure">Original DigiLearn editorial visualization</small>
    </figure>
  );
}

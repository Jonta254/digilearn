import Image from "next/image";
import { COURSE_IMAGE_ATTRIBUTIONS } from "@/lib/image-attributions";

export function HeroVisual() {
  const photo = COURSE_IMAGE_ATTRIBUTIONS.find(image => image.id === "collaborative-learning-pexels-5940713")!;
  return (
    <figure className="hero-visual" aria-labelledby="hero-visual-caption">
      <Image
        src={photo.file}
        alt={photo.alt}
        fill
        priority
        sizes="(max-width: 900px) 100vw, 52vw"
      />
      <div className="hero-visual-shade" aria-hidden="true" />
      <figcaption id="hero-visual-caption" className="hero-proof-card">
        <span className="hero-proof-icon" aria-hidden="true">✓</span>
        <span><strong>Project-based learning</strong><small>Build work you can explain and demonstrate</small></span>
      </figcaption>
      <small className="hero-image-disclosure">Photo: <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.creator} / {photo.source}</a></small>
    </figure>
  );
}

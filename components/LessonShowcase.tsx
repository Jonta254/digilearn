import Image from "next/image";
import type { LessonShowcase as Showcase } from "@/lib/lesson-showcases";

export function LessonShowcase({ showcase }: { showcase: Showcase }) {
  return (
    <figure className="lesson-showcase">
      <div>
        <Image
          src={showcase.src}
          alt={showcase.alt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 760px"
        />
      </div>
      <figcaption>
        {showcase.caption}
        <small>
          Original DigiLearn editorial visualization; interface details are
          illustrative.
        </small>
      </figcaption>
    </figure>
  );
}

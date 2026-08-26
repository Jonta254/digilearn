import Image from "next/image";
import type { Course } from "@/app/courses/courses";
import { coverAssetFor } from "@/lib/course-assets";

export function CourseCover({ course, priority = false }: { course: Course; priority?: boolean }) {
  const asset = coverAssetFor(course);
  return (
    <figure className="course-cover" data-asset-id={asset.assetId} data-priority={priority ? "true" : undefined}>
      <Image src={asset.src} alt={asset.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 420px" priority={priority} />
      <figcaption className="sr-only">{asset.caption}</figcaption>
    </figure>
  );
}

import type { MetadataRoute } from "next";
import { COURSES } from "./courses/courses";
import { SITE_URL } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/courses", "/dashboard", "/practice", "/pricing", "/auth"];
  return [
    ...routes.map((route) => ({ url: new URL(route || "/", SITE_URL).toString(), changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.7 })),
    ...COURSES.flatMap((course) => [
      { url: new URL(`/courses/${course.id}`, SITE_URL).toString(), changeFrequency: "monthly" as const, priority: 0.8 },
      { url: new URL(`/courses/${course.id}/guide`, SITE_URL).toString(), changeFrequency: "monthly" as const, priority: 0.5 },
    ]),
  ];
}

export type ImageAttribution = {
  id: string;
  file: string;
  creator: string;
  source: "Pexels";
  sourceUrl: string;
  license: "Pexels License";
  licenseUrl: string;
  reviewedAt: string;
  modified: string;
  alt: string;
};

export const COURSE_IMAGE_ATTRIBUTIONS: readonly ImageAttribution[] = [
  {
    id: "business-planning-pexels-10376212",
    file: "/images/courses/business-planning.webp",
    creator: "RDNE Stock project",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/man-using-laptop-sitting-in-office-10376212/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/legal-pages/license/",
    reviewedAt: "2026-08-26",
    modified: "Focal-point crop to 8:5, resized to 1600 × 1000, metadata stripped, converted to WebP",
    alt: "Professional working on a laptop beside a handwritten project plan in a bright office",
  },
  {
    id: "finance-workspace-pexels-6694492",
    file: "/images/courses/finance-workspace.webp",
    creator: "Tima Miroshnichenko",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/an-accountant-s-workspace-6694492/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/legal-pages/license/",
    reviewedAt: "2026-08-26",
    modified: "Focal-point crop to 8:5, resized to 1600 × 1000, metadata stripped, converted to WebP",
    alt: "Accountant reviewing financial reports with a calculator and laptop on a wooden desk",
  },
  {
    id: "collaborative-learning-pexels-5940713",
    file: "/images/courses/collaborative-learning.webp",
    creator: "Kampus Production",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/attentive-young-black-groupmates-using-laptop-while-preparing-for-exams-with-anonymous-teacher-5940713/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/legal-pages/license/",
    reviewedAt: "2026-08-26",
    modified: "Focal-point crop to 8:5, resized to 1600 × 1000, metadata stripped, converted to WebP",
    alt: "Two adult learners reviewing work together on a laptop with guidance from a tutor",
  },
  {
    id: "health-data-review-pexels-3881422",
    file: "/images/courses/health-data-review.webp",
    creator: "Andrea Piacquadio",
    source: "Pexels",
    sourceUrl: "https://www.pexels.com/photo/young-female-doctor-working-with-computer-in-modern-clinic-3881422/",
    license: "Pexels License",
    licenseUrl: "https://www.pexels.com/legal-pages/license/",
    reviewedAt: "2026-08-26",
    modified: "Focal-point crop to 8:5, resized to 1600 × 1000, metadata stripped, converted to WebP",
    alt: "Healthcare professional using a computer at a desk in a modern clinic",
  },
] as const;

export function imageAttribution(id: string) {
  return COURSE_IMAGE_ATTRIBUTIONS.find((image) => image.id === id);
}
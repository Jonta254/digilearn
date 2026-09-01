import type { Course } from "@/app/courses/courses";

export type EditorialStatus = "structured-draft" | "reviewed" | "review-expired";
export type CourseReview = {
  status: EditorialStatus;
  version: string;
  reviewedBy?: string;
  reviewedAt?: string;
  nextReviewAt?: string;
};

// A course may be marked reviewed only with a named reviewer and dated review window.
// Until course-by-course SME review records exist, every manuscript remains an honest draft.
export function reviewFor(course: Course): CourseReview {
  void course;
  return { status: "structured-draft", version: "0.9" };
}

export function reviewLabel(review: CourseReview) {
  if (review.status === "reviewed") return `SME reviewed ${review.reviewedAt}`;
  if (review.status === "review-expired") return "Editorial review expired";
  return "Structured learning draft";
}

export function isValidReview(review: CourseReview, now = new Date()) {
  return review.status === "reviewed" && Boolean(review.reviewedBy && review.reviewedAt && review.nextReviewAt) && Date.parse(review.nextReviewAt ?? "") >= now.getTime();
}

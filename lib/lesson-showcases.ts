export type LessonShowcase = { src:string; alt:string; caption:string };
const moduleMedia = {
  foundations:{src:"/images/lessons/html-css/html-foundations-v1.webp",alt:"Editorial visualization of a learner comparing a hand-drawn page structure with code on a laptop",caption:"Planning content structure before implementation makes the document hierarchy easier to review."},
  forms:{src:"/images/lessons/html-css/accessible-forms-v1.webp",alt:"Editorial visualization of a developer keyboard-testing a simple contact form",caption:"Keyboard testing reveals interaction and focus problems that a visual inspection can miss."},
  responsive:{src:"/images/lessons/html-css/responsive-layout-v1.webp",alt:"Editorial visualization of the same web layout adapting across tablet, laptop and phone",caption:"Responsive behavior must be checked across changing space, zoom and content."},
  release:{src:"/images/lessons/html-css/release-review-v1.webp",alt:"Editorial visualization of two developers reviewing a website and detailed quality checklist",caption:"A professional release combines measured evidence, peer review and recorded limitations."},
} satisfies Record<string,LessonShowcase>;
const mediaByLesson:Record<string,LessonShowcase>={
  "html-css-document":moduleMedia.foundations,"html-css-semantics":moduleMedia.foundations,"html-css-content":moduleMedia.foundations,
  "html-css-forms":moduleMedia.forms,"html-css-cascade":moduleMedia.forms,"html-css-box-model":moduleMedia.forms,
  "html-css-flexbox":moduleMedia.responsive,"html-css-grid":moduleMedia.responsive,"html-css-responsive":moduleMedia.responsive,
  "html-css-accessibility":moduleMedia.release,"html-css-performance":moduleMedia.release,"html-css-publish":moduleMedia.release,
};
export function showcaseForLesson(lessonId:string){return mediaByLesson[lessonId];}

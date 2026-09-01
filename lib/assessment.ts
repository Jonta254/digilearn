import type { Course } from "@/app/courses/courses";
import type { CourseCurriculum, Lesson } from "./learning-types";
export type Question = { id:string; question:string; type:"single"|"multiple"|"true-false"; options:string[]; correctAnswer:number[]; explanation:string; objective:string; difficulty:"foundational"|"applied"|"challenge" };
export type CourseAssessment = { id:string; courseId:string; title:string; passingScore:number; estimatedMinutes:number; questions:Question[] };
export type Answers = Record<string,number[]>;
function seedFor(value:string){return [...value].reduce((total,character)=>total+character.charCodeAt(0),0);}
function reorder(options:string[],correct:number[],seed:number){const offset=seed%options.length;const indexed=options.map((option,index)=>({option,index}));const rotated=[...indexed.slice(offset),...indexed.slice(0,offset)];return{options:rotated.map(item=>item.option),correctAnswer:rotated.map((item,index)=>correct.includes(item.index)?index:-1).filter(index=>index>=0)};}
function lessonQuestion(courseId:string,lesson:Lesson,index:number):Question { const ordered=reorder(lesson.check.options,[lesson.check.answer],seedFor(`${courseId}-${lesson.id}-${index}`)); return { id:`${courseId}-assessment-${index+1}`, question:lesson.check.prompt, type:"single", options:ordered.options, correctAnswer:ordered.correctAnswer, explanation:lesson.check.explanation, objective:lesson.objectives[0], difficulty:index<4?"foundational":index<9?"applied":"challenge" }; }
export function createCourseAssessment(course:Course,curriculum:CourseCurriculum):CourseAssessment {
  const questions = curriculum.modules.flatMap((module,moduleIndex) => {
    const [first,second,third] = module.lessons;
    const offset = moduleIndex * 3;
    const appliedSeed=seedFor(`${course.id}-${module.id}`);
    const trueStatement=appliedSeed%3===0;
    const appliedOrder=reorder([third.summary[0],third.summary[1],third.commonMistakes[0],third.commonMistakes[1]],[0,1],appliedSeed);
    const applied: Question = moduleIndex === curriculum.modules.length - 1
      ? { id:`${course.id}-assessment-${offset+3}`, question:`True or false: ${trueStatement?third.summary[0]:third.commonMistakes[0]}`, type:"true-false", options:["True","False"], correctAnswer:[trueStatement?0:1], explanation:trueStatement?third.summary.join(" "):`This statement describes a common mistake. ${third.summary.join(" ")}`, objective:third.objectives[0], difficulty:"challenge" }
      : { id:`${course.id}-assessment-${offset+3}`, question:`Which two statements accurately describe ${third.keyTerms[0]} in this course?`, type:"multiple", options:appliedOrder.options, correctAnswer:appliedOrder.correctAnswer, explanation:third.summary.join(" "), objective:third.objectives[2], difficulty:"applied" };
    return [lessonQuestion(course.id,first,offset),lessonQuestion(course.id,second,offset+1),applied];
  });
  return { id:`${course.id}-final-assessment`, courseId:course.id, title:`${course.title} final assessment`, passingScore:70, estimatedMinutes:15, questions };
}
export function scoreAssessment(test:CourseAssessment,answers:Answers){const details=test.questions.map(question=>{const selected=[...(answers[question.id]??[])].sort((a,b)=>a-b),expected=[...question.correctAnswer].sort((a,b)=>a-b);return{question,selected,correct:selected.length===expected.length&&selected.every((value,index)=>value===expected[index])};});const correct=details.filter(detail=>detail.correct).length,percentage=test.questions.length?Math.round(correct/test.questions.length*100):0;return{total:test.questions.length,correct,incorrect:test.questions.length-correct,percentage,passed:percentage>=test.passingScore,details};}

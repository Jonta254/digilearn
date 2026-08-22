import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { COURSES } from "../courses";

export const alt = "DigiLearn course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
type Props = { params: Promise<{ id: string }> };

export default async function CourseOpenGraphImage({ params }: Props) {
  const { id } = await params;
  const course = COURSES.find((item) => item.id === id);
  if (!course) notFound();
  return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",background:"#f3f8f8",color:"#12304a",padding:"74px 82px",flexDirection:"column",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",fontSize:"30px",fontWeight:800,gap:"16px"}}><div style={{width:"62px",height:"62px",display:"flex",alignItems:"center",justifyContent:"center",background:"#12304a",color:"#ffffff",fontSize:"34px",fontWeight:800}}>D</div>DigiLearn</div>
    <div style={{display:"flex",flexDirection:"column",maxWidth:"980px"}}><div style={{fontSize:"24px",fontWeight:700,color:"#0b858d",textTransform:"uppercase",letterSpacing:"2px"}}>{`${course.topic.replace("-", " ")} · ${course.level}`}</div><div style={{fontSize:"70px",lineHeight:1.02,fontWeight:800,letterSpacing:"-2px",marginTop:"22px"}}>{course.title}</div><div style={{fontSize:"27px",lineHeight:1.4,color:"#4b6475",marginTop:"28px"}}>{`${course.tags.slice(0, 4).join(" · ")} · 12 structured lessons`}</div></div>
    <div style={{fontSize:"23px",color:"#365468"}}>Every lesson currently open in preview access.</div>
  </div>, size);
}

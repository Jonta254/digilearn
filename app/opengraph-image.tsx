import { ImageResponse } from "next/og";

export const alt = "DigiLearn - Practical digital learning, structured for progress.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Symbol() {
  return <svg width="108" height="108" viewBox="0 0 48 48"><path d="M5 9.5c6.2-1 12.4.6 19 5.4v26.2C17.6 36.4 11.2 34.8 5 35.8V9.5Z" fill="#fff"/><path d="M43 9.5c-6.2-1-12.4.6-19 5.4v26.2c6.4-4.7 12.8-6.3 19-5.3V9.5Z" fill="#d8eeee"/><path d="M24 14.9v26.2M29 31h4v-4h4v-5h5" fill="none" stroke="#79d7d5" strokeWidth="2.6"/></svg>;
}
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",background:"#102c43",color:"#fff",padding:"72px 80px",alignItems:"center",justifyContent:"space-between"}}>
    <div style={{display:"flex",flexDirection:"column",width:"66%"}}><div style={{display:"flex",alignItems:"center",gap:"24px",fontSize:"44px",fontWeight:800}}><Symbol />DigiLearn</div><div style={{fontSize:"66px",fontWeight:800,lineHeight:1.06,marginTop:"44px",letterSpacing:"-2px"}}>Practical digital learning, structured for progress.</div><div style={{fontSize:"25px",color:"#c9dcdf",marginTop:"28px"}}>Clear lessons. Reviewable practice. Honest device-local progress.</div></div>
    <div style={{width:"27%",height:"390px",display:"flex",flexDirection:"column",gap:"18px",justifyContent:"center"}}>{["Learn","Apply","Review"].map((label,index)=><div key={label} style={{display:"flex",alignItems:"center",gap:"18px",background:index===2?"#0f9fa8":"#173c57",border:"2px solid #4e7386",padding:"26px",fontSize:"25px",fontWeight:700}}><span style={{fontSize:"18px",opacity:.7}}>0{index+1}</span>{label}</div>)}</div>
  </div>, size);
}

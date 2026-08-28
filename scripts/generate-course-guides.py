"""Generate polished DigiLearn PDF study guides for every course."""
import json
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, HRFlowable, KeepTogether, ListFlowable, ListItem, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"tmp"/"pdfs"/"course-guide-data.json"
OUT=ROOT/"public"/"downloads"/"course-guides"
NAVY=colors.HexColor("#102B42"); TEAL=colors.HexColor("#0A766E"); MINT=colors.HexColor("#EAF7F4"); INK=colors.HexColor("#263B4D"); MUTED=colors.HexColor("#5C6F7E"); LINE=colors.HexColor("#D8E2E8"); PAPER=colors.HexColor("#FBFDFC")
base=getSampleStyleSheet()
S={
"title":ParagraphStyle("title",parent=base["Title"],fontName="Helvetica-Bold",fontSize=28,leading=32,textColor=NAVY,spaceAfter=12),
"sub":ParagraphStyle("sub",parent=base["BodyText"],fontSize=12,leading=18,textColor=MUTED,spaceAfter=14),
"eye":ParagraphStyle("eye",parent=base["BodyText"],fontName="Helvetica-Bold",fontSize=8.5,leading=11,textColor=TEAL,spaceAfter=7),
"h1":ParagraphStyle("h1",parent=base["Heading1"],fontName="Helvetica-Bold",fontSize=21,leading=26,textColor=NAVY,spaceAfter=11),
"h2":ParagraphStyle("h2",parent=base["Heading2"],fontName="Helvetica-Bold",fontSize=14,leading=18,textColor=NAVY,spaceBefore=11,spaceAfter=6),
"h3":ParagraphStyle("h3",parent=base["Heading3"],fontName="Helvetica-Bold",fontSize=10.5,leading=14,textColor=INK,spaceAfter=3),
"body":ParagraphStyle("body",parent=base["BodyText"],fontSize=9.2,leading=13.5,textColor=INK,spaceAfter=6),
"small":ParagraphStyle("small",parent=base["BodyText"],fontSize=7.5,leading=10.5,textColor=MUTED),
"label":ParagraphStyle("label",parent=base["BodyText"],fontName="Helvetica-Bold",fontSize=7.8,leading=10,textColor=TEAL)}
def clean(v):
    return str(v).encode("ascii", "ignore").decode("ascii")
def p(v,s="body"): return Paragraph(clean(v),S[s])
def listing(items,numbered=False):
    return ListFlowable([ListItem(p(x),leftIndent=5*mm) for x in items],bulletType="1" if numbered else "bullet",leftIndent=7*mm,bulletFontName="Helvetica-Bold",bulletColor=TEAL,spaceAfter=5)
def decor(canvas,doc):
    canvas.saveState(); w,h=A4
    canvas.setFillColor(NAVY); canvas.rect(0,h-11*mm,w,11*mm,fill=1,stroke=0)
    canvas.setFillColor(colors.white); canvas.setFont("Helvetica-Bold",8); canvas.drawString(18*mm,h-7*mm,"DIGILEARN  /  PRACTICAL STUDY GUIDE")
    canvas.setFillColor(MUTED); canvas.setFont("Helvetica",7.5); canvas.drawString(18*mm,10*mm,clean(doc.title)[:70]); canvas.drawRightString(w-18*mm,10*mm,str(canvas.getPageNumber()))
    canvas.setStrokeColor(LINE); canvas.line(18*mm,14*mm,w-18*mm,14*mm); canvas.restoreState()
def info(rows):
    t=Table([[p(a,"label"),p(b)] for a,b in rows],colWidths=[34*mm,126*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(0,-1),MINT),("BOX",(0,0),(-1,-1),.6,LINE),("INNERGRID",(0,0),(-1,-1),.4,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)])); return t
def module_table(modules):
    rows=[[p("MODULE","label"),p("LESSONS AND FOCUS","label")]]
    for i,m in enumerate(modules,1):
        lessons="<br/>".join(f"{n+1}. {clean(x['title'])}" for n,x in enumerate(m["lessons"]))
        rows.append([p(f"{i:02d}  {m['title']}","h3"),Paragraph(lessons,S["small"])])
    t=Table(rows,colWidths=[51*mm,109*mm],repeatRows=1)
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,PAPER]),("LEFTPADDING",(0,0),(-1,-1),8),("RIGHTPADDING",(0,0),(-1,-1),8),("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8)])); return t
def build(item):
    c,e,u=item["course"],item["editorial"],item["curriculum"]; q=u["practicalOutcome"]; path=OUT/f"{c['id']}-study-guide.pdf"
    doc=BaseDocTemplate(str(path),pagesize=A4,title=f"{clean(c['title'])} - DigiLearn study guide",author="DigiLearn",subject="Practical course guide and project workbook",leftMargin=18*mm,rightMargin=18*mm,topMargin=20*mm,bottomMargin=19*mm)
    doc.addPageTemplates(PageTemplate(id="guide",frames=[Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height,id="main")],onPage=decor))
    story=[Spacer(1,13*mm),p("PRACTICAL COURSE WORKBOOK","eye"),p(c["title"],"title"),p(e["outcome"],"sub"),info([("LEVEL",c["level"]),("GUIDED TIME",f"{round(u['durationMinutes']/60)} hours across 12 lessons"),("PROJECT",e["project"]),("SKILLS",", ".join(u["skills"][:6])),("REVIEWED",e["lastReviewed"])]),Spacer(1,7*mm),p("WHAT YOU WILL BE ABLE TO DO","h2"),listing(u["outcomes"]),p("WHO THIS IS FOR","h2"),p(u["intendedLearner"]),p("BEFORE YOU BEGIN","h2"),listing(u["prerequisites"]),Spacer(1,4*mm),HRFlowable(width="100%",color=LINE,thickness=.7),Spacer(1,3*mm),p("Use this guide beside the interactive lessons. Keep inputs, decisions, tests, limitations and the next improvement.","small"),PageBreak(),
    p("COURSE MAP","eye"),p("From foundation to finished work","h1"),p(u["overview"]),module_table(u["modules"]),Spacer(1,6*mm),p("HOW TO STUDY EACH LESSON","h2"),listing(["Read the objective and identify the decision it supports.","Reproduce the worked example with the stated input.","Test one normal case and one boundary or failure case.","Complete the knowledge check without guessing.","Save a short evidence note: result, limitation and next action."],True),PageBreak(),
    p("CAPSTONE PROJECT","eye"),p(q["objective"],"h1"),info([("DELIVERABLE",q["expectedOutput"]),("TOOLS",", ".join(q["tools"]))]),p("Production plan","h2"),listing(q["steps"],True),p("Definition of done","h2"),listing(q["successCriteria"])]
    if q.get("safety"): story += [KeepTogether([p("RESPONSIBLE PRACTICE","label"),p(q["safety"])])]
    story += [p("Evidence log","h2"),info([("INPUT","Original brief, data, requirements or test material."),("DECISIONS","Chosen method and one reasonable alternative."),("TESTS","Normal, boundary and failure results."),("LIMITATION","What the result does not establish."),("REVISION","One evidence-led improvement.")]),PageBreak(),p("REVIEW AND SOURCES","eye"),p("Make the work credible and repeatable","h1"),p("Final self-review","h2"),listing(q["selfReview"]),p("Authoritative references","h2")]
    for src in u["references"]:
        reviewed=f" - reviewed {src['accessed']}" if src.get("accessed") else ""
        story += [KeepTogether([p(src["title"],"h3"),p(f"{src['organization']}{reviewed}<br/>{src['url']}","small")])]
    story += [Spacer(1,5*mm),HRFlowable(width="100%",color=LINE,thickness=.7),Spacer(1,3*mm),p("SOURCE NOTE","label"),p("Product versions, laws and professional standards can change. Recheck the linked primary source before applying version-sensitive information."),p("NEXT IMPROVEMENT","label"),p(q["nextStep"])]
    doc.build(story); return path
def main():
    OUT.mkdir(parents=True,exist_ok=True); items=json.loads(DATA.read_text(encoding="utf-8")); paths=[build(x) for x in items]; print(f"Generated {len(paths)} PDF study guides")
if __name__=="__main__": main()

"""Generate polished DigiLearn PDF study guides for every course."""
import json
import os
import time
from html import escape
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
"label":ParagraphStyle("label",parent=base["BodyText"],fontName="Helvetica-Bold",fontSize=7.8,leading=10,textColor=TEAL),
"lesson":ParagraphStyle("lesson",parent=base["BodyText"],fontName="Helvetica-Bold",fontSize=11,leading=14,textColor=NAVY,spaceAfter=4),
"prompt":ParagraphStyle("prompt",parent=base["BodyText"],fontSize=8.4,leading=12,textColor=INK,spaceAfter=4),
"write":ParagraphStyle("write",parent=base["BodyText"],fontSize=8,leading=12,textColor=MUTED,spaceAfter=3),
}
def clean(v):
    return str(v).encode("ascii", "ignore").decode("ascii")
def p(v,s="body"): return Paragraph(escape(clean(v)),S[s])
def listing(items,numbered=False):
    return ListFlowable([ListItem(p(x),leftIndent=5*mm) for x in items],bulletType="1" if numbered else "bullet",leftIndent=7*mm,bulletFontName="Helvetica-Bold",bulletColor=TEAL,spaceAfter=5)
def decor(canvas,doc):
    canvas.saveState(); canvas.resetTransforms(); w,h=A4
    canvas.setFillColor(NAVY); canvas.rect(0,h-11*mm,w,11*mm,fill=1,stroke=0)
    canvas.setFillColor(colors.white); canvas.setFont("Helvetica-Bold",8); canvas.drawString(18*mm,h-7*mm,"DIGILEARN  /  PRACTICAL STUDY GUIDE")
    canvas.setFillColor(MUTED); canvas.setFont("Helvetica",7.5); canvas.drawString(18*mm,10*mm,clean(doc.title)[:58]); canvas.drawCentredString(w/2,10*mm,"digilearn-five.vercel.app"); canvas.drawRightString(w-18*mm,10*mm,f"PAGE {canvas.getPageNumber()}")
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
def writing_box(title, prompt, rows=4):
    data=[[p(title,"label")],[p(prompt,"write")]]+[[""] for _ in range(rows)]
    heights=[7*mm,9*mm]+[8*mm]*rows
    table=Table(data,colWidths=[160*mm],rowHeights=heights)
    table.setStyle(TableStyle([("BOX",(0,0),(-1,-1),.6,LINE),("LINEBELOW",(0,1),(-1,-2),.35,LINE),("BACKGROUND",(0,0),(-1,0),MINT),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,1),6)]))
    return table
def lesson_panel(lesson, number):
    rows=[
        [p(f"LESSON {number:02d}  /  {lesson['minutes']} MIN","label")],
        [p(lesson["title"],"lesson")],
        [p("Learning objectives","h3"),listing(lesson["objectives"])],
        [p("Key terms","h3"),p(", ".join(lesson["keyTerms"]),"small")],
        [p("Retrieval prompt","h3"),p(lesson["check"]["prompt"],"prompt")],
        [p("Evidence to keep","h3"),p("[ ] Original input   [ ] Observed result   [ ] Boundary or failure result   [ ] Limitation and next action","small")],
    ]
    table=Table(rows,colWidths=[38*mm,122*mm])
    table.setStyle(TableStyle([("SPAN",(0,0),(1,0)),("SPAN",(0,1),(1,1)),("BACKGROUND",(0,0),(-1,0),MINT),("BOX",(0,0),(-1,-1),.6,LINE),("LINEBELOW",(0,1),(-1,1),.5,LINE),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
    return table
def build(item):
    c,e,u=item["course"],item["editorial"],item["curriculum"]; q=u["practicalOutcome"]; path=OUT/f"{c['id']}-study-guide.pdf"; temporary_path=path.with_suffix(".pdf.tmp")
    temporary_path.unlink(missing_ok=True)
    doc=BaseDocTemplate(str(temporary_path),pagesize=A4,title=f"{clean(c['title'])} - DigiLearn study guide",author="DigiLearn",subject="Practical course guide and project workbook",leftMargin=18*mm,rightMargin=18*mm,topMargin=20*mm,bottomMargin=19*mm)
    # Draw the persistent furniture after the page content so every exported
    # page receives the same visible header and footer treatment.
    doc.addPageTemplates(PageTemplate(id="guide",frames=[Frame(doc.leftMargin,doc.bottomMargin,doc.width,doc.height,id="main")],onPageEnd=decor))
    story=[Spacer(1,13*mm),p("PRACTICAL COURSE WORKBOOK","eye"),p(c["title"],"title"),p(e["outcome"],"sub"),info([("LEVEL",c["level"]),("GUIDED TIME",f"{round(u['durationMinutes']/60)} hours across 12 lessons"),("PROJECT",e["project"]),("SKILLS",", ".join(u["skills"][:6])),("EDITION",f"{e['editorialStatus']} - version {e['version']}")]),Spacer(1,7*mm),p("WHAT YOU WILL BE ABLE TO DO","h2"),listing(u["outcomes"]),p("WHO THIS IS FOR","h2"),p(u["intendedLearner"]),p("BEFORE YOU BEGIN","h2"),listing(u["prerequisites"]),Spacer(1,4*mm),HRFlowable(width="100%",color=LINE,thickness=.7),Spacer(1,3*mm),p("Use this workbook with the online lessons. It is designed for A4 printing, handwritten evidence notes, and offline revision. It does not provide certification.","small"),PageBreak(),
    p("WORKBOOK GUIDE","eye"),p("A clear route through the course","h1"),p(u["overview"]),module_table(u["modules"]),Spacer(1,6*mm),p("HOW TO USE EACH LESSON PAGE","h2"),listing(["Read the objective and identify the decision it supports.","Attempt the retrieval prompt before checking the online explanation.","Reproduce the worked example with the stated input.","Test one normal case and one boundary or failure case.","Record the result, limitation and next action in the evidence log."],True),p("PRINT AND FILE","h2"),p("Print at 100% scale on A4 paper. Use double-sided printing with long-edge binding. Keep completed pages with the project files named in the evidence log."),PageBreak()]
    lesson_number=1
    for module_index,module in enumerate(u["modules"],1):
        story += [p(f"MODULE {module_index:02d}","eye"),p(module["title"],"h1"),p(module["summary"],"sub")]
        for lesson in module["lessons"]:
            story += [lesson_panel(lesson,lesson_number),Spacer(1,5*mm)]
            lesson_number += 1
        story += [p("MODULE REVIEW","eye"),p("Turn the module into usable evidence","h1"),writing_box("1. RETRIEVE", "Without checking the lessons, explain the module's three most important ideas in your own words.",4),Spacer(1,5*mm),writing_box("2. APPLY", "Describe the example or file you produced, the input used, and the result you observed.",5),Spacer(1,5*mm),writing_box("3. REVIEW", "Record one uncertainty, one source to recheck, and the next deliberate practice action.",4),PageBreak()]
    story += [p("CAPSTONE PROJECT","eye"),p(q["objective"],"h1"),info([("DELIVERABLE",q["expectedOutput"]),("TOOLS",", ".join(q["tools"]))]),p("Production plan","h2"),listing(q["steps"],True),p("Definition of done","h2"),listing(q["successCriteria"])]
    if q.get("safety"): story += [KeepTogether([p("RESPONSIBLE PRACTICE","label"),p(q["safety"])])]
    story += [PageBreak(),p("PROJECT EVIDENCE","eye"),p("Document decisions another person can review","h1"),writing_box("1. PURPOSE AND USER","State the intended user, need, expected outcome and constraints.",4),Spacer(1,5*mm),writing_box("2. INPUTS AND ASSUMPTIONS","List source files, data, versions, permissions and assumptions.",4),PageBreak(),p("PROJECT EVIDENCE","eye"),p("Tests, limitations and revision","h1"),writing_box("3. NORMAL CASE","Expected result, observed result and evidence location.",4),Spacer(1,5*mm),writing_box("4. BOUNDARY OR FAILURE CASE","What was difficult, what happened and why it matters.",4),Spacer(1,5*mm),writing_box("5. REVISION AND LIMITATION","What changed, what improved and what remains unproven.",4),PageBreak(),p("REVIEW AND SOURCES","eye"),p("Make the work credible and repeatable","h1"),p("Final self-review","h2"),listing(q["selfReview"]),writing_box("FINAL DECISION", "Is the project ready to share? State the evidence, remaining risk, owner and next review date.",4),p("Authoritative references","h2")]
    for src in u["references"]:
        reviewed=f" - reviewed {src['accessed']}" if src.get("accessed") else ""
        story += [KeepTogether([p(src["title"],"h3"),p(f"{src['organization']}{reviewed}","small"),p(src["url"],"small")])]
    story += [Spacer(1,5*mm),HRFlowable(width="100%",color=LINE,thickness=.7),Spacer(1,3*mm),p("SOURCE NOTE","label"),p("Product versions, laws and professional standards can change. Recheck the linked primary source before applying version-sensitive information."),p("NEXT IMPROVEMENT","label"),p(q["nextStep"])]
    doc.build(story)
    for attempt in range(10):
        try:
            os.replace(temporary_path,path)
            return path
        except PermissionError:
            if attempt == 9: raise
            time.sleep(.5)
def main():
    OUT.mkdir(parents=True,exist_ok=True); items=json.loads(DATA.read_text(encoding="utf-8")); paths=[build(x) for x in items]; print(f"Generated {len(paths)} PDF study guides")
if __name__=="__main__": main()

import type { LessonVisual, SourceReference } from "../learning-types";

export type ConceptBrief = { definition: string; application: string; evidence: string; labels: [string,string,string]; visualKind: LessonVisual["kind"] };
const accessed="2026-08-21";
const src=(title:string,organization:string,url:string):SourceReference=>({title,organization,url,accessed});
export const TOPIC_SOURCES:Record<string,SourceReference[]>={
"ai-tools":[src("AI Risk Management Framework 1.0","NIST","https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10"),src("AI Principles","OECD","https://www.oecd.org/en/topics/ai-principles.html")],
webdev:[src("Learn web development","MDN Web Docs","https://developer.mozilla.org/en-US/docs/Learn_web_development"),src("WCAG 2.2","W3C","https://www.w3.org/TR/WCAG22/")],
data:[src("The Python Tutorial","Python Software Foundation","https://docs.python.org/3/tutorial/"),src("User Guide","scikit-learn","https://scikit-learn.org/stable/user_guide.html")],
automation:[src("API Security Top 10","OWASP Foundation","https://owasp.org/API-Security/"),src("HTTP Semantics","IETF","https://www.rfc-editor.org/rfc/rfc9110")],
security:[src("Cybersecurity Framework 2.0","NIST","https://www.nist.gov/cyberframework"),src("Web Security Testing Guide","OWASP Foundation","https://owasp.org/www-project-web-security-testing-guide/")],
business:[src("Business Guide","U.S. Small Business Administration","https://www.sba.gov/business-guide"),src("SME and Entrepreneurship Policy","OECD","https://www.oecd.org/en/topics/sub-issues/sme-and-entrepreneurship-policy.html")],
databases:[src("PostgreSQL Tutorial","PostgreSQL Global Development Group","https://www.postgresql.org/docs/current/tutorial.html"),src("SQL Language","PostgreSQL Global Development Group","https://www.postgresql.org/docs/current/sql.html")],
ethics:[src("Recommendation on the Ethics of AI","UNESCO","https://www.unesco.org/en/artificial-intelligence/recommendation-ethics"),src("AI Principles","OECD","https://www.oecd.org/en/topics/ai-principles.html")],
finance:[src("National Payments System","Central Bank of Kenya","https://www.centralbank.go.ke/national-payments-system/"),src("Financial education","OECD","https://www.oecd.org/en/topics/financial-education.html")],
healthcare:[src("Global strategy on digital health 2020-2027","World Health Organization","https://www.who.int/publications/i/item/9789240116870"),src("FHIR specification","HL7 International","https://hl7.org/fhir/")],
policy:[src("Open Government Data Toolkit","World Bank","https://opendatatoolkit.worldbank.org/en/data/opendatatoolkit/home"),src("Digital government","OECD","https://www.oecd.org/en/topics/digital-government.html")]
};
type Seed=[string,string];
const rows=(value:Record<string,Seed>)=>value;
const DETAILS:Record<string,Record<string,Seed>>={
"ai-tools":rows({
"capabilities":["A capability is a task an AI system can perform under stated conditions, not a universal guarantee.","Compare representative inputs and record where performance changes."],
"limitations":["A limitation is a condition where a tool becomes unreliable, unavailable or inappropriate.","Maintain a register covering accuracy, privacy, context and tool access."],
"responsible use":["Responsible use joins purpose, affected people, oversight and recovery.","Decide when human review is mandatory and what data must stay outside the tool."],
"clear instructions":["A clear instruction names task, audience, constraints, format and quality test.","Rewrite a vague request as a bounded specification, then compare outputs."],
"context design":["Context design supplies relevant evidence, definitions and examples.","Separate authoritative context from untrusted material and label each source."],
"verification":["Verification checks generated claims against independent evidence.","Trace consequential claims to primary sources or reproducible calculations."],
"research":["AI-assisted research is a source-led search and synthesis workflow.","Build a question matrix and inspect primary sources before synthesising."],
"creation":["AI-assisted creation treats model output as draft material.","Set a brief, generate alternatives, edit for audience and record provenance."],
"automation":["AI automation connects model output to actions, increasing unchecked error cost.","Place validation and approval gates before external or irreversible actions."],
"evaluation":["Evaluation compares behaviour on representative tasks using explicit criteria.","Build a test set with pass conditions, edge cases and failure categories."],
"privacy":["Privacy practice minimizes personal data and controls retention and disclosure.","Classify inputs and remove identifiers not required for the task."],
"repeatable practice":["A repeatable workflow records versions, inputs, settings and review decisions.","Create a run sheet another person can follow and audit."]
}),
webdev:rows({
standards:["Web standards define interoperable document, style, script and accessibility behaviour.","Use valid semantics and test more than one browser and input method."],
structure:["Structure gives content meaning and establishes maintainable component boundaries.","Map headings, landmarks and responsibilities before styling."],
"developer tools":["Developer tools expose DOM, styles, requests, storage and runtime diagnostics.","Reproduce one defect and isolate its responsible layer with evidence."],
components:["A component owns one coherent interface responsibility and input contract.","Extract repeated UI while keeping state at the narrowest useful boundary."],
"state and data":["State is information that changes; derived values come from source state.","Separate server data, durable client records and transient interface state."],
"responsive layout":["Responsive layout adapts relationships and controls, not only dimensions.","Test reflow, touch targets and overflow at named breakpoints."],
accessibility:["Accessibility supports diverse perception, cognition and input methods.","Check semantics, keyboard order, names, contrast and zoom."],
testing:["Web testing combines unit evidence, component behaviour and complete user flows.","Choose the smallest test that proves the risk and keeps failures diagnostic."],
performance:["Performance work reduces delay, transfer and layout instability.","Measure first and link each change to a specific bottleneck."],
security:["Web security treats input, identity and browser boundaries as untrusted.","Validate on the server, encode output and apply least privilege."],
deployment:["Deployment creates a reproducible runtime with configuration and rollback.","Build once, verify environment assumptions and record a rollback point."],
maintenance:["Maintenance keeps dependencies, content and operations accurate.","Prioritise changes by risk, test affected flows and document decisions."]
}),
data:rows({
"problem framing":["Problem framing turns a broad question into a target, unit and decision.","Write the decision first and identify the minimum supporting data."],
"data types":["A data type defines valid values and operations; meaning is separate from format.","Create a dictionary for dates, categories, measures and identifiers."],
"tool setup":["A reproducible environment records language, package and data versions.","Create an isolated environment with a rebuild command."],
cleaning:["Cleaning resolves invalid, missing, duplicated or inconsistent observations.","Profile first, state rules and retain an audit of changes."],
exploration:["Exploration describes distributions, relationships and anomalies without claiming causation.","Use summaries and plots that preserve scale, missingness and context."],
modelling:["A model formalises a relationship between inputs and an outcome under assumptions.","Separate fitting and evaluation data and document intended use."],
validation:["Validation estimates performance outside the data used for fitting.","Choose metrics tied to real error cost and inspect subgroups."],
uncertainty:["Uncertainty states what data and methods cannot determine precisely.","Report ranges, assumptions and sensitivity rather than false precision."],
communication:["Data communication connects evidence to a decision without hiding limits.","Lead with the question and label comparisons and uncertainty."],
workflow:["An analysis workflow keeps raw data immutable and separates transformations.","Organise scripts so every output can be rebuilt."],
review:["Analytical review challenges definitions, code, assumptions and interpretation.","Use an independent spot calculation on a critical result."],
reproducibility:["Reproducibility lets another person regenerate a result.","Pin dependencies, record provenance and automate outputs."]
}),
automation:rows({
triggers:["A trigger is the event or schedule that creates a run and initial payload.","Define idempotency and how repeated events are detected."],
actions:["An action retrieves or changes state in a connected system.","Document permissions, response and compensation for failure."],
"data mapping":["Data mapping translates fields and types between schemas.","Specify required fields, conversions and invalid-record handling."],
connections:["A connection combines endpoint, authentication and authorised scope.","Use a dedicated least-privilege credential and test expiry."],
conditions:["A condition routes a run according to explicit rules.","Order branches and include an observable default path."],
transformations:["A transformation changes data representation without changing meaning.","Test nulls, dates, encodings and numeric precision."],
errors:["An error policy classifies failures as retryable, terminal or reviewable.","Capture safe context and prevent endless retry loops."],
testing:["Automation tests use representative payloads without real side effects.","Use a sandbox, fixed fixtures and boundary assertions."],
monitoring:["Monitoring shows whether workflows run and produce expected outcomes.","Track success, latency, retries and reconciliation."],
documentation:["Documentation records purpose, owner, dependencies and recovery.","Write a runbook a second operator can follow."],
security:["Automation security limits credentials and validates inbound events.","Verify webhook signatures and rotate secrets safely."],
maintenance:["Maintenance reviews schemas, credentials, quotas and owners.","Schedule test runs and retire unused connections."]
}),
security:rows({
assets:["An asset is information, capability or service whose loss matters.","Record owner, sensitivity and operational dependency."],
threats:["A threat can exploit a weakness and cause harm.","Connect actor, opportunity, action and impact in a scenario."],
risk:["Risk combines likelihood and consequence in a stated context.","Record assumptions and choose accountable treatment."],
identity:["Identity controls establish who acts before granting authorization.","Separate authentication from authorization and review privilege."],
"network protection":["Network protection limits exposure across trust boundaries.","Map flows, default-deny unnecessary paths and retain logs."],
hardening:["Hardening removes unnecessary capability and applies secure configuration.","Baseline settings and monitor justified exceptions."],
"safe testing":["Safe testing requires authorization, bounded targets and stop conditions.","Write rules of engagement before test traffic."],
evidence:["Security evidence must be reproducible without causing damage.","Capture timestamp, component, request and minimal proof."],
remediation:["Remediation reduces the root weakness and verifies the fix.","Prioritise impact, correct the cause and retest safely."],
monitoring:["Security monitoring turns relevant events into investigated signals.","Define detection, enrichment and ownership before alerting."],
response:["Incident response coordinates containment, evidence, communication and recovery.","Use severity playbooks and record consequential actions."],
recovery:["Recovery restores trusted service and reduces recurrence.","Restore from known-good sources and validate business functions."]
}),
business:rows({
"problem discovery":["Problem discovery tests whether a recurring costly situation exists.","Ask about recent behaviour and evidence, not hypothetical enthusiasm."],
research:["Business research combines customer evidence and market constraints.","Triangulate interviews, observation and credible secondary data."],
positioning:["Positioning identifies audience, problem, category and meaningful difference.","Write a specific comparison without unsupported superiority claims."],
scope:["Scope defines outcome, deliverables, exclusions and change process.","Turn assumptions into acceptance criteria."],
value:["Value is observable improvement relative to cost, effort and alternatives.","Describe the before-and-after state with customer-recognised evidence."],
pricing:["Pricing considers value, cost, risk and market context.","Model scenarios and distinguish price, cost and profit."],
operations:["Operations turn a promise into repeatable delivery.","Map handoffs and identify the throughput constraint."],
quality:["Quality is conformance to explicit customer and operational requirements.","Place checks where defects can still be corrected cheaply."],
finance:["Business finance tracks cash timing, economics and obligations.","Build a conservative cash-flow view with stated assumptions."],
measurement:["A useful metric changes a decision and has a stable definition.","Pair outcome metrics with leading signals and guardrails."],
retention:["Retention measures continued value for an appropriate cohort.","Compare cohorts and investigate continued use or departure."],
risk:["Business risk records uncertainty, exposure, owner and response.","Prioritise consequence and reversibility over optimism."]
}),
databases:rows({
entities:["An entity is a distinguishable thing represented consistently.","Derive entities from business rules and define stable identifiers."],
relationships:["A relationship states association, optionality and cardinality.","Model cardinality before choosing foreign keys."],
constraints:["A constraint prevents states that violate a declared rule.","Place invariants near data and test rejected writes."],
selection:["Selection returns rows satisfying a predicate; NULL affects logic.","Translate conditions into predicates and test boundaries."],
joins:["A join combines related rows according to keys and type.","Predict cardinality before executing and inspect multiplication."],
aggregation:["Aggregation summarises groups using functions such as COUNT or SUM.","Define grouping grain before choosing an aggregate."],
transactions:["A transaction groups operations into a consistent unit.","Choose boundaries that preserve invariants under failure."],
indexes:["An index trades storage and write cost for faster access.","Use workload evidence and query plans before adding one."],
backups:["A backup is useful only when it can be restored.","Test restoration against recovery objectives."],
security:["Database security combines least privilege, transport and auditing.","Grant roles by task and test prohibited operations."],
performance:["Performance depends on workload, plans, distribution and contention.","Measure a representative query and inspect its plan."],
operations:["Operations cover monitoring, schema change, capacity and recovery.","Use reversible migrations and observable procedures."]
}),
ethics:rows({
stakeholders:["Stakeholders use, operate, govern or are affected by a system.","Map power, benefit, burden and ability to contest."],
harms:["Harm analysis considers severity, scale, duration and distribution.","Write concrete scenarios naming affected people."],
rights:["Rights analysis identifies protected interests and remedies in context.","Connect system actions to applicable rights and escalation."],
bias:["Bias can enter through framing, data, labels, modelling or use.","Trace disparity to lifecycle decisions."],
measurement:["Ethical measurement requires context-appropriate definitions and metrics.","Report trade-offs rather than one aggregate fairness claim."],
impact:["Impact assessment anticipates consequences and mitigations.","Record intended use, misuse and affected-party evidence."],
accountability:["Accountability assigns answerability, authority and remedy.","Name owners for approval, monitoring and appeal."],
documentation:["Documentation preserves purpose, provenance, evaluations and limits.","Write for operators, auditors and affected people."],
oversight:["Human oversight needs information, authority, time and intervention.","Test whether an operator can detect and override a bad outcome."],
"risk review":["Risk review prioritises harms and tests controls.","Use affected-stakeholder and technical evidence."],
participation:["Participation gives affected people meaningful influence.","State what can change and how feedback receives response."],
monitoring:["Ethical monitoring looks for changing use and unequal effects.","Set review thresholds and a route to pause."]
}),
finance:rows({
value:["Financial value depends on timing, uncertainty and alternatives.","Separate nominal and present value with stated assumptions."],
risk:["Financial risk includes loss, liquidity, volatility, credit and operations.","Describe exposure and downside before potential return."],
markets:["Markets coordinate participants through rules and infrastructure.","Trace instrument, venue and settlement."],
records:["Financial records preserve date, counterparty, amount, currency and class.","Reconcile the ledger to an independent source."],
analysis:["Financial analysis makes records and assumptions comparable.","Show formulas so another person can recalculate."],
controls:["Controls prevent, detect and correct errors or unauthorised actions.","Separate approval, execution and reconciliation."],
scenarios:["Scenario analysis changes assumptions to examine outcomes.","Use base, downside and upside without invented probabilities."],
evaluation:["Evaluation compares alternatives consistently.","Include fees, timing and jurisdiction-specific effects."],
reporting:["Reporting states period, currency, definitions and uncertainty.","Make totals traceable and disclose assumptions."],
security:["Financial security protects identity, authorization and integrity.","Use strong authentication and independent confirmation."],
regulation:["Financial regulation varies by product, jurisdiction and time.","Identify the current regulator and primary rule."],
review:["Financial review independently checks calculations and authorization.","Recalculate a sample and reconcile totals."]
}),
healthcare:rows({
"care pathways":["A care pathway coordinates activities across health services.","Map handoffs and information needs for the actual setting."],
"health data":["Health data gains meaning from context, provenance and timing.","Preserve context and distinguish missing from negative."],
stakeholders:["Health technology affects patients, clinicians and authorities differently.","Map benefit, burden, consent and authority."],
standards:["Health standards define structures and exchange rules.","Identify implementation guide and version before mapping."],
interoperability:["Interoperability combines exchange, shared meaning and usable workflow.","Test receiving-team interpretation and action."],
workflows:["Clinical workflows include responsibilities, interruptions and escalation.","Observe real work before adding alerts or fields."],
validation:["Health validation must match population, setting and intended use.","Separate analytical performance from clinical utility."],
privacy:["Health privacy requires lawful purpose, minimisation and control.","Apply current jurisdiction rules and document exceptions."],
"human oversight":["Human oversight preserves clinical judgement and disagreement.","Design safe review and escalation routes."],
implementation:["Implementation combines technology, training, governance and support.","Pilot in context and measure safety and equity."],
monitoring:["Post-deployment monitoring detects drift, incidents and workarounds.","Review signals with responsible clinical owners."],
equity:["Equity asks whether access, performance or burden differs by group.","Use disaggregated evidence and community interpretation."]
}),
policy:rows({
stakeholders:["Policy stakeholders differ in authority, knowledge and exposure.","Map who decides, implements, benefits, pays and challenges."],
institutions:["Institutions are rules and organisations shaping public action.","Identify mandates, budgets and coordination constraints."],
evidence:["Policy evidence includes data, research, experience and implementation knowledge.","Assess relevance, quality and uncertainty."],
"open data":["Open data is reusable data with documentation and licence.","Check licence, provenance, updates and disclosure risk."],
services:["Digital public services should reduce burden and preserve due process.","Map the complete journey, failure and assisted channels."],
participation:["Participation should create meaningful influence.","State what is open and publish the response to input."],
options:["Policy options are compared against explicit criteria.","Include capacity, distribution and a no-action baseline."],
impact:["Policy impact includes intended and unintended effects.","Define causal pathway and indicators before implementation."],
implementation:["Implementation turns authority and resources into action.","Assign owners, milestones and adaptation."],
measurement:["Policy measurement uses stable definitions and baselines.","Avoid vanity indicators and report distribution."],
transparency:["Transparency makes evidence, decisions and limits inspectable.","Publish reasons, definitions and correction channels."],
maintenance:["Public digital systems require funded lifecycle ownership.","Plan costs, security and exit before launch."]
})
};
const kinds:LessonVisual["kind"][]=["flow","comparison","layers","cycle","timeline","matrix"];
export function getConceptBrief(topic:string,concept:string,index:number):ConceptBrief|undefined{
const seed=DETAILS[topic]?.[concept]; if(!seed)return undefined;
const words=concept.split(" "); const focus=words.map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
return {definition:seed[0],application:seed[1],evidence:`Evidence for ${concept} should show the input, decision, result and review.`,labels:["Context",focus,"Evidence"],visualKind:kinds[index%kinds.length]};
}

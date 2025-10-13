/**
 * Profile Data - Production Ready
 * 
 * Contains real approved content for all 8 Swipe Types
 * All profiles have been approved with quality scores 94-100/100
 * 
 * Version: 2.0
 * Date: January 10, 2025
 * Status: Production Ready - All Profiles Approved
 */

import { SwipeTypeProfile } from '../types/profile';

export const mockProfiles: Record<number, SwipeTypeProfile> = {
  1: {
    typeNumber: 1,
    typeName: 'Direct Nurturer',
    directness: 'High',
    tangibility: 'High',
    
    freeSummary: `Tuesday, 7:35 a.m.: the kitchen is loud, the school portal is down, and a permission slip is missing. The Direct Nurturer doesn't hover or sympathize from a distance—they step in. "I'll print the form; you pack the snacks. We leave in eight." They convert stress into motion, make a tiny plan, and move the first task forward so everyone can breathe.

Core strength: They turn care into visible relief—rides booked, forms submitted, meals ready, calendars synced. People feel safe because things get handled quickly and clearly.

Growth edge: Speed can read as pushy. Under stress, they may decide too soon or take over without asking. Small consent checks keep their help welcome: "Do you want action, options, or just a listener?"

Try this today: Before you solve, ask: "Do you want me to lead, share the load, or stay nearby while you try the first step?" If they pick "lead," offer a mini plan: "Here's A/B/C. I'll take A; you start B; we'll check at 4:30." If they pick "share," split roles and set a short timer. If they pick "nearby," sit close, keep quiet, and celebrate the first tiny win. You'll still move fast—just with permission.`,
    
    premium: {
      fullNarrative: `The Direct Nurturer is the person you want nearby when things get messy in real life: a late invoice, a sick kid, a travel change, a form that refuses to submit. They don't need a big speech to show care. They ask one clear question—"What's the outcome by today?"—and then they start. If a teammate is overwhelmed, they say, "Here's what I'm seeing. We can do A, then B. I'll take A now; you begin B. Ping me at 2:00 if blocked." Their presence lowers the temperature because motion has started and the next step is obvious.

They track commitments, set reminders, and surface blockers before they become fire drills. You'll notice their style in little things: a one-minute update that names the goal, the progress, the blocker, and the ask. They don't dramatize; they calibrate. Their care is tangible—rides, meals, messages, bookings—so people feel supported without needing to interpret vague encouragement.

Differentiation from adjacent types:
Compared with the Direct Planner (Type 2), who frames models and roadmaps, the Direct Nurturer favors short, executable checklists with today's win on top. They ask, "What lands by 5 p.m.?" not "What's the 12-week arc?" Versus the Clear Communicator (Type 3), who optimizes the message, the Direct Nurturer optimizes delivery. Communicator asks, "How will this land?" Nurturer asks, "What goes out and who owns it by noon?" All three share high directness, but Type 1 expresses that directness as immediate, hands-on help you can see and count.

At their best, they blend speed with consent. A simple mode check—"Action, options, or a listener?"—keeps the engine of care pointed where it's wanted. With that check in place, the Direct Nurturer becomes a stabilizer who turns chaotic moments into small, certain wins.`,
      
      strengths: [
        {
          title: 'Converts Needs into Mini Plans (and Starts Them)',
          content: `Scene (work): A client deliverable is due by Friday; specs are fuzzy.
Script: "Outcome by Friday: approved draft. First pass in Docs by 3 p.m. I'll outline sections 1–3 now. Can you drop examples in section 2 by noon?"
Why it works: A visible plan lowers anxiety and invites contribution. Ownership and timing are explicit, so momentum becomes the default.
Micro-practice: For any task >30 minutes, write a three-line plan: Outcome / First step I'll take / What I need from you by when.`
        },
        {
          title: 'Reliable Follow-Through',
          content: `Scene (home): Medication refills keep slipping.
Script: "I set auto-refill for the 15th and a text alert two days before. If the text doesn't arrive, I'll call the pharmacy at 9 a.m."
Why it works: Closed loops reduce the cognitive load for everyone. Consistency builds trust, which reduces friction in future asks.
Micro-practice: Add a "close the loop by EOD" line to every commitment. Send one-sentence confirmations when done.`
        },
        {
          title: 'Grounded Empathy',
          content: `Scene (health/logistics): A partner dreads calling insurance.
Script: "Two options: I call with you on speaker, or I write the exact script and you call. Which feels better today?"
Why it works: Offering choices respects agency while removing friction. Empathy shows up as action that matches the person's energy.
Micro-practice: Pair every offer of help with two concrete modes: I'll do it with you / I'll do it for you (with your ok).`
        }
      ],
      
      growthAreas: [
        {
          title: 'Consent Before Control',
          content: `Pattern: You jump in, decide quickly, and move. Others fall quiet, then later feel overrun.
Why it happens: Speed feels kind; progress feels like relief. Under stress, you equate action with care and mistake silence for consent.
Week-by-week practice:

Week 1: Add a mode check before action: "Do you want action, options, or a listener?"

Week 2: After proposing a mini plan, ask: "What would you change before we start?"

Week 3: Share ownership explicitly: "I'll book; can you confirm by 3 p.m.?"

Week 4: Reflect once: where did consent improve the outcome?
Partner view: With consent, your help feels respectful, not controlling. People mirror your clarity because they feel ownership.
Cost/benefit: You spend 30 seconds; you save hours of rework and resentment.`
        },
        {
          title: 'Right-Sizing Urgency',
          content: `Pattern: Everything becomes "ASAP." Pings multiply. People start ignoring your messages.
Why it happens: You keep a high internal metronome; urgency equals care.
Week-by-week practice:

Week 1: Label tasks: Critical / Important / Next / Backlog. Only one "Critical."
Script: "This is Important, not Critical. I'll bundle updates into a 4:30 note."

Week 2: Switch to predictable cadence: kickoff, mid-point, finish.

Week 3: Add "done for now; polish later" criteria before you start.

Week 4: Audit your last ten messages; remove filler; consolidate.
Partner view: People feel trusted and informed instead of chased.
Cost/benefit: Slightly slower ping rate, much faster adoption and fewer escalations.`
        }
      ],
      
      communicationStyle: `Default style: Plain, specific, time-bound. "What / who / when" in the first sentence.
Best channels: Short written notes for decisions; quick calls for blockers.

Scripts (with context)

Kickoff (work): "Target: draft sent by Friday 3 p.m. I'll outline now; you add examples by noon. We'll review at 4:30."

Consent check (home): "Do you want me to lead, split, or stay nearby while you try?"

Blocker surfacing (logistics): "Blocked on pricing from Ops. I'll ping once today at 2 p.m.; if no reply, I'll propose two paths."

Right-sized urgency: "Not Critical—calling this Important. I'll send a single 4:30 digest."

Repair after over-steer: "I moved fast and may have decided for us. Want to revisit the plan? I can switch to support."

Two-mode offer (health): "I can call with you on speaker, or I'll write the script and you call. Preference?"

Closure: "Loop closed: form submitted, confirmation #4921. Next check-in tomorrow at 9 a.m."

Written vs. verbal

Written: decisions, assignments, and times. Keep to four lines: Outcome / Progress / Blocker / Ask.

Verbal: uncertainty, emotion, and multi-party blockers. End with a one-line written recap.

Repair moves

Name the miss, own your part, re-open consent, and reset cadence. Short and calm beats long and apologetic.`,
      
      frictionPoints: `1) Speed Mismatch
You solve in minutes what others want to explore. People feel rushed.
Repair: Offer two lanes. Script: "Fast track: I'll ship a first pass in 30. Discuss-first: we talk for 15, then I build. Which?"

2) Over-Ownership
You take too much and others disengage.
Repair: Split visible lanes. Script: "I'll own scheduling; can you own confirmations by 3 p.m.? We'll meet at 4:30."

3) Update Fatigue
Frequent pings read as pressure.
Repair: Bundle updates. Script: "I'll send one 4:30 digest with outcome/progress/blockers/asks."

4) Rigid Standards Under Stress
You push for the "right way" when "good enough" will do.
Repair: Define "done for now." Script: "For today, 'done' = client can review. Polish list captured for next sprint."

5) Invisible Emotional Context
You skip the feeling in the room and go straight to tasks.
Repair: Lead with one sentence of empathy. Script: "That morning sounded rough. Two ways I can lighten it today: I can book the calls, or I can sit with you while we do the first one."

6) Delegation Without Clarity
You ask for help but don't specify the finish line.
Repair: Add criteria and a time. Script: "Done looks like three examples and a 150-word intro by 2 p.m."

7) Consent Drift
You got consent once and assume it still holds.
Repair: Re-check at transitions. Script: "We're shifting from draft to scheduling—do you still want me leading, or should we switch to shared?"`,
      
      partnerTranslation: `With Direct Planner (Type 2 — High Directness/Low Tangibility)
Planner frames strategy; you drive immediate outcomes.
Bridge: "Give me five bullets of the model; I'll land the 48-hour win."

With Clear Communicator (Type 3 — High Directness/Mid Tangibility)
Communicator tunes the message; you ensure delivery.
Ritual: "You word the client note; I'll send and confirm receipt by 3 p.m."

With Gentle Giver (Type 4 — Low Directness/High Tangibility)
Both are hands-on; pacing differs.
Bridge: "I'll draft the plan; you temper tone and timing so it feels kind."

With Thoughtful Supporter (Type 5 — Low Directness/Low Tangibility)
Supporter brings patient presence; you bring movement.
Bridge: "You watch energy and suggest rest breaks; I'll move the workload."

With Harmonizer (Type 6 — Low Directness/Mid Tangibility)
They protect relationships; you protect momentum.
Bridge: "Flag ripples; I'll slow the tempo without losing today's step."

With Steady Helper (Type 7 — Mid Directness/High Tangibility)
Great for sustained care; risk is redundancy.
Ritual: "Two lanes: I handle logistics; you handle day-of support. 10 a.m. sync."

With Strategic Partner (Type 8 — Mid Directness/Low Tangibility)
They set arcs; you deliver near-term relief.
Bridge: "Give me the 30-day arc; I'll deliver the first 48-hour milestone."`,
      
      growthPathway: `Goal (90 days): Consent, cadence, calibration.

Weeks 1–2 (Consent): Add a mode check to every new plan and a pre-flight "What would you change?" sentence.
Weeks 3–4 (Cadence): Switch to kickoff → mid-point → finish updates; move to a daily 4:30 digest.
Weeks 5–6 (Calibration): Adopt the four-tier priority (Critical/Important/Next/Backlog). Only one Critical at a time.
Weeks 7–8 (Boundaries): Define "done for now" before you start; keep a separate "polish later" list.
Weeks 9–12 (Scale): Teach the one-minute update to one teammate and hand off one lane fully, with consent checks built in.

What good looks like: People accept your help quickly; rework drops; updates feel predictable, not interruptive; your "Critical" lane stays small and real.`,
      
      kpis: [
        'Consent Rate: % of new initiatives with explicit mode check before action (target ≥ 90%)',
        'Update Rhythm Adherence: % of projects following kickoff/mid/finish cadence (target ≥ 85%)',
        'Rework Incidence: # of tasks re-done due to misalignment per month (target ≤ 1)',
        'Blocker Lead Time: Avg hours from blocker detection to first communication (target ≤ 4 hrs on business days)',
        'Satisfaction Pulse: "Right help at the right time?" average ≥ 4.3/5'
      ],
      
      signatureLexicon: [
        { term: 'Consent check', definition: 'A quick choice before action: action, options, or a listener?' },
        { term: 'Visible plan', definition: 'A short checklist with owners and times that anyone can see' },
        { term: 'Close the loop', definition: 'Send a brief "done" note with what changed and what\'s next' },
        { term: 'Right-sized urgency', definition: 'Label tasks Critical/Important/Next/Backlog so speed fits reality' },
        { term: 'Done for now', definition: 'A clear, temporary finish line that protects momentum' },
        { term: 'Polish later list', definition: 'A separate list for improvements that can wait' },
        { term: 'One-minute update', definition: 'Outcome / progress / blocker / ask in four lines' },
        { term: 'First pass', definition: 'A quick, imperfect draft that others can react to' },
        { term: 'Blocker lead time', definition: 'How fast you signal a problem once you see it' },
        { term: 'Shared lanes', definition: 'Clear split of responsibilities so help doesn\'t become takeover' },
        { term: 'Fast track vs. discuss-first', definition: 'Two paths: ship quickly or align first on approach' },
        { term: 'One critical at a time', definition: 'A constraint that prevents everything from being urgent' },
        { term: 'Empathy first, then steps', definition: 'Acknowledge the feeling before proposing action' },
        { term: 'Outcome by [time]', definition: 'A time-bound target that anchors effort' },
        { term: 'Done & dusted', definition: 'Informal closure phrase signaling true completion' }
      ]
    }
  },
  
  // Profile #2 - Direct Planner (APPROVED - 100/100)
  2: {
    typeNumber: 2,
    typeName: 'Direct Planner',
    directness: 'High',
    tangibility: 'Low',
    
    freeSummary: `Wednesday, 8:10 a.m.: the team is juggling a late client brief, unclear scope, and three competing opinions. The Direct Planner steps in with calm structure. "What outcome by Friday? What constraints? Who owns which lane?" They map the path before anyone sprints, translating chaos into a clean frame: milestones, owners, risks, and review points. Their care shows up as clarity—what matters, what can slide, and how we'll decide.

Core strength: They design the plan that lets everyone move with confidence. By setting objectives, guardrails, and timing, they prevent rework and keep energy focused on the right work.

Growth edge: Over-framing can stall momentum. Under stress, they may over-index on models and delay the first tangible step. Adding a "tiny today" deliverable maintains trust: "We'll ship a draft outline by 3 p.m., then iterate."

Try this today: Before proposing a full roadmap, create a one-page plan with: Goal, Constraints, Three Milestones, Owners, Risks + Mitigations, Next 24-hour deliverable. Share it and ask: "Does this frame help us move? If yes, I'll lock this and we'll deliver the 24-hour piece by 3 p.m." You'll keep your strategic strength and ensure the day still ends with visible progress.`,
    
    premium: {
      fullNarrative: `Direct Planners are the team's navigation system. When inputs are noisy—multiple stakeholders, partial data, changing priorities—they sort signal from noise, set a destination, and chart a route with clear checkpoints. They speak in goals, constraints, and trade-offs. Their default questions—"What's the measurable outcome? What decisions are reversible? What are the real constraints?"—pull the work out of opinion cycles and into a shared frame.

Their updates are crisp: two or three bullets naming progress, risks, and upcoming decisions. They don't need to own every task; they need to ensure the path is sound and visible. That path includes reality checks (time, budget, scope), risk registers, and explicit decision gates. When conditions change, they re-plan early rather than grinding a plan that no longer fits.

Differentiation from adjacent types:
Compared with the Direct Nurturer (Type 1), who translates care into immediate, tangible action, the Direct Planner translates care into direction and design. Type 1 asks, "What lands today?" Type 2 asks, "What's the right path and sequence to land the right thing?" Versus the Clear Communicator (Type 3), who optimizes message clarity and stakeholder alignment, Type 2 optimizes decision quality and execution architecture—the scaffolding that prevents churn. All three share high directness, but Type 2 expresses it in structured framing: objectives → strategy → milestones → owners → risks.

At their best, Direct Planners pair a strong frame with a tiny first deliverable that proves traction. That blend—good plan + small win—keeps morale high and avoids the "all talk, no ship" trap.`,
      
      strengths: [
        {
          title: 'Frames Ambiguity into Actionable Strategy',
          content: `Scene (work): New product brief is fuzzy; timeline is tight.
Script: "Goal: demo-worthy prototype in three weeks. Constraints: two devs, no backend changes. Milestones: clickable mockups (Fri), user test (Wed), prototype (Week 3). Owners: UX, FE. Risks: scope creep; mitigation: change gate at each milestone."
Why it works: The frame turns debate into choices. Everyone sees the path and trade-offs.
Micro-practice: For any ambiguous task, produce a six-line one-pager: Goal / Constraints / Milestones / Owners / Risks / Next-24h deliverable.`
        },
        {
          title: 'Decision Hygiene',
          content: `Scene (leadership): Stakeholders argue features.
Script: "Two-way door vs. one-way door: this is reversible. We'll test Option A this week; fallback to B if metrics lag. Decision by Thursday 4 p.m."
Why it works: Classifying decision types prevents paralysis and lowers fear of trying.
Micro-practice: Label every decision Reversible/Irreversible and set a default review time.`
        },
        {
          title: 'Risk Anticipation & Mitigation',
          content: `Scene (operations): Vendor may slip on parts delivery.
Script: "Risk: supply delay. Mitigation: pre-approve a secondary vendor; place a limited order now to validate lead time."
Why it works: Early mitigations keep plans realistic and resilient.
Micro-practice: Keep a top-5 risk list with owner, likelihood, impact, and next check date.`
        }
      ],
      
      growthAreas: [
        {
          title: 'Avoiding Over-Architecture',
          content: `Pattern: You keep improving the plan while the team waits to move.
Why it happens: You value correctness and hate rework; more detail feels safer.
Week-by-week practice:

Week 1: Add a tiny today rule: every plan includes a deliverable due within 24 hours.

Week 2: Cap initial plans at one page; deeper docs only after the first deliverable ships.

Week 3: Time-box planning to 45 minutes; schedule a revision gate after the first result.

Week 4: Run a post-ship check: what did the tiny deliverable teach us?
Partner view: People trust your planning more when it produces an early win.
Cost/benefit: Slightly less polish up front; big boost in team momentum and learning.`
        },
        {
          title: 'Calibrating Directness with Consent',
          content: `Pattern: You present conclusions as done deals; others feel unheard.
Why it happens: You've already run the logic tree and want to save time.
Week-by-week practice:

Week 1: Open with the problem statement, not the solution.
Script: "Problem: missed demo dates. Hypothesis: too many unvetted features."

Week 2: Offer two frames and invite a vote.
Script: "Option A: freeze scope; Option B: stagger launches. Preference?"

Week 3: Add a "what would you change?" line before locking.

Week 4: Record dissent and include a revisit date.
Partner view: People see their fingerprints on the plan; buy-in rises.
Cost/benefit: Adds minutes; prevents weeks of friction.`
        }
      ],
      
      communicationStyle: `Default style: Structured, concise, decision-oriented. Put Goal/Status/Risks/Next in the first lines.
Best channels: Written briefs for decisions; short standups for risk/coordination.

Scripts (with context)

Kickoff brief: "Goal: reduce onboarding time by 30% in 8 weeks. Constraints: no new headcount. Milestones: audit (Fri), prototype (Week 2), pilot (Week 4). Owners listed below."

Two-door test: "Reversible choice—let's try A for five days; pre-commit to B if activation <40%."

Risk callout: "Top risks: data quality, vendor lead time. Mitigations attached; owners assigned."

Decision ask: "We need a call between scope freeze vs. staggered releases. Please vote by EOD; I'll lock at 5 p.m."

Change gate: "Scope change request: impact +2 days; benefit: reduce churn risk. Approve/decline by 3 p.m."

Tiny-today: "To keep momentum, we'll ship a one-page outline by 3 p.m."

Repair (over-asserted plan): "I jumped to a conclusion. Here are two frames; what would you change before we lock?"

Written vs. verbal

Written: frames, risks, decisions, owners, dates.

Verbal: ambiguity resolution, conflict, and sensitive trade-offs—always followed by a written recap.

Repair moves

Name the assumption, reopen options, record changes, and restate the next milestone with owners.`,
      
      frictionPoints: `1) "Analysis, not action" perception
When plans are thorough but outputs lag, people feel stalled.
Repair: Pair every frame with a 24-hour deliverable.
Script: "We'll test the frame by shipping the outline today; results inform the next pass."

2) Consensus drag
Seeking alignment from everyone slows decisions.
Repair: Define decider/consulted/informed and choose a default by time.
Script: "Decider: PM. Consulted: Eng/Design. If no response by 3 p.m., we proceed."

3) Scope creep via "just this one thing"
Add-ons erode timelines.
Repair: Use a change gate.
Script: "New item adds two days; benefit score is medium. Approve now or move to polish list."

4) Risk under-communication
Risks live in your head; the team is surprised later.
Repair: Publish a top-5 risk list with owners and next check dates.
Script: "Risk #2 (vendor): recheck Thursday 10 a.m.; fallback order ready."

5) Over-certainty tone
Stating the plan as final can shut down input.
Repair: Lead with problem and options; solicit edits before lock.
Script: "Two routes; five-minute reactions now; locking at noon."

6) Metric mismatch
Teams chase outputs that don't match the goal.
Repair: Restate the north-star metric and align milestones to it.
Script: "Success = time-to-value < fifteen minutes. Today's milestone supports that."

7) Status sprawl
Multiple channels, no single source of truth.
Repair: Name a home for plan/status and link it in every update.
Script: "Plan and status live in the 'Launch Frame' doc; updates at 4:30 daily."`,
      
      partnerTranslation: `With Direct Nurturer (Type 1 — High Directness/High Tangibility)
They ship early wins; you ensure the path is right.
Bridge: "I'll frame the sequence; you land the 24-hour deliverable so we learn fast."

With Clear Communicator (Type 3 — High Directness/Mid Tangibility)
They make messages land; you make decisions sound.
Ritual: "I'll craft the decision memo; you tailor the stakeholder version."

With Gentle Giver (Type 4 — Low Directness/High Tangibility)
They bring warmth and hands-on help.
Bridge: "I'll define weekly goals; you set supportive routines that fit the plan's cadence."

With Thoughtful Supporter (Type 5 — Low Directness/Low Tangibility)
They hold space and surface nuance.
Bridge: "I'll propose the structure; you sense-check edge cases and human impact."

With Harmonizer (Type 6 — Low Directness/Mid Tangibility)
They guard trust; you guard direction.
Bridge: "Flag relationship risks early; I'll adjust the plan without losing the goal."

With Steady Helper (Type 7 — Mid Directness/High Tangibility)
They keep care steady; you keep priorities true.
Ritual: "Weekly priorities doc from me; you run the day-of logistics."

With Strategic Partner (Type 8 — Mid Directness/Low Tangibility)
You both like models; they think in arcs.
Bridge: "You sketch the 90-day strategy; I'll translate it into milestones and decision gates."`,
      
      growthPathway: `90-Day Focus: Tiny Today + Decision Hygiene + Risk Rhythm

Weeks 1–2 (Tiny Today): Attach a 24-hour deliverable to every new plan; cap initial frames at one page.

Weeks 3–4 (Decision Hygiene): Label decisions reversible/irreversible; set default revisit dates.

Weeks 5–6 (Risk Rhythm): Maintain a top-5 risk list with owners and weekly check times.

Weeks 7–8 (Consent & Buy-in): Present two frames and invite edits before lock; record dissent.

Weeks 9–12 (Scale): Teach the one-page plan template to a peer; hand off a lane and coach their decision gates.

What good looks like: Plans ship a small proof fast; decisions land on time; risks are surfaced early; fewer change-of-course emergencies.`,
      
      kpis: [
        '24-Hour Deliverable Rate: % of new plans with a shipped "tiny today" item (target ≥ 90%)',
        'Decision Timeliness: % of decisions made by the stated deadline (target ≥ 85%)',
        'Change-Gate Discipline: % of scope adds processed via change gate (target ≥ 90%)',
        'Risk Lead Time: Avg days between risk identification and public mitigation (target ≤ 2)',
        'Rework Reduction: % decrease in rework cycles per project quarter-over-quarter (target ≥ 25%)'
      ],
      
      signatureLexicon: [
        { term: 'One-page plan', definition: 'A six-line frame: Goal/Constraints/Milestones/Owners/Risks/Next-24h' },
        { term: 'Two-way vs. one-way door', definition: 'Reversible vs. irreversible decisions; changes cadence and caution' },
        { term: 'Change gate', definition: 'A simple approval path for scope adds with time/benefit impact' },
        { term: 'Tiny today', definition: 'A small deliverable shipped within 24 hours to create traction' },
        { term: 'Decision memo', definition: 'A brief stating problem, options, chosen path, risks, and next step' },
        { term: 'Risk register', definition: 'Top-5 risks with owners and check dates; visible to all' },
        { term: 'North-star metric', definition: 'The primary success measure shaping milestones' },
        { term: 'Lock window', definition: 'The moment a frame switches from draft to active with recorded dissent' },
        { term: 'Default by time', definition: 'If no responses by a set time, proceed with the stated option' },
        { term: 'Fallback path', definition: 'Pre-agreed alternate route if metrics miss the mark' },
        { term: 'Scope freeze', definition: 'A defined period with no feature adds to protect delivery' },
        { term: 'Single source of truth (SSOT)', definition: 'The canonical location for plan/status docs' },
        { term: 'Milestone review', definition: 'Time-boxed gate to assess progress and adjust risks' },
        { term: 'Owner/Consulted/Informed (OCI)', definition: 'Clear roles that speed decisions' }
      ]
    }
  },
  
  // Profile #3 - Clear Communicator (APPROVED - 100/100)
  3: {
    typeNumber: 3,
    typeName: 'Clear Communicator',
    directness: 'High',
    tangibility: 'Mid',
    
    freeSummary: `Thursday, 9:15 a.m.: the team is circling a problem with five different interpretations. The Clear Communicator listens, distills, and says, "Here's the issue in one line, here's what's decided, and here are the two open questions." They turn noise into a message that lands—short, specific, and aimed at the right audience. In daily life that looks like tight agendas, crisp recaps, and plain-language translations between groups that don't naturally understand each other (finance ⇄ product, parent ⇄ school, patient ⇄ insurance).

Core strength: They make meaning visible and portable. By structuring information and choosing the right words, they reduce confusion, align people quickly, and prevent rework.

Growth edge: Precision can turn sharp under pressure. If they move too fast, tone can feel corrective or cold. A two-step pause—"acknowledge → ask for aims"—keeps clarity connected to care.

Try this today: Before you rewrite anything, ask: "Who is this for, what do they need to do, and what's the minimum they must know?" Then produce a one-minute message with Outcome / Why / What to do / When / Owner. Close with: "Anything missing for your decision?" The result is the same clarity—now shaped to the receiver and delivered with respect.`,
    
    premium: {
      fullNarrative: `The Clear Communicator is the person who can walk into a muddled conversation and create shared understanding in a single page—or a single paragraph. They break complex topics into digestible pieces, surface the decision points, and name the next step without fluff. Their tools are structure, audience awareness, and tone calibration. They notice the gap between what someone intends to say and what others actually hear, then bridge it with simpler language, better sequencing, and an explicit call to action.

At work, they turn sprawling threads into concise decision memos, translate technical updates for executives, and run meetings that start and end on time. At home, they recap school emails into "what matters this week," set expectations kindly but firmly, and diffuse conflicts by reframing accusations into requests. In logistics and health contexts, they turn jargon into plain questions that get answers: "What is the earliest appointment available, and what do I need to bring?"

Differentiation from adjacent types:
Compared with the Direct Nurturer (Type 1), who prioritizes immediate, hands-on help, the Clear Communicator prioritizes message effectiveness—making sure the right person hears the right thing in the right format to act. Versus the Direct Planner (Type 2), who architects the path and decision gates, Type 3 architects the narrative and artifacts that align humans around that path. All three share high directness, but Type 3 expresses it as accurate framing, audience-targeted language, and tight cadences of recap and confirmation.

At their best, Clear Communicators connect clarity with empathy: they start by acknowledging feelings or stakes, then deliver a message that respects people's time and guides the room to action.`,
      
      strengths: [
        {
          title: 'Distills Complexity into Actionable Messages',
          content: `Scene (work): A project has six sub-threads and no owner momentum.
Script: "One-liner: We're blocked on data access. Decision needed: temporary mirror or limited scope. If mirror, infra owns setup by Friday; if limited scope, PM adjusts milestones today."
Why it works: A single sentence frames the problem; explicit options and owners move the group from debate to decision.
Micro-practice: For any messy topic, produce a 5-line message: One-liner, Options (max 2), Owner, Deadline, Ask.`
        },
        {
          title: 'Audience-Aware Translation',
          content: `Scene (leadership): Engineers wrote a detailed update that executives can't parse.
Script: "Executive recap: Risk is data freshness. Impact: churn risk ↑ if not fixed in two weeks. Mitigation: cache v1 ships Friday; KPI: freshness ≥ 95%."
Why it works: The message matches the audience's lens (risk, impact, timing, KPI).
Micro-practice: Identify audience verbs (decide/approve/allocate) and lead with them.`
        },
        {
          title: 'Meeting Hygiene & Closure',
          content: `Scene (logistics/home): Family calendar chaos.
Script: "Agenda (12 minutes): 1) rides for next week, 2) forms due, 3) budget check. Decisions captured; recap text goes out after dinner."
Why it works: A brief agenda sets expectations; a written recap prevents "I thought you said…" loops.
Micro-practice: End every meeting with Recap/Owners/When; send a 4-line summary within 15 minutes.`
        }
      ],
      
      growthAreas: [
        {
          title: 'Tone Softening Under Stress',
          content: `Pattern: Your clean edits can land as criticism. People feel corrected rather than helped.
Why it happens: You associate accuracy with care; speed compresses your empathy.
Week-by-week practice:

Week 1: Add acknowledge → ask before you edit. Script: "I see the work you put in. Who's the primary audience and what do they need to do?"

Week 2: Use two positives + one change when giving feedback.

Week 3: Replace "No, that's wrong" with "Here's how this could land clearer for X—would this version work?"

Week 4: Track reactions. If defensiveness rises, slow your cadence: ask one question before each suggestion.
Partner view: People feel respected and partner with you on clarity, instead of defending their draft.
Cost/benefit: Adds seconds; avoids resistance and escalations.`
        },
        {
          title: 'Clarity vs. Over-Editing',
          content: `Pattern: You keep polishing messages past the point of value.
Why it happens: Precision is rewarding; ambiguity feels risky.
Week-by-week practice:

Week 1: Set a purpose/time box: "Two minutes to get to 80% clarity."

Week 2: Define "good enough": If the message enables the decision, stop.

Week 3: Delegate polishing: "I'll set structure; you tune tone."

Week 4: Build a reusable template library for common scenarios (status, decision, risk).
Partner view: Messages ship faster; others learn your structure and share the load.
Cost/benefit: Minor loss of polish; major gain in throughput and team ownership.`
        }
      ],
      
      communicationStyle: `Default style: Plain-language, audience-first, decision-oriented.
Best channels: Written for decisions and recaps; voice/video for conflict or sensitive nuance; always follow with a short written summary.

Scripts (with context)

Decision memo opener (work): "In one line: choose mirror vs. scope cut. Why: freshness risk. Options: A) mirror (infra, Fri), B) scope cut (PM, today). Ask: Decide by 3 p.m."

Stakeholder alignment (leadership): "For finance: impact is budget variance; for product: impact is time-to-value. Same decision, two messages; both attached."

Repair tone (home): "I came in hot. Let me try again: The goal is getting out by 7:30. What do you need from me—reminders or hands-on help?"

Meeting open (work): "Goal: confirm owner and timeline. Out of scope: feature bikeshedding."

Escalation (ops): "Escalating early: vendor SLA missed twice. Options: short-term credit vs. partial switch. Decision needed by Thursday."

Plain-language translation (health): "In simple terms: test A looks for X. We need A before B because B depends on X."

Closure: "Decision: mirror. Owner: infra. When: Friday EOD. I'll confirm success criteria tomorrow."

Written vs. verbal

Written: decisions, owners, timelines, risks, and recaps.

Verbal: strategy shifts, conflict, emotion-heavy topics—then memorialize in writing.

Repair moves

Acknowledge effort, state shared goal, offer an alternative phrasing, and confirm it works for the audience.`,
      
      frictionPoints: `1) "Sounds like you're correcting me"
Your edits land as judgment.
Repair: Acknowledge → ask → offer.
Script: "This has the right facts. Who's the decider? If it's Ops, would this shorter version help them act today?"

2) Over-communication
People feel flooded with recaps.
Repair: Move to a single daily digest with links; suppress ad hoc pings.
Script: "I'll bundle updates at 4:30; reply there unless urgent."

3) Under-communication of uncertainty
Messages read as absolute; changes later look like backtracking.
Repair: Label confidence and assumptions.
Script: "Confidence: medium; assumption: vendor ships on time. If not, we switch to Option B."

4) Audience misfit
A technical message sent to non-technical readers.
Repair: Split the message by audience.
Script: "Two versions attached: team-level detail and exec recap."

5) Meeting takeover
You steer too tightly; others disengage.
Repair: Time-box, then hand the mic.
Script: "Two minutes to frame, then I'll open for reactions. By :10 we'll pick an owner."

6) Ambiguous ownership in recaps
Clear message, unclear "who does what."
Repair: Add Owner / When / Definition of done.
Script: "Owner: Alex, by Friday. Done = signed PO, confirmation number shared."

7) Tone misses context
Right content, wrong emotional temperature.
Repair: Lead with context.
Script: "Noting a tough week—keeping this short and kind: here's the minimum to move forward."`,
      
      partnerTranslation: `With Direct Nurturer (Type 1 — High Directness/High Tangibility)
They move the first task; you make the ask land.
Bridge: "I'll craft the message that gets yes; you deliver the first visible win by end of day."

With Direct Planner (Type 2 — High Directness/Low Tangibility)
They architect decisions; you ensure the narrative aligns people.
Ritual: "You own the one-page plan; I'll write the decision memo and stakeholder versions."

With Gentle Giver (Type 4 — Low Directness/High Tangibility)
They bring warmth and hands-on help.
Bridge: "I'll set the words and boundaries; you pace the delivery so it feels caring."

With Thoughtful Supporter (Type 5 — Low Directness/Low Tangibility)
They hold space and surface nuance.
Bridge: "You listen for what's unsaid; I'll put the right words on what needs to be said."

With Harmonizer (Type 6 — Low Directness/Mid Tangibility)
They protect relationships; you protect clarity.
Ritual: "You flag any language that could bruise; I'll rewrite for safety without losing the point."

With Steady Helper (Type 7 — Mid Directness/High Tangibility)
They keep care steady; you keep messages steady.
Bridge: "I'll send the weekly plan recap; you execute the logistics and confirm completion."

With Strategic Partner (Type 8 — Mid Directness/Low Tangibility)
They set arcs and narratives across time; you make the near-term message land.
Bridge: "You craft the 90-day story; I'll translate it into this week's asks by audience."`,
      
      growthPathway: `90-Day Focus: Audience First → Tone Calibration → Cadence Discipline

Weeks 1–2 (Audience First): Before any message, write Receiver / Action / Minimum info at the top of your draft; keep the final under one minute.

Weeks 3–4 (Tone Calibration): Practice acknowledge → ask → offer for all feedback and edits; track defensiveness and iterate.

Weeks 5–6 (Cadence): Replace scattered updates with a daily 4:30 digest; reduce ad hoc pings by 50%.

Weeks 7–8 (Templates): Build a three-template library (status, decision, risk); reuse, don't reinvent.

Weeks 9–12 (Scale): Teach your structure to a teammate; hand off one meeting to them and coach the recap quality.

What good looks like: Messages are shorter and land faster; fewer clarifying questions; decisions happen on time; people quote your recaps because they trust them.`,
      
      kpis: [
        'Message Effectiveness: % of decision messages that lead to an on-time decision without follow-up clarification (target ≥ 85%)',
        'Digest Adoption: % of updates bundled into the daily digest vs. ad hoc (target ≥ 80%)',
        'Clarification Rate: Avg clarifying questions per decision (target ≤ 1)',
        'Stakeholder Satisfaction: "I had what I needed, when I needed it" pulse ≥ 4.3/5',
        'Turnaround Time: Avg time from meeting end to written recap (target ≤ 15 minutes)'
      ],
      
      signatureLexicon: [
        { term: 'One-liner', definition: 'A single sentence that names the issue and why it matters' },
        { term: 'Audience verbs', definition: 'The action words the receiver must do (decide/approve/allocate)' },
        { term: 'Decision memo', definition: 'Short doc with Problem / Options / Choice / Risks / Next' },
        { term: 'Recap/Owners/When', definition: 'Three-line closure: what happened, who does what, by when' },
        { term: 'Daily digest', definition: 'A single, predictable window for bundled updates' },
        { term: 'Plain-language pass', definition: 'Jargon replaced with common words a non-expert can act on' },
        { term: 'Confidence label', definition: 'Declared certainty (low/medium/high) and key assumptions' },
        { term: 'Two-versions approach', definition: 'Tailored messages for technical and executive audiences' },
        { term: 'Acknowledge → ask → offer', definition: 'Tone repair sequence for feedback and edits' },
        { term: 'Definition of done', definition: 'The minimum outcome that counts as complete' },
        { term: 'Out of scope', definition: 'Items explicitly excluded to protect focus' },
        { term: 'Receiver/Action/Minimum', definition: 'Pre-draft checklist to keep messages lean' },
        { term: 'Mic drop recap', definition: 'A tight end-of-meeting summary that prevents rehashing' },
        { term: 'Tone check', definition: 'Quick review to match emotional temperature without losing clarity' },
        { term: 'Decision by time', definition: 'Deadline stated in the first lines of a message' }
      ]
    }
  },
  
  // Profile #4 - Gentle Giver (APPROVED - 100/100)
  4: {
    typeNumber: 4,
    typeName: 'Gentle Giver',
    directness: 'Low',
    tangibility: 'High',
    
    freeSummary: `Thursday, 7:20 p.m.: the kitchen's a mess, someone's stuck on a form, and a headache's building. The Gentle Giver doesn't say, "What do you need?" They read the room—sink piled up, laptop open to the same screen—and make a gentle offer that's easy to accept or decline. "I noticed the portal's fighting you. I can sit nearby while you try again, or I can draft the message you'll send—no pressure." They set a glass of water down, lower the noise, and clear the first two minutes of friction so momentum can return. Their help is hands-on but light: a soft start, not a takeover.

Core strength: They reduce burden without raising pressure. With dignity-first help—tidying the space, prepping tools, offering with you / nearby support—they make hard moments feel gentler and more doable.

Growth edge: Subtle offers can be missed, and when a "no thanks" lands, they may retreat. Clearer boundaries and tiny consent checks keep kindness sustainable: "When you're ready, I can set a 10-minute time box and sit nearby."

Try this today: Pair each offer with one boundary and one next step: "I'll set out the forms and start a 10-minute timer; then I'm off to prep dinner." You keep the warmth and add the structure that moves things forward.`,
    
    premium: {
      fullNarrative: `The Gentle Giver is the person who makes hard tasks feel lighter without putting you on the spot. They notice context clues—slower replies, a cluttered desk, a tight tone—and respond with small, tangible relief: a cleared surface, a made cup of tea, a checklist placed where a hand naturally lands. Their help is high tangibility with low directness: not "Do this now," but "I can make this easier if it helps." They prioritize dignity and consent, protecting agency while easing load.

At work, they reduce activation cost: setting up the meeting doc, arranging a quiet corner, or preparing a "first-pass" outline that someone can react to. In logistics, they turn chaos into comfort—bags laid out by the door, meds sorted for the week, a calendar reminder placed gently. In health moments, they translate care into presence: "I'll sit with you while you call," or "I can write the script and you dial when you're ready."

Explicit contrast with neighbors:
Compared with Type 1: Direct Nurturer, who states steps and assigns owners ("I'll book the ride; you pack; we leave in eight"), Type 4 makes invitational moves ("I can drop the kids if that helps"). Both are tangible, but Type 1 is explicit/decisive, Type 4 is suggestive/consent-first. Compared with Type 7: Steady Helper, who uses mid directness to coordinate reliable logistics ("Ping me when you want help and I'll slot it"), Type 4 is even softer, offering companionship, set-up, or quiet co-work without asking others to manage them. The Gentle Giver's signature is quiet action plus choice, so support lands without pressure.

At their best, Gentle Givers pair warmth with two light structures: a consent check and a "done for now" line. That's how their kindness becomes reliable progress, not invisible effort.`,
      
      strengths: [
        {
          title: 'Anticipates Needs Without Being Asked',
          content: `Scene (home): A partner stares at a school portal, overwhelmed.
Script: "I noticed the form keeps failing. I can soft start—I'll set the papers out and sit nearby while you try again—no pressure."
Why it works: The I noticed opener shows care without cornering. A gentle offer with with you / nearby choices preserves autonomy and lowers friction.
Micro-practice: Before you ask, read the room: name one concrete cue, offer two kind options, and include a clear exit ("Wave me off anytime.").`
        },
        {
          title: 'Creates Comfort Through Gentle Presence',
          content: `Scene (health): A friend dreads calling insurance.
Script: "I can write a short script and sit with you while you call—when you're ready."
Why it works: Quiet co-work reduces anxiety and shares the cognitive load without taking control.
Micro-practice: Keep a calm kit: water/tea, 10-minute time box, and a dignity-first phrase ("I'll be here, not hovering.").`
        },
        {
          title: 'Offers Options, Not Directives',
          content: `Scene (work/logistics): A teammate's behind on a report.
Script: "Two easy paths: I prep the template and you fill details, or I highlight three spots to start while I tidy the space. Preference?"
Why it works: Options reduce resistance and invite ownership; the help stays tangible and light.
Micro-practice: Frame every offer as A/B choice + done for now criteria ("Intro + two bullets = good for today.").`
        }
      ],
      
      growthAreas: [
        {
          title: 'Over-Reading Cues (Assuming Needs Without Asking)',
          content: `Pattern: You spot a cue and jump in, but the help misses the mark.
Why it happens: You value easing burdens and avoid putting people on the spot; guessing feels kinder than asking.
Week-by-week practice:

Week 1: Add a consent check to every offer.
Script: "If it helps, I can set a 10-minute timer and sit nearby. Want that or space?"

Week 2: Ask a one-line aim first.
Script: "What would count as done for now today?"

Week 3: Pilot a feedback line.
Script: "If this isn't helpful, please wave me off—really."

Week 4: Review three offers: which landed, which missed, and why.
Partner view: Your help feels respectful because it follows their aim, not your guess.
Cost/benefit: Small pause upfront; big improvement in fit and appreciation.`
        },
        {
          title: 'Disappearing When Boundaries Are Set',
          content: `Pattern: A "No, thanks" feels like rejection; you withdraw and stop offering.
Why it happens: Low directness and a harmony bias; you'd rather be absent than risk being a burden.
Week-by-week practice:

Week 1: Normalize "no pressure" aloud.
Script: "Thanks for saying no—help's here if that changes."

Week 2: Replace retreat with lighter mode.
Script: "I'll leave the checklist on the table; ping when you're ready."

Week 3: Set your edges & handoff.
Script: "I'm free till 6:15; after that, the list's yours."

Week 4: Debrief one "no" that went well; note what kept connection.
Partner view: Your steadiness feels safe; declining help doesn't cost warmth.
Cost/benefit: Less self-doubt; more sustainable offerings and trust.`
        }
      ],
      
      communicationStyle: `Default: invitational, concrete, and consent-first. You write and speak in soft edges that still name specifics.

Scripts (with context)

I noticed opener (home): "I noticed you've been at that screen a while—if it helps, I can print and set everything out."

Choice of mode (work): "Would you like me with you for the first ten minutes, or should I set up a soft start and give you space?"

Time-flex invite (health): "I can call when you're ready—today or tomorrow morning."

No-pressure frame (logistics): "No pressure—I'll put the groceries on the porch; take them in whenever."

Boundary kindly: "I can help until 6:30; then I'll switch to dinner."

Done-for-now line: "Let's call it done for now when the intro's written and the form's saved."

Repair (if offer missed): "I might've been too subtle—want a gentle offer of a timer and quiet company, or would you rather I step back?"

Written vs. verbal

Verbal for warmth, invitations, and tone care.

Written for short checklists and confirmations: What's prepped / Where it is / How to start / When you're ready.

Repair moves

Thank the "no," restate availability, and offer a lighter mode: "Thanks for telling me—when you're ready, I can set out the kit; feel free to wave me off."`,
      
      frictionPoints: `1) Help Feels Intrusive (Arrived Unannounced)
You show up with solutions before consent; the person feels crowded.
Repair: Lead with a consent check and a No-pressure line.
Script: "I noticed it's been a day. If it helps, I can set up a soft start—or I can head out and check in later."

2) Passive-Aggressive After a Decline
A "no" stings; your tone cools or you stop offering.
Repair: Thank the "no" and shift to lighter mode.
Script: "Thanks for saying no. I'll leave the checklist; when you're ready, it's there."

3) Ambiguous Offers ("Let me know if you need anything")
Too vague to use; burden shifts to the other person.
Repair: Offer two concrete options and a time window.
Script: "I can do a 15-minute with you start now, or drop a starter kit by 8—what's easier?"

4) Martyrdom (Over-Giving, Then Resentment)
You give past your edges and feel unseen.
Repair: Use Yes-with-edges + edges & handoff.
Script: "I can help till 6:15; after that I'll be prepping. I'll lay out what's needed and text the list."

5) Mis-Reading Priority
You polish comfort when a deadline is burning.
Repair: Ask the one-line aim first.
Script: "What would count as done for now by 5 p.m.—speed or polish?"

6) Hidden Scorekeeping
You expect reciprocation without asking; tension builds.
Repair: Make a two-option ask kindly.
Script: "Could you handle pickup today, or take tomorrow's dinner while I do tonight's?"

7) Over-Presence
Your hovering adds pressure.
Repair: Switch to nearby with a timer.
Script: "I'll be nearby for ten; wave me off anytime."`,
      
      partnerTranslation: `With Type 1 — Direct Nurturer (High Directness/High Tangibility)
They move fast and name steps; you keep it humane.
Bridge: "You set the plan; I'll create a soft start and keep dignity-first pacing."

With Type 7 — Steady Helper (Mid Directness/High Tangibility) (adjacent mid)
They run reliable logistics; you ease edges and energy.
Ritual: "You own the checklist; I'll prep comfort and gentle reminders when you're ready."

With Type 2 — Direct Planner (High Directness/Low Tangibility) (low tangibility contrast)
They architect paths; you make starts easier.
Bridge: "You ship the one-page plan; I'll stage tools and a time box so the first step lands."

With Type 5 — Thoughtful Supporter (Low Directness/Low Tangibility) (low tangibility contrast)
They hold reflective space; you add hands.
Ritual: "You mirror priorities; I'll set the soft start and sit with you for the first ten."

With Type 3 — Clear Communicator (High Directness/Mid Tangibility)
They craft messages; you craft conditions.
Bridge: "You send the decision note; I'll set the room and water breaks so the work lands gently."

With Type 6 — Harmonizer (Low Directness/Mid Tangibility)
They balance roles; you reduce friction.
Ritual: "You coordinate fair trades; I'll keep the environment calm and the handoffs dignity-first."

With Type 8 — Strategic Partner (Mid Directness/Low Tangibility)
They set arcs; you make daily practice doable.
Bridge: "You shape the 30-day story; I'll build the soft routines that keep it humane."`,
      
      growthPathway: `90-Day Focus: Consent → Boundaries → Sustainable Presence

Weeks 1–2 (Consent): Add a consent check to every offer; use I noticed + if it helps + two options.

Weeks 3–4 (Boundaries): Practice Yes-with-edges twice a week; add edges & handoff ("I'm free till 6:15; list's on the counter after").

Weeks 5–6 (Starts & Finishes): Use a 10-minute time box and define done for now before starting.

Weeks 7–8 (After "No"): Thank the "no," leave a lighter mode (checklist/kit), and schedule a gentle when you're ready window.

Weeks 9–12 (Scale): Teach the soft start method to a teammate/partner; create a shared "starter kit" checklist for recurring tasks.

What good looks like: Offers land more often; "no" doesn't end connection; you feel resourced because edges are known; tasks move with humane pacing.`,
      
      kpis: [
        'Consent Rate: % of offers that include an explicit consent check (target ≥ 90%)',
        'Boundary Respect: % of declined offers where you maintain lighter mode contact rather than withdrawing (target ≥ 85%)',
        'Offer Clarity Score: % of offers containing two options + time window + done-for-now line (target ≥ 80%)',
        'Time-Box Adoption: % of starts that use a 10-minute time box (target ≥ 75%)',
        'Satisfaction Pulse: "Felt supported without pressure?" average ≥ 4.5/5'
      ],
      
      signatureLexicon: [
        { term: 'Read the room', definition: 'Notice concrete cues (space, pace, tone) before offering help' },
        { term: 'Gentle offer', definition: 'An invitational, no pressure suggestion with consent baked in' },
        { term: 'I noticed opener', definition: 'Context-first line that shows care without cornering' },
        { term: 'When you\'re ready', definition: 'Time-flex invitation that respects autonomy' },
        { term: 'No pressure', definition: 'Explicit permission to decline without cost to the relationship' },
        { term: 'Soft start', definition: 'Preparing the first two minutes so activation is easy' },
        { term: 'With you / nearby', definition: 'Two modes of presence: companion or quiet proximity' },
        { term: 'Time box', definition: 'A short, safe window (often ten minutes) to try the first step' },
        { term: 'Done for now', definition: 'A humane finish line that protects momentum and dignity' },
        { term: 'Dignity-first', definition: 'Help that preserves choice, pace, and privacy' },
        { term: 'Edges & handoff', definition: 'Stated limits plus who takes the next step and when' },
        { term: 'Lighter mode', definition: 'A reduced-intensity way to help (checklist/kit) after a decline' },
        { term: 'Kind options', definition: 'Two concrete choices that keep agency with the other person' },
        { term: 'Calm kit', definition: 'Small comforts (water, tidy sweep, timer) that lower stress' }
      ]
    }
  },
  
  // Profile #5 - Thoughtful Supporter (APPROVED - 99/100)
  5: {
    typeNumber: 5,
    typeName: 'Thoughtful Supporter',
    directness: 'Low',
    tangibility: 'Low',
    
    freeSummary: `Monday, 8:50 p.m.: a friend is stressed about a tough email and a doctor appointment. The Thoughtful Supporter doesn't rush to fix or take over. They make space. "Tell me what matters most here," they say, listening for what's underneath. They ask two calm questions, reflect back the key points, and help the person hear their own priorities. Their care shows up as attentive presence, clear mirroring, and gentle questions that unlock better choices. Instead of "Do this," it's "What outcome would feel right?" and "What's a kind way to start?"

Core strength: They create psychological safety. People feel seen, not judged, and leave conversations clearer, steadier, and more self-directed.

Growth edge: Indirectness can slip into passivity. When stakes rise, they may hesitate to name concerns or request concrete next steps. Adding small structure—one reflective summary and one invitation to choose—keeps the talk useful.

Try this today: After listening for two minutes, offer a mirror + choice: "Here's what I heard: A (important), B (worry), C (deadline). Do you want a brainstorming partner, a quick script, or just quiet company while you write?" If they pick one, time-box it: "Let's try ten minutes and check how it feels." You stay gentle while nudging momentum.`,
    
    premium: {
      fullNarrative: `The Thoughtful Supporter is the person who helps you hear yourself. When life gets noisy—conflicting advice, stacked tasks, tight budgets—they slow the moment so the signal comes back. Their tools are presence, perspective, and permission. They listen for values, worries, and unspoken constraints; they reflect back "what matters most" in plain words; and they ask kind questions that return agency to the other person. In practice, that looks like quiet co-working, note-taking while you talk, or reframing a tangle into three choices that actually fit your life.

At work, they steady teams during change: clarifying goals, summarizing agreements, and inviting quieter voices. They don't steer by force; they steer by attention. At home, they lower the emotional volume: "Let's breathe once; what would make tomorrow feel easier?" In health and logistics, they help people prepare: listing questions for a doctor, rehearsing a hard call, or mapping pros/cons without pressure. Their default setting is dignity: they believe people do better when they feel safe and capable.

Differentiation from adjacent types:
Compared with the Gentle Giver (Type 4), who eases the moment with hands-on help, Type 5 eases the mind with patience and perspective. Versus the Harmonizer (Type 6), who actively mediates and organizes interactions, Type 5 primarily holds space and reflects, letting others find their own pace and answers. All three show care softly; Type 5's signature is reflective presence—calm, curious, and non-directive—paired with light structure when needed.

At their best, Thoughtful Supporters combine deep listening with a small nudge: a summary, a choice, or a ten-minute time box that turns clarity into a first step.`,
      
      strengths: [
        {
          title: 'Reflective Listening that Clarifies',
          content: `Scene (work): Two teammates disagree about scope.
Script: "Let me check what I'm hearing: you want predictability; you want speed. Shared goal is a stable demo next Friday. Is that right?"
Why it works: Mirroring reduces defensiveness and pins shared aims, making decisions easier.
Micro-practice: Use the Two-Minute Mirror: summarize goal, concern, constraint in three lines before any suggestion.`
        },
        {
          title: 'Gentle Questioning that Restores Agency',
          content: `Scene (health): A partner fears a specialist visit.
Script: "What answer would make this appointment feel worth it? What's a kind way to ask for that?"
Why it works: Values-first questions move from fear to purpose; the person chooses wording that fits them.
Micro-practice: Ask purpose / path / protection: What matters? What's a small next step? How do we keep it humane?`
        },
        {
          title: 'Calm Under Pressure',
          content: `Scene (home/logistics): Flight delayed; plans wobble.
Script: "One breath. What's the non-negotiable? Okay—arrival tonight. Options: later flight or morning train. Which feels steadier?"
Why it works: A slow tone + clear options preserves thinking power during stress.
Micro-practice: Breathe—Name—Choose: one breath, name the priority, offer two options.`
        }
      ],
      
      growthAreas: [
        {
          title: 'From Listening to Light Structure',
          content: `Pattern: You hold space well, but next steps stay vague.
Why it happens: You avoid steering; you fear pushing someone into your answer.
Week-by-week practice:

Week 1: End every conversation with a one-line mirror + choice of mode (brainstorm/script/quiet co-work).

Week 2: Add a ten-minute time box to the chosen mode.
Script: "Let's try ten minutes together; if it's not helping, we pause."

Week 3: Introduce "done for now" criteria before starting.

Week 4: Track outcomes; notice where light structure helped momentum.
Partner view: Your softness now produces action, not just relief.
Cost/benefit: Minimal direction; clearer finish lines and progress.`
        },
        {
          title: 'Naming Your Own Needs (Kindly, Clearly)',
          content: `Pattern: You over-accommodate, then feel drained or quietly resentful.
Why it happens: Low directness; you equate asking with burdening others.
Week-by-week practice:

Week 1: Practice a Gentle Ask daily.
Script: "Could you take the call at six so I can decompress?"

Week 2: Add time and boundary.
Script: "I can help until eight; after that I need quiet."

Week 3: Share a capacity snapshot once.
Script: "I'm at a seven of ten today; I can do two tasks, not five."

Week 4: Acknowledge help and impact.
Partner view: People understand your limits and respond fairly.
Cost/benefit: Brief discomfort; sustained energy and trust.`
        }
      ],
      
      communicationStyle: `Default style: Warm, slow-to-solve, quick-to-clarify. Short reflections and open questions lead; suggestions are invitations.

Scripts (with context)

Two-Minute Mirror (work): "Goal I'm hearing is X; main worry is Y; constraint is Z. Did I miss anything?"

Choice of mode (home): "Do you want a brainstorming partner, a script to start with, or quiet company while you try?"

Gentle Ask (self-advocacy): "Could you handle dishes tonight so I can reset?"

Time-box invite: "Want to try ten minutes and see how it feels?"

Values-first prompt (health): "What would make this appointment feel useful to you?"

Conflict softener (work): "I think we're protecting two good things—speed and quality. How can we keep both enough for Friday?"

Done-for-now line: "Let's call it 'done for now' when the intro is drafted and we've listed questions."

Written vs. verbal

Verbal: listening, mirroring, tone-sensitive moments.

Written: brief recaps of agreements: What we decided / Why it matters / First step / When / Owner. Keep to five lines.

Repair moves

If you waited too long to speak:
Script: "I held back and that may have slowed us. Here's what I'm seeing, and I'm open to edits."

If your questions felt evasive:
Script: "Let me be plainer: I'm concerned about the deadline. Do you want help mapping risks?"`,
      
      frictionPoints: `1) Passivity Perception
Your listening reads as avoidance.
Repair: Add the one-line mirror + choice at the five-minute mark.
Script: "Here's what I'm hearing… Do you want brainstorming, a script, or quiet co-work?"

2) Unclear Boundaries
People assume your availability is unlimited.
Repair: Use Gentle Ask and Yes-with-edges (borrowed from Type 4).
Script: "I can sit with you until 7:30, then I need to prep tomorrow."

3) Decision Drift
Good talk, no choice.
Repair: Offer two viable options and invite the pick.
Script: "Option A meets the deadline; Option B keeps quality. Which fits today?"

4) Emotional Absorption
You take on others' feelings and feel heavy.
Repair: Name what's yours vs. theirs; suggest a micro-break.
Script: "I'm noticing my shoulders up—that's my cue to pause. Tea or a short walk?"

5) Over-Qualifying Your View
You add ten disclaimers before a simple point.
Repair: Use Plain Claim + Check.
Script: "Plainly: the plan risks Friday. Does that match your sense?"

6) Asking Without Timing
Requests lack when/what, so help doesn't land.
Repair: Add time and a "done for now."
Script: "Could you review by noon? 'Done for now' = notes on sections 1–2."

7) Vague Recaps
People forget agreements.
Repair: Five-line recap rule.
Script: "Decided: A. Why: timing. First step: draft by 3. Owner: Lina. Check: 4:30."`,
      
      partnerTranslation: `With Gentle Giver (Type 4 — Low Directness/High Tangibility)
They bring hands; you bring headspace.
Bridge: "I'll help name priorities; you prepare the space and timer."

With Harmonizer (Type 6 — Low Directness/Mid Tangibility)
They manage group balance; you deepen individual clarity.
Ritual: "You run the agenda; I'll mirror themes and invite quieter voices."

With Steady Helper (Type 7 — Mid Directness/High Tangibility)
They sustain logistics; you sustain morale.
Bridge: "You own the checklist; I'll check energy and capture concerns for the next sync."

With Strategic Partner (Type 8 — Mid Directness/Low Tangibility)
They set arcs; you surface values and risks that matter to people living the plan.
Bridge: "You outline the 90-day story; I'll host listening sessions and summarize what must be protected."

With Direct Nurturer (Type 1 — High Directness/High Tangibility)
They move fast; you ensure consent and fit.
Ritual: "Before we act, I'll check 'what matters' and 'what would you change?' Then you land the first step."

With Direct Planner (Type 2 — High Directness/Low Tangibility)
They decide sequence; you reveal lived constraints.
Bridge: "I'll gather ground truth from the team; you adjust milestones accordingly."

With Clear Communicator (Type 3 — High Directness/Mid Tangibility)
They craft messages; you ensure people feel heard first.
Ritual: "You send the decision note; I'll facilitate a short Q&A so concerns get aired."`,
      
      growthPathway: `90-Day Focus: Mirror & Choice → Time-Box → Self-Advocacy

Weeks 1–2: End each conversation with mirror + mode (brainstorm/script/quiet).

Weeks 3–4: Add a ten-minute time box and define done for now before starting.

Weeks 5–6: Practice Gentle Ask daily; add Yes-with-edges twice weekly.

Weeks 7–8: Build a three-template recap (five-line format) for work/home/health.

Weeks 9–12: Facilitate one small decision meeting: mirror themes, surface two options, invite the pick, send a five-line recap.

What good looks like: People leave calmer and clearer; choices happen in-session; your energy stays steady because boundaries are known.`,
      
      kpis: [
        'Mirror-to-Action Rate: % of conversations that end with a chosen mode + first step (target ≥ 85%)',
        'Time-Box Adoption: % of sessions using a ten-minute block and "done for now" line (target ≥ 80%)',
        'Gentle Ask Success: # of self-advocacy requests made/accepted per week (target ≥ 2 accepted)',
        'Decision Closure: % of meetings ending with two options → one choice → five-line recap (target ≥ 75%)',
        'Satisfaction Pulse: "Felt heard and left clearer?" average ≥ 4.5/5'
      ],
      
      signatureLexicon: [
        { term: 'Two-Minute Mirror', definition: 'A three-line summary of goal, concern, constraint' },
        { term: 'Choice of mode', definition: 'Invitation to pick brainstorm / script / quiet co-work' },
        { term: 'Gentle Ask', definition: 'Clear, kind request for help or time' },
        { term: 'Time box', definition: 'Ten-minute block to try a step without pressure' },
        { term: 'Done for now', definition: 'A small, humane finish line that preserves energy' },
        { term: 'Plain Claim + Check', definition: 'One-sentence view followed by a quick accuracy check' },
        { term: 'Breathe—Name—Choose', definition: 'Regain calm, name the priority, offer two options' },
        { term: 'Capacity snapshot', definition: 'Simple self-state of current bandwidth (e.g., "seven of ten")' },
        { term: 'Values-first', definition: 'Start with what matters before choosing a path' },
        { term: 'Quiet co-work', definition: 'Sitting nearby in supportive silence while someone works' },
        { term: 'Soft lane', definition: 'Non-directive support tasks (note-taking, reflecting, pacing)' },
        { term: 'Five-line recap', definition: 'Decided / Why / First step / When / Owner summary' },
        { term: 'Permission to pause', definition: 'Explicit invite to stop if the step isn\'t helping' },
        { term: 'Kind options', definition: 'Two choices framed to protect dignity' },
        { term: 'Steadying question', definition: 'A short prompt that slows panic and restores focus' }
      ]
    }
  },
  
  // Profile #6 - Harmonizer (APPROVED - 99/100)
  6: {
    typeNumber: 6,
    typeName: 'Harmonizer',
    directness: 'Low',
    tangibility: 'Mid',
    
    freeSummary: `Tuesday, 5:05 p.m.: the team chat is spiking—missed handoff, tense emojis, and a demo tomorrow. The Harmonizer doesn't wade in with orders or disappear to avoid the heat. They steady the room. "We all want a clean demo. Here's what I'm seeing: two overlaps and one gap. Let's trade one, cover the gap, and check at 6:00." They translate friction into fair exchanges, reset expectations, and restore flow. In daily life that looks like smoothing handoffs ("I'll text when I'm five minutes out"), aligning schedules, and naming shared goals so people stop pulling in opposite directions.

Core strength: They protect trust while keeping things moving. By coordinating roles, clarifying expectations, and timing check-ins, they prevent small snags from becoming rifts.

Growth edge: Avoiding direct asks can delay fixes. Under pressure, they may over-negotiate or carry silent resentment. Gentle specificity—one clear ask, one time, one definition of "done for now"—keeps harmony honest and effective.

Try this today: When tension rises, lead with a shared aim ("We want X by Y"), then offer a fair trade: "I'll slide task A to you if you can cover B; I'll confirm the draft by 7:00." Close with one check time. You'll lower the temperature and still land a result people can accept.`,
    
    premium: {
      fullNarrative: `Harmonizers are glue. When wires cross, they notice early—tone shifts, late replies, the "I thought you meant…" They don't bulldoze solutions; they rebalance commitments so work and relationships can both win. Their default tools are shared goals, fair trades, explicit handoffs, and light cadence. They surface misunderstanding without blame, choose language everyone can live with, and keep small agreements visible so momentum returns.

At work, they reframe conflict as coordination: "Same goal, different assumptions—let's pick whose assumption rules for today." They write short alignment notes that name who/when/what good looks like, and they break "both/and" fights into sequenced steps. In logistics and home life, they protect sanity with calendars, buffers, and check-ins at the edges ("text when you depart"). In health contexts, they balance competing needs—rest vs. schedule—by proposing humane swaps and shared criteria for "enough."

Differentiation from adjacent types:
Compared with the Thoughtful Supporter (Type 5), who primarily offers reflective presence, the Harmonizer adds coordinating action—budgets of time/attention, trade-offs, and micro-agreements. Versus the Steady Helper (Type 7), who leans into hands-on logistics with mid-level directness, Type 6 keeps the relational field calm and the coordination clean, even when they aren't the one doing the task. All three are gentle; Type 6's signature is group balance—tuning pacing, roles, and expectations so people stay connected and deliver.

At their best, Harmonizers pair kindness with gentle specificity: one shared aim, one fair trade, one check-in—enough structure to move, soft enough to keep trust intact.`,
      
      strengths: [
        {
          title: 'Makes Shared Aims Explicit',
          content: `Scene (work): Design and engineering argue scope.
Script: "Shared aim: a stable demo by Friday. Today favors stability. Can we park 'nice-to-have' until Monday?"
Why it works: Naming the joint goal lowers defensiveness and provides a neutral tie-breaker.
Micro-practice: Start any tense thread with "Shared aim:" then propose today's bias (speed, stability, kindness).`
        },
        {
          title: 'Creates Fair Trades',
          content: `Scene (home/logistics): Two chores collide with one car.
Script: "If I do pickup and dishes, could you take bedtime and trash? I'll text when I leave."
Why it works: Reciprocity feels fair; explicit swaps prevent scorekeeping.
Micro-practice: Frame conflicts as A↔B exchanges with times and finish lines.`
        },
        {
          title: 'Cleans Up Handoffs',
          content: `Scene (ops): Work keeps stalling between teams.
Script: "Handoff clarity: Owner, artifact, time, and 'done for now' criteria. I'll draft the template; we trial it this week."
Why it works: Clear edges reduce rework and resentment.
Micro-practice: Use Handoff-4: Owner / Artifact / Time / Criteria on every pass.`
        }
      ],
      
      growthAreas: [
        {
          title: 'From Hints to Gentle Specifics',
          content: `Pattern: You hint at needs ("It might help if…") and hope others infer. Fixes arrive late or not at all.
Why it happens: Low directness; you protect harmony by avoiding potential conflict.
Week-by-week practice:

Week 1: Replace hints with one-sentence asks.
Script: "Could you confirm by 3:00 that you've got the draft?"

Week 2: Add criteria.
Script: "'Done for now' = title, intro, and two bullets."

Week 3: Add a check time to reduce chasing.
Script: "I'll check at 4:30 unless you ping earlier."

Week 4: Review where specificity sped relief.
Partner view: Your requests feel easy to meet; no mind-reading required.
Cost/benefit: A few clear lines; big drop in friction.`
        },
        {
          title: 'Naming Boundaries Before Resentment',
          content: `Pattern: You absorb extra work to keep peace, then feel used.
Why it happens: You equate saying "no" with breaking trust.
Week-by-week practice:

Week 1: Use Kind No + Path once.
Script: "I can't take the late slot tonight; could we swap with tomorrow's?"

Week 2: Offer a fair trade instead of a blanket no.

Week 3: Publish availability windows for recurring tasks.

Week 4: Debrief with yourself: resentment dropped?
Partner view: Your steadiness feels reliable instead of hidden.
Cost/benefit: Short discomfort; sustained goodwill.`
        }
      ],
      
      communicationStyle: `Default style: Calm, inclusive, and coordination-forward. Lead with shared aim, follow with fair trade or clean handoff, end with check time.

Scripts (with context)

Shared aim reset (work): "Shared aim is a clean Friday demo. Today we prioritize stability; polish goes to Monday."

Fair trade (home): "I'll handle groceries if you can cover bedtime; I'll text ETA."

Handoff-4 (ops): "Owner: Priya. Artifact: draft v1. Time: 3:00. Criteria: title + intro + two bullets."

Kind No + Path: "I can't join the late call; I can send a summary and collect questions by morning."

Edge check (health): "Does it help to pause ten minutes now and call the clinic together, or should we schedule for tomorrow?"

Tone buffer: "We're on the same side and the clock is loud; here's a version that might land easier."

Single check time: "I'll check at 6:00; if you're still deep in it, just thumbs-up and we'll slide the review."

Written vs. verbal

Verbal: tense moments, trade proposals, boundary lines.

Written: alignment notes capturing Shared aim / Trade / Handoff-4 / Check time in four lines.

Repair moves

If you over-accommodated:
Script: "I said yes to too much. Here's a fair swap that keeps us whole: I'll finish A if you take B tomorrow."`,
      
      frictionPoints: `1) Slow to Ask, Fast to Please
You take on extra work to keep peace; burnout follows.
Repair: Use Kind No + Path and publish availability.
Script: "I'm off after eight; I can pick this up at 7:30 a.m. or trade for tomorrow's shift."

2) Vagueness at the Handoff
"I thought you had it."
Repair: Run Handoff-4 every time.
Script: "Owner/Artifact/Time/Criteria—do we all agree?"

3) Triangling
People vent to you about each other; you become the complaint hub.
Repair: Route to direct dialogue with a bridge.
Script: "I hear you. Would you like me to host a five-minute reset with both of you? I'll open with the shared aim."

4) Harmony Over Honesty
You edit out your true view; issues persist.
Repair: Use Plain Claim + Check (softened).
Script: "Gently: the current plan risks Friday. Does that match your sense, or am I missing something?"

5) Endless Consensus
Alignment loops block decisions.
Repair: Propose a default by time with a fair trade.
Script: "If no objections by 3:00, we go with Option B; I'll take the extra QA to balance the load."

6) Unowned Edges
People forget who confirms what and when.
Repair: End threads with one check time and one owner.
Script: "Check: 4:30. Owner: Luis. We'll call it 'good for demo' if criteria are met."

7) Emotional Spillover
You absorb tension and get foggy.
Repair: Take a two-minute buffer and name the shared aim again.
Script: "Quick reset: same goal—clean demo. Two swaps and one check should get us there."`,
      
      partnerTranslation: `With Direct Nurturer (Type 1 — High Directness/High Tangibility)
They move fast; you keep the lane safe.
Bridge: "You land the first step; I'll align edges and check times so no one gets clipped."

With Direct Planner (Type 2 — High Directness/Low Tangibility)
They design gates; you protect relationships through those gates.
Ritual: "You own milestones; I'll manage fair trades at each handoff."

With Clear Communicator (Type 3 — High Directness/Mid Tangibility)
They craft the message; you ensure it sits well with the group.
Bridge: "You write the decision note; I'll host a short read-through to catch tone and ownership gaps."

With Gentle Giver (Type 4 — Low Directness/High Tangibility)
They bring comfort; you bring coordination.
Ritual: "You soften the environment; I'll align roles and timers so the help lands."

With Thoughtful Supporter (Type 5 — Low Directness/Low Tangibility)
They hold space; you turn it into small agreements.
Bridge: "You mirror priorities; I'll suggest a fair trade and set the check time."

With Steady Helper (Type 7 — Mid Directness/High Tangibility)
They keep logistics humming; you keep people aligned.
Ritual: "You run the checklist; I'll watch load balance and propose swaps when needed."

With Strategic Partner (Type 8 — Mid Directness/Low Tangibility)
They set arcs; you protect cohesion as plans evolve.
Bridge: "You set the 30-day arc; I'll pace the group and maintain healthy handoffs."`,
      
      growthPathway: `90-Day Focus: Shared Aim → Fair Trades → Clean Handoffs

Weeks 1–2 (Shared Aim): Open every tense thread with shared aim + today's bias (speed/stability/kindness).

Weeks 3–4 (Fair Trades): Replace "I'll just do it" with an A↔B swap that names time and criteria.

Weeks 5–6 (Handoff-4): Apply Owner/Artifact/Time/Criteria to all passes; add one daily check time habit.

Weeks 7–8 (Boundaries): Practice Kind No + Path twice weekly; publish availability windows for recurring asks.

Weeks 9–12 (Scale): Teach Handoff-4 to the team; create a shared template and nudge others to use it.

What good looks like: Less rework; kinder tone under pressure; clear edges at every pass; you feel steady because fairness and timing are explicit.`,
      
      kpis: [
        'Handoff Clarity Rate: % of passes using Handoff-4 (target ≥ 90%)',
        'Fair-Trade Adoption: # of explicit swaps per week that replace silent over-giving (target ≥ 3)',
        'Consensus Cycle Time: Avg hours from tension to stated shared aim + decision path (target ≤ 4)',
        'Resentment Indicator: Self-reported "carrying too much" days per month (target ≤ 2)',
        'Satisfaction Pulse: "Felt heard and treated fairly?" average ≥ 4.4/5'
      ],
      
      signatureLexicon: [
        { term: 'Shared aim', definition: 'The common outcome that guides choices under pressure' },
        { term: 'Today\'s bias', definition: 'Declared tilt (speed, stability, kindness) to resolve trade-offs' },
        { term: 'Fair trade', definition: 'A reciprocal swap that balances effort or timing' },
        { term: 'Handoff-4', definition: 'Owner / Artifact / Time / Criteria—clarity at the pass' },
        { term: 'Kind No + Path', definition: 'A polite refusal paired with a workable alternative' },
        { term: 'Edge check', definition: 'A quick confirmation at boundaries (start/stop/ownership)' },
        { term: 'Single check time', definition: 'One named moment to prevent constant chasing' },
        { term: 'Default by time', definition: 'Proceeding with the stated option if no objections by a deadline' },
        { term: 'Tone buffer', definition: 'A softening phrase that lowers heat without losing clarity' },
        { term: 'Load balance', definition: 'Visible distribution of tasks to keep effort fair' },
        { term: 'Bridge invite', definition: 'Offer to host a short reset with parties in conflict' },
        { term: 'Good for demo', definition: 'Practical "done for now" criteria aligned to the next event' },
        { term: 'Complaint to contact', definition: 'Redirecting venting into a brief, direct conversation' }
      ]
    }
  },
  
  // Profile #7 - Steady Helper (APPROVED - 99/100)
  7: {
    typeNumber: 7,
    typeName: 'Steady Helper',
    directness: 'Mid',
    tangibility: 'High',
    
    freeSummary: `Wednesday, 6:55 a.m.: lunches half-made, permission slip missing, the dog needs out. The Steady Helper doesn't panic or bark orders. They slide into motion with calm logistics and clear check-ins: "I'll finish lunches and start the car. Can you sign the slip by 7:05?" They're hands-on like Type 1 and Type 4, but their mid directness shows up as friendly coordination—specific asks, simple cadences, and predictable follow-through. You'll see lists updated, reminders sent, and small blockers handled before they become big ones.

Core strength: Consistency. They keep routines humming with visible plans, reasonable tempo, and practical support you can count on—pickup schedules, supply runs, quiet confirmations.

Growth edge: Over-reliance on routines can make them rigid under change. When stress hits, they may keep doing more instead of renegotiating scope. Adding a quick consent check and a "right-sized urgency" label ("Critical vs. Important") keeps help aligned and sustainable.

Try this today: Use the Two-Lane Offer—"I can own the logistics or split it: I do setup; you confirm by 4:30." Add a check time ("I'll text at 4:15 if anything's missing") and a done for now line. You'll protect your steady rhythm while making room for feedback and change.`,
    
    premium: {
      fullNarrative: `The Steady Helper is the engine of reliable care. They turn good intentions into repeatable routines: calendars updated, supplies stocked, reminders placed, rides coordinated. Their style is mid directness—clear and friendly without the edge of command. They'll say, "I'll place the order now; can you confirm the address by 3?" rather than "Do it now" or "I already did it." People lean on them because they create predictable scaffolding for busy days and tough weeks.

At work, they keep operations smooth—agenda sent, notes captured, follow-ups tracked, vendor calls placed. In logistics, they prevent failure points: label the bins, pre-pack the kit, set the night-before checklist. In health contexts, they set reminders, assemble medication packs, and accompany someone to appointments with a calm, grounded presence. Their default tempo is steady: kickoff → mid-point check → finish, with short status notes that close loops.

Differentiation from adjacent types:
Versus Type 1: Direct Nurturer (High Directness/High Tangibility), who decides quickly and drives immediate action ("We leave in eight"), Type 7 prefers stable cadence and shared lanes ("I'll finish lunches; can you sign by 7:05?"). Compared with Type 4: Gentle Giver (Low Directness/High Tangibility), who helps softly and invitationally, Type 7 is more explicit—they make concrete offers and requests while keeping tone warm. Relative to Type 8: Strategic Partner (Mid Directness/Low Tangibility), who shapes arcs and frameworks, Type 7 stays in hands-on logistics, translating plans into dependable routines.

At their best, Steady Helpers pair structure with flexibility: clear roles, a single check time, and a right-sized urgency label. That's how steadiness becomes scalable instead of heavy.`,
      
      strengths: [
        {
          title: 'Predictable Cadence that Lowers Stress',
          content: `Scene (work): Weekly release keeps slipping due to scattered updates.
Script: "Cadence: kickoff Monday 10, mid-check Wednesday 3, finish Friday 1. I'll send a one-minute update each time."
Why it works: Rhythm reduces uncertainty; fewer surprises mean fewer escalations.
Micro-practice: Adopt Kick–Mid–Finish on every recurring effort; calendar the three times up front.`
        },
        {
          title: 'Clean Logistics & Early Blocker Surfacing',
          content: `Scene (logistics): Field trip tomorrow; forms and snacks are chaotic.
Script: "I'll print forms and pack snacks; can you confirm allergies by 4:30? I'll text if we're missing anything."
Why it works: Concrete prep plus a check time prevents last-minute scrambles.
Micro-practice: Run a 24-hour pre-check for any event: supplies / confirmations / timing.`
        },
        {
          title: 'Shared Lanes with Friendly Accountability',
          content: `Scene (health/home): PT exercises keep getting skipped.
Script: "I'll set a 6:30 reminder and lay out the mat; can you text 'done' by 7?"
Why it works: Visible roles + minimal ask creates follow-through without nagging.
Micro-practice: Use Two-Lane Offer: I own setup; you own confirm by time.`
        }
      ],
      
      growthAreas: [
        {
          title: 'Flexing Routine Under Change',
          content: `Pattern: When plans shift, you double down on the old schedule instead of re-scoping.
Why it happens: Routines feel safe and respectful; changing them feels like dropping the ball.
Week-by-week practice:

Week 1: Add a consent check at the first sign of change.
Script: "Want me to keep the usual cadence, or is today a single 6 p.m. check-in better?"

Week 2: Label right-sized urgency (Critical/Important/Next). Only one "Critical."

Week 3: Insert a swap plan.
Script: "If we skip mid-check, I'll send a fuller digest at 6."

Week 4: Review outcomes; note where flexibility saved energy.
Partner view: People feel considered, not managed.
Cost/benefit: Minor plan edits; stronger trust and fewer apology scrambles.`
        },
        {
          title: 'Avoiding Quiet Over-Ownership',
          content: `Pattern: You silently take on extra tasks to keep things smooth, then feel under-acknowledged.
Why it happens: Mid directness + care for stability; it seems faster to do it yourself.
Week-by-week practice:

Week 1: Make micro-asks explicit.
Script: "Could you confirm RSVPs by noon while I handle transport?"

Week 2: Publish edges & handoff.
Script: "I can own setup until 6; after that, please text status."

Week 3: Add a single source of truth (SSOT).
Script: "Updates live in the checklist—drop a ✅ when done."

Week 4: Celebrate shared wins in the recap.
Partner view: Responsibility feels shared; your steadiness doesn't disappear into the background.
Cost/benefit: Slightly more coordination; less hidden load and resentment.`
        }
      ],
      
      communicationStyle: `Default: practical, friendly, time-bound. Clear "who/when/what good looks like," delivered with calm tone.

Scripts (with context)

Kickoff (work): "Goal: green demo Friday 1. Cadence: Mon 10 / Wed 3 / Fri 1. I'll send one-minute updates."

Check time (logistics): "I'll text at 4:15—if anything's missing, I'll swing by the store."

Two-Lane Offer (home): "I can own lunches, or we split: I prep; you pack by 7:10. Preference?"

Consent check (change): "Keep usual cadence, or one bigger check at 6 tonight?"

Right-sized urgency: "Important, not Critical—bundling into the 4:30 digest."

Edges & handoff: "I'm on until 6; after that, ping Alex for approvals."

Closure: "Loop closed: meds sorted for the week; checklist updated; next check Sunday 7."

Written vs. verbal

Written: checklists, cadences, SSOT links, and closures.

Verbal: renegotiations, tone-sensitive updates; follow with a short recap.

Repair moves

If you over-owned:
Script: "I grabbed too much to keep us moving. Here's a fair split for tomorrow—okay?"`,
      
      frictionPoints: `1) Cadence Without Consent
You maintain rhythm after circumstances change; others feel boxed in.
Repair: Ask for the preferred cadence.
Script: "Stay with daily digests or switch to M/W/F for this week?"

2) Unseen Labor
Your steady work fades into the background; appreciation drops.
Repair: Visible SSOT + short closures.
Script: "Loop closed on vendor order—tracking #… Next check-in Friday."

3) Nagging Perception
Reminders read as pressure.
Repair: Bundle into a single check time + warm framing.
Script: "One 4:30 digest instead of pings; reply there unless urgent."

4) Over-Preparedness vs. Actual Need
You build full kits when a quick step would do.
Repair: Ask the minimum viable help.
Script: "Would a starter checklist be enough, or do you want the full bin prepped?"

5) Scope Creep via "I'll just add it"
You keep absorbing tasks to keep flow.
Repair: Use a swap.
Script: "I can add returns if you take Thursday pickup."

6) Fuzzy Ownership at Handoffs
"Who's got it?" questions linger.
Repair: Add Owner / When / Criteria to every pass.
Script: "Owner: Jamie, by 2. Done = label + photo in SSOT."

7) Late Blocker Signals
You notice issues but wait for the next check.
Repair: Blocker lead time ≤ 4 hours with one calm note.
Script: "Flagging early—supplier ETA slipped. Options inbound at 4:30."`,
      
      partnerTranslation: `With Type 1 — Direct Nurturer (High Directness/High Tangibility)
They drive fast; you keep it steady.
Bridge: "You land the first win; I'll maintain cadence and supply the follow-through."

With Type 4 — Gentle Giver (Low Directness/High Tangibility)
They soften moments; you structure them.
Ritual: "You create the soft start; I'll run the checklist and check time."

With Type 2 — Direct Planner (High Directness/Low Tangibility)
They architect; you operationalize.
Bridge: "You own the one-page plan; I'll map tasks into Kick–Mid–Finish and chase blockers."

With Type 3 — Clear Communicator (High Directness/Mid Tangibility)
They craft messages; you make sure the actions happen.
Ritual: "You send the decision memo; I'll assign owners and confirm 'done for now'."

With Type 5 — Thoughtful Supporter (Low Directness/Low Tangibility)
They hold space; you provide motion.
Bridge: "You clarify what matters; I'll set the routine that protects it."

With Type 6 — Harmonizer (Low Directness/Mid Tangibility)
They balance people; you balance tasks and timing.
Ritual: "You manage fair trades; I'll lock the cadence and SSOT."

With Type 8 — Strategic Partner (Mid Directness/Low Tangibility)
They set arcs; you deliver day-to-day reliability.
Bridge: "You define the 30-day arc; I'll translate it into weekly runs with one check time per day."`,
      
      growthPathway: `90-Day Focus: Consentful Cadence → Shared Lanes → Flexible Urgency

Weeks 1–2 (Consentful Cadence): Add a cadence-choice line to all recurring efforts; confirm check time in writing.

Weeks 3–4 (Shared Lanes): Use Two-Lane Offer on two routines per week; track confirmation rates.

Weeks 5–6 (Flexible Urgency): Label all tasks Critical/Important/Next; keep only one Critical.

Weeks 7–8 (Blocker Lead Time): Signal blockers within 4 hours; include two options and an ask.

Weeks 9–12 (Scale): Publish SSOT templates; teach Kick–Mid–Finish to one teammate and hand off a lane.

What good looks like: People opt into your cadence; roles are clear; interruptions drop; progress feels smooth and humane.`,
      
      kpis: [
        'Cadence Consent Rate: % of routines with an agreed check time and frequency (target ≥ 90%)',
        'Two-Lane Adoption: % of recurring tasks using Two-Lane Offer (target ≥ 80%)',
        'Blocker Lead Time: Avg hours from blocker detection to first signal (target ≤ 4)',
        'Right-Sized Urgency Discipline: % of work with a single active Critical (target ≥ 90%)',
        'Closure Visibility: % of tasks with a written closure note in SSOT (target ≥ 85%)'
      ],
      
      signatureLexicon: [
        { term: 'Kick–Mid–Finish', definition: 'A simple three-touch cadence that keeps work predictable' },
        { term: 'Check time', definition: 'One agreed moment for updates to avoid constant pings' },
        { term: 'Two-Lane Offer', definition: '"I own setup" vs. "we split setup/confirm"; friendly accountability' },
        { term: 'Right-sized urgency', definition: 'Labeling Critical/Important/Next to prevent alarm fatigue' },
        { term: 'Edges & handoff', definition: 'Clear limits plus who takes over and when' },
        { term: 'SSOT (single source of truth)', definition: 'The canonical checklist/doc for status' },
        { term: '24-hour pre-check', definition: 'Supplies/confirmations/timing verified the day before' },
        { term: 'Loop closed', definition: 'Short, written completion note with what changed and what\'s next' },
        { term: 'Swap plan', definition: 'A fair trade when scope shifts ("I add A if you take B")' },
        { term: 'Done for now', definition: 'A practical interim finish line aligned to the next event' },
        { term: 'Blocker ping', definition: 'Early heads-up with options and an ask' },
        { term: 'Cadence choice', definition: 'Inviting partners to pick the rhythm that fits this week' }
      ]
    }
  },
  
  // Profile #8 - Strategic Partner (APPROVED - 99/100)
  8: {
    typeNumber: 8,
    typeName: 'Strategic Partner',
    directness: 'Mid',
    tangibility: 'Low',
    
    freeSummary: `Monday, 8:05 a.m.: deadlines jostle, requests pile up, and everyone's working hard without moving the needle. The Strategic Partner steps back just enough to see the system. "What outcome in 90 days? What must be true? What's the 48-hour win that proves we're on track?" They draw a strategy arc, set guardrails, and sequence work so momentum compounds. Their care shows up as direction and design: clear objectives, decision horizons, and a weekly rhythm that keeps signals visible.

Core strength: They convert scattered effort into a coherent plan. By clarifying purpose, mapping trade-offs, and designing a feedback loop, they help teams do less, better—on time.

Growth edge: They can hover at altitude too long. Under stress, they may over-index on models and under-invest in day-one traction. Pairing each frame with a tiny deliverable and a default-by-time decision keeps strategy grounded.

Try this today: Write a one-page strategy arc: Outcome (90 days) / Guardrails / Three milestones / Risks / 48-hour win. Share it with, "If no objections by 3 p.m., we proceed." Then ship the 48-hour win—a small proof that the direction is right. You'll keep altitude for clarity and add a wheel on the road.`,
    
    premium: {
      fullNarrative: `The Strategic Partner aligns effort to purpose. When priorities compete or goals blur, they pause the scramble and design a path that fits reality. They speak in outcomes, constraints, sequences, and signals. A typical move: "What result are we promising, to whom, by when? Given budget and capacity, what's the smallest sequence that makes that result likely? How will we know we're drifting before it's too late?" They then codify answers into a crisp plan with decision horizons (what must be decided now vs. later), guardrails (what we won't do), and a weekly operating rhythm (WOR) that turns learning into adjustment.

At work, you'll see concise strategy memos, trade-off matrices, and milestone maps that emphasize compounding wins. At home and in logistics, they translate the same thinking into smoother seasons: school-year routines set from principles ("sleep wins over screens"), trip plans organized around constraints ("one carry-on each"), and budgets aligned to goals ("three big rocks, then everything else"). In health, they scaffold change: "One habit, one metric, one review time."

Differentiation from adjacent types:
Versus Type 7: Steady Helper (Mid Directness/High Tangibility), who ensures reliable routines and day-to-day follow-through, Type 8 shapes direction and system design—less checklists, more choices about which checklists matter. Compared with Type 2: Direct Planner (High Directness/Low Tangibility), who excels at near-term decision hygiene and milestone gating, Type 8 tends to hold a longer arc (quarter to year), narrate the why, and orchestrate cross-stream trade-offs. All three reduce churn; Type 8's signature is saying no to the wrong work so the right work compounds.

At their best, Strategic Partners marry altitude with evidence: a strong frame + a 48-hour win that proves it's not just words.`,
      
      strengths: [
        {
          title: 'Clarity of Outcome & Guardrails',
          content: `Scene (work): Team chasing features; no north star.
Script: "Outcome: activation to 40% in 90 days. Guardrails: no net headcount; keep support wait times < two minutes. We'll drop nice-to-haves that don't move activation."
Why it works: Outcomes and guardrails focus choices; people stop fighting for low-impact tasks.
Micro-practice: Start every plan with Outcome / Constraints / "Not doing" list—three lines, then proceed.`
        },
        {
          title: 'Sequencing for Compounding Wins',
          content: `Scene (logistics): Family trip with limited time and budget.
Script: "Sequence: passports → tickets → lodging. Decision horizon: souvenirs decided on site. Success criteria: total carry-on weight < 22 lbs per person."
Why it works: Critical path first; reversible choices later.
Micro-practice: Label each decision Now / Next / Later; delay anything reversible until a signal arrives.`
        },
        {
          title: 'Feedback Loops that Learn Fast',
          content: `Scene (health): Sleep and stress are off.
Script: "One habit: lights out at 10. One metric: average time asleep. WOR: Sunday review; adjust only one variable weekly."
Why it works: Small loops generate clean data and sustainable change.
Micro-practice: Install a WOR: 15 minutes weekly to review metric → adjust → re-commit.`
        }
      ],
      
      growthAreas: [
        {
          title: 'From Framework to First Proof',
          content: `Pattern: You generate strong frames, but traction waits for "perfect alignment."
Why it happens: You optimize for correctness and hate waste; a tidy plan feels safer than a messy start.
Week-by-week practice:

Week 1: Attach a 48-hour win to every frame.
Script: "Outline v1 by Wednesday proves the direction; we'll refine from there."

Week 2: Use default by time on reversible decisions.
Script: "If no objections by 3 p.m., we trial Option A for five days."

Week 3: Publish success criteria for "good enough to learn."

Week 4: Run a post-proof retro (10 min): what the win taught; what to change.
Partner view: Your strategy feels real because progress shows up quickly.
Cost/benefit: Slightly less polish; dramatically faster learning.`
        },
        {
          title: 'Calibrating Directness Across Audiences',
          content: `Pattern: Mid directness + abstract language can feel vague to concrete partners; they want asks, not arcs.
Why it happens: You think in systems and trade-offs; you assume others see the same map.
Week-by-week practice:

Week 1: Convert each principle into one plain ask.
Script: "To protect focus, we'll do one launch per week—please cancel mid-week adds."

Week 2: Pair every narrative with a checklist stub for Type 7 partners.

Week 3: For Type 1 partners, add a 48-hour task they can run now.

Week 4: For execs, ship a one-liner + risk + next step.
Partner view: People know exactly what to do—today—without losing the why.
Cost/benefit: Minutes of translation; hours saved in misfires.`
        }
      ],
      
      communicationStyle: `Default: directional, calm, and choice-aware. Lead with Outcome / Why / Sequenced Next, include trade-offs, end with decision & horizon.

Scripts (with context)

Strategy arc opener (work): "Outcome: activation 40% in 90 days. Why: churn risk. Sequence: messaging test → onboarding fix → pricing trial. Decision horizon: pricing choice after two sprints of data."

Guardrail line (home): "Guardrail for weeknights: lights out at 10; screens parked at 9:30."

Trade-off matrix ask (ops): "If we prioritize reliability, we delay feature X by one sprint—approve the trade?"

Default by time (leadership): "If no objection by 2 p.m., we move to Option B for five days, success criteria attached."

Plain ask for concrete partners: "Please cancel mid-week adds; slot them into Friday planning."

Signal request: "We'll watch activation daily; ping if it drops 5% from baseline."

Retro prompt: "One learning, one change, one keep—reply by end of day."

Written vs. verbal

Written: strategy memos, decision memos, trade-off matrices, WOR agendas.

Verbal: sensitive trade-offs, value conflicts, cross-team negotiation—follow with a tight written recap.

Repair moves

If you stayed too abstract:
Script: "Here's the same plan as a checklist and a 48-hour task—better?"

If you over-ruled without consent:
Script: "I advanced us without a check. We can roll back; here are two options and the impacts."`,
      
      frictionPoints: `1) Altitude Drift ("All strategy, no ship")
Great slides; thin traction.
Repair: Pair every frame with a 48-hour win and success criteria.
Script: "We'll prove fit with three users by Thursday; if not, we pivot."

2) Misaligned Time Horizons
You speak in quarters; others live in days.
Repair: Add a Today/This week/This quarter strip to every plan.
Script: "Today: outline. This week: user test x5. This quarter: 40% activation."

3) Over-polite Decisions
You wait for full consensus; pace stalls.
Repair: Use default by time on reversible calls.
Script: "Objections by 3 p.m.; otherwise we run A for a week."

4) Hidden Trade-offs
Teams feel whiplash when priorities shift.
Repair: Publish a trade-off matrix with rationale.
Script: "We're trading polish for speed this sprint; success = demo without crashes."

5) Messaging vs. Mechanics Gap
You say "focus" but keep adding "just one more" initiative.
Repair: Create a not-doing list and guard it.
Script: "We're pausing expansions until activation moves; I'll revisit in two weeks."

6) Unclear Success Definition
Work finishes without impact.
Repair: State success criteria up front.
Script: "'Done for now' = 10 users complete onboarding < fifteen minutes."

7) Status Noise
Updates sprawl across channels.
Repair: Name a single source of truth (SSOT) and cadence.
Script: "SSOT is the Strategy sheet; weekly roll-up Monday 9."`,
      
      partnerTranslation: `With Type 2 — Direct Planner (High Directness/Low Tangibility)
Planner runs near-term gates; you hold the arc.
Bridge: "You own milestones and decision hygiene; I'll own strategy arc and trade-offs."

With Type 7 — Steady Helper (Mid Directness/High Tangibility) (adjacent mid)
They keep routines reliable.
Ritual: "I'll define Today/Week/Quarter; you map it into Kick–Mid–Finish and SSOT."

With Type 1 — Direct Nurturer (High Directness/High Tangibility)
They want a task now.
Bridge: "Here's the 48-hour win that proves the direction—can you land it by Wednesday?"

With Type 5 — Thoughtful Supporter (Low Directness/Low Tangibility)
They surface values and lived constraints.
Ritual: "You run listening sessions; I'll integrate themes into guardrails and sequence."

With Type 3 — Clear Communicator (High Directness/Mid Tangibility)
They make messages land.
Bridge: "I'll draft the decision memo; you tailor versions for execs and teams."

With Type 4 — Gentle Giver (Low Directness/High Tangibility)
They make starts humane.
Ritual: "I'll set the plan; you set a soft start and time box so the first step sticks."

With Type 6 — Harmonizer (Low Directness/Mid Tangibility)
They protect cohesion.
Bridge: "I'll hold priorities and trade-offs; you manage fair swaps and check-times through the change."`,
      
      growthPathway: `90-Day Focus: Arc → Proof → Rhythm

Weeks 1–2 (Arc): Write strategy arcs for your top two efforts: Outcome / Guardrails / Sequence / Risks / 48-hour win.

Weeks 3–4 (Proof): Ship the 48-hour win for each; apply success criteria; run a 10-minute retro.

Weeks 5–6 (Rhythm): Install a WOR (15 minutes): metric review → single adjustment → owner confirm.

Weeks 7–8 (Translation): Pair every narrative with a checklist stub (for Type 7) and a decision memo (for Type 3/leadership).

Weeks 9–12 (Scale): Teach default by time and trade-off matrix to one partner; coach them to run it without you.

What good looks like: Fewer priorities, clearer choices, earlier signals, faster pivots—and a team that can explain why the work matters in one breath.`,
      
      kpis: [
        '48-Hour Win Rate: % of plans that ship a proving deliverable within 48 hours (target ≥ 90%)',
        'Decision Timeliness: % of reversible decisions made by the stated default-by-time (target ≥ 85%)',
        'Trade-off Transparency: % of priority shifts accompanied by a published trade-off matrix (target ≥ 90%)',
        'WOR Adherence: % of weeks with a completed weekly operating rhythm review (target ≥ 85%)',
        'North-Star Movement: Quarterly change in the primary outcome (e.g., activation +X%) attributable to the sequence (target: positive movement with explanation)'
      ],
      
      signatureLexicon: [
        { term: 'Strategy arc', definition: 'A one-page map: Outcome / Guardrails / Sequence / Risks / 48-hour win' },
        { term: 'Decision horizon', definition: 'What must be decided now vs. what can wait' },
        { term: 'Guardrails', definition: 'Clear "won\'t do" boundaries that protect the goal' },
        { term: 'Trade-off matrix', definition: 'Visible choices (speed vs. polish, scope vs. risk) with rationale' },
        { term: 'Default by time', definition: 'Proceed with the stated option if no objection by a specific time' },
        { term: 'Success criteria', definition: 'Observable "done for now" signals that a step worked' },
        { term: '48-hour win', definition: 'A small deliverable that proves the direction fast' },
        { term: 'Weekly operating rhythm (WOR)', definition: 'A brief, recurring review to learn and adjust' },
        { term: 'Single source of truth (SSOT)', definition: 'The canonical home for plan, status, and metrics' },
        { term: 'Now/Next/Later', definition: 'Simple sequencing that respects reversibility' },
        { term: 'North-star metric', definition: 'The top outcome guiding all decisions' },
        { term: 'Not-doing list', definition: 'Protected work you will not pursue this cycle' },
        { term: 'Compounding wins', definition: 'Sequenced steps that make each next step easier' },
        { term: 'Signal drift', definition: 'Early signs the plan is off, caught by metrics or check-ins' }
      ]
    }
  }
};

export function getProfileByType(typeNumber: number): SwipeTypeProfile | null {
  return mockProfiles[typeNumber] || null;
}

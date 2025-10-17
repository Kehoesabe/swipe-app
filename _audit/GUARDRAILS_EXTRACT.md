# Guardrails Extract


### .expo\README.md
- L10: > Should I commit the ".expo" folder?

### .expo\README.md
- L12: No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.

### AGENTS.md
- L14: - Never runs hidden terminal actions or edits protected files without double approval.

### AGENTS.md
- L14: - Never runs hidden terminal actions or edits protected files without double approval.

### AGENTS.md
- L19: - No direct file edits; suggestions must return through Cursor diffs.

### AGENTS.md
- L35:   **Do:** Propose changes with rationale; require double approval.

### AGENTS.md
- L41:   **Do:** All changes must be via Cursor diffs; terminal is for emergencies only.

### AGENTS.md
- L70: // Always consider platform differences

### AGENTS.md
- L537: **Remember: The best code is code that doesn't need to be written. Always ask if the complexity is truly necessary.**

### ARCHITECTURE.md
- L472:     throw new Error('useAuth must be used within AuthProvider');

### ARCHITECTURE.md
- L730: - **AI Operating Rules for Editors:** See `.cursorrules` for in-IDE enforcement details.

### CHANGELOG.md
- L6: - New guardrails appended to `.cursorrules`.

### CHANGELOG.md
- L46:   - `.cursorrules` for AI assistant guidance

### CHANGELOG.md
- L145: Each release should be tagged in git:

### COMPLETE_SYSTEM_SPECIFICATION.md
- L73: **Question**: How should we handle user accounts initially?

### COMPLETE_SYSTEM_SPECIFICATION.md
- L81: **Question**: How should we store and manage questions/statements?

### CONTRIBUTING.md
- L70:    - App should load in Expo Go or simulator

### CONTRIBUTING.md
- L159: - **Props interface**: Always define TypeScript interfaces for props

### CONTRIBUTING.md
- L181: - **StyleSheet.create()**: Always use for styles

### CONTRIBUTING.md
- L301: 1. **Automated checks** must pass (CI/CD)

### CONTRIBUTING.md
- L341: 2. **Proposed solution**: How should it work?

### DEVELOPMENT_QUESTIONS.md
- L6: - **Q**: Should we start with local SQLite for rapid development, or go straight to cloud database?

### DEVELOPMENT_QUESTIONS.md
- L13: - **Q**: Should we implement social login (Google, Facebook) or just email/password?

### DEVELOPMENT_QUESTIONS.md
- L15: - **Q**: How should we handle user roles and permissions? (admin, client admin, end user)

### DEVELOPMENT_QUESTIONS.md
- L17: - **Q**: Should we support anonymous users or require registration for all?

### DEVELOPMENT_QUESTIONS.md
- L21: - **Q**: How should we validate AI-generated content quality?

### DEVELOPMENT_QUESTIONS.md
- L23: - **Q**: Should we support multiple languages for questions and responses?

### DEVELOPMENT_QUESTIONS.md
- L24: - **Q**: How should we handle content categories and tagging?

### DEVELOPMENT_QUESTIONS.md
- L29: - **Q**: Should we provide predictive analytics or just descriptive analytics?

### DEVELOPMENT_QUESTIONS.md
- L31: - **Q**: What data visualization libraries should we use? (Chart.js, D3.js, custom)

### DEVELOPMENT_QUESTIONS.md
- L35: - **Q**: Should we implement a freemium model with limited features?

### DEVELOPMENT_QUESTIONS.md
- L37: - **Q**: Should we offer white-label solutions for clients?

### DEVELOPMENT_QUESTIONS.md
- L42: - **Q**: Should we use continuous integration/deployment from the start?

### DEVELOPMENT_QUESTIONS.md
- L50: - **Q**: Should we implement data encryption at rest and in transit?

### DEVELOPMENT_QUESTIONS.md
- L52: - **Q**: Should we implement rate limiting and DDoS protection?

### DEVELOPMENT_QUESTIONS.md
- L55: - **Q**: Should we prioritize mobile-first or web-first development?

### DEVELOPMENT_QUESTIONS.md
- L57: - **Q**: Should we implement push notifications for new questions?

### DEVELOPMENT_QUESTIONS.md
- L59: - **Q**: Should we support multiple themes or just one design?

### DEVELOPMENT_QUESTIONS.md
- L63: - **Q**: Should we provide webhook support for real-time data updates?

### DEVELOPMENT_QUESTIONS.md
- L65: - **Q**: Should we support third-party analytics tools? (Google Analytics, Mixpanel)

### DEVELOPMENT_QUESTIONS.md
- L71: - **Q**: Should we implement caching strategies from the start?

### DEVELOPMENT_QUESTIONS.md
- L78: - **Q**: How should we handle client onboarding and setup?

### DEVELOPMENT_QUESTIONS.md
- L80: - **Q**: Should we implement client-specific question categories?

### DEVELOPMENT_QUESTIONS.md
- L82: - **Q**: Should we support client data isolation and privacy?

### DEVELOPMENT_QUESTIONS.md
- L85: - **Q**: How should we handle content moderation and quality control?

### DEVELOPMENT_QUESTIONS.md
- L87: - **Q**: Should we implement A/B testing for different question formats?

### DEVELOPMENT_QUESTIONS.md
- L89: - **Q**: Should we support user-generated content or just admin-created content?

### DEVELOPMENT_QUESTIONS.md
- L94: - **Q**: Should we implement predictive modeling for business outcomes?

### DEVELOPMENT_QUESTIONS.md
- L96: - **Q**: Should we provide benchmarking against industry standards?

### DEVELOPMENT_ROADMAP.md
- L20: **Question**: How should we handle user accounts initially?

### DEVELOPMENT_ROADMAP.md
- L28: **Question**: How should we store and manage questions/statements?

### DEVELOPMENT_ROADMAP.md
- L82: - **Local Development**: Should we set up local database first?

### DEVELOPMENT_ROADMAP.md
- L88: - **Analytics Data**: How granular should our tracking be?

### DEVELOPMENT_ROADMAP.md
- L89: - **Content Data**: How should we structure questions/statements?

### DEVELOPMENT_ROADMAP.md
- L119: 2. Should we start with local development or cloud-first?

### docs\ABOUT_PAGE_COPY.md
- L35: - **Privacy first.** Your results are private to you. Stripe handles payments; we never store card numbers. Delete your data anytime.  

### docs\ADMIN_FEATURES_SPEC.md
- L123: **Error-handling:** Show meaningful admin messages; always write audit.

### docs\ADMIN_FEATURES_SPEC.md
- L160: - Every privileged action must log a record.

### docs\ADMIN_FEATURES_SPEC.md
- L176: - Pagination everywhere; never load unbounded lists.

### docs\ADMIN_PANEL_OVERVIEW.md
- L14: > All privileged actions must be audit-logged.

### docs\ADMIN_PANEL_OVERVIEW.md
- L84: - Display minimum necessary data (email only; never show card details).

### docs\ADMIN_PANEL_OVERVIEW.md
- L98: - Separate environment variables for **service role** keys. Never expose to client.

### docs\ANALYTICS_SPEC.md
- L9: - Question text is never logged; use `questionId`, `framework`, `category`.

### docs\ANALYTICS_SPEC.md
- L47: - `answersCount` (should be 57)

### docs\API_ENDPOINTS.md
- L30: **Auth:** Optional (must own assessment via cookie/session)  

### docs\API_ENDPOINTS.md
- L42: **Auth:** Optional (must own assessment)  

### docs\AUTH_STRATEGY.md
- L38: - Anonymous creation/updates should go through service-role endpoints that bypass RLS

### docs\CHAT_HANDOFF_PACKAGE.md
- L2: **Protocol:** AP v3.1 (no assumptions; immutable links required)  

### docs\CHAT_HANDOFF_PACKAGE.md
- L25: - **57→72 questions regression:** Reverted to 57; decision documented as ADR-015 (immutable link required in PRs).

### docs\CHAT_HANDOFF_PACKAGE.md
- L25: - **57→72 questions regression:** Reverted to 57; decision documented as ADR-015 (immutable link required in PRs).

### docs\CHAT_HANDOFF_PACKAGE.md
- L29: - **Question count = 57** (NOT 72 / NOT 48). Source: ADR-015 (immutable)

### docs\CHAT_HANDOFF_PACKAGE.md
- L29: - **Question count = 57** (NOT 72 / NOT 48). Source: ADR-015 (immutable)

### docs\CHAT_HANDOFF_PACKAGE.md
- L31: - **Constraint copy** ("57 questions", "3–4 minutes") must include @SpecSource

### docs\CHAT_HANDOFF_PACKAGE.md
- L50: - `/docs/ADR-015.md` — 57-question decision (immutable source)

### docs\CHAT_HANDOFF_PACKAGE.md
- L50: - `/docs/ADR-015.md` — 57-question decision (immutable source)

### docs\CHAT_HANDOFF_PACKAGE.md
- L60: 2. Assumption cascade (72) nearly cemented wrong spec → immutable sources only

### docs\CHAT_HANDOFF_PACKAGE.md
- L70: ### 7) Immutable sources to cite in PRs

### docs\CHAT_HANDOFF_PACKAGE.md
- L71: - ADR-015 (57 questions) → link file path or commit SHA

### docs\CHAT_HANDOFF_PACKAGE.md
- L107: **Immutable anchors**

### docs\CHAT_HANDOFF_PACKAGE.md
- L110: adr_015_link: [/docs/ADR-015.md OR commit <SHA>]

### docs\CHAT_HANDOFF_PACKAGE.md
- L139: ### 11) AP v3.1 guardrails (must be in PR/spec)

### docs\CHAT_HANDOFF_PACKAGE.md
- L141: - Immutable links cited (ADR IDs and/or commit SHAs)

### docs\CHAT_HANDOFF_PACKAGE.md
- L153: - PR includes AP v3.1 artifacts (immutable links, @SpecSource, checklist)

### docs\CHAT_HANDOFF_PACKAGE.md
- L162: ## E) Immutable Source & Docs Map (save later as files)

### docs\CHAT_HANDOFF_PACKAGE.md
- L165: - `/docs/DECISION_LOG.md` + ADR-015 (57 questions)

### docs\CHAT_HANDOFF_PACKAGE.md
- L176: AP v3.1 active (no assumptions, immutable links).

### docs\CHAT_HANDOFF_PACKAGE.md
- L190: **Constraints:** 57 questions (ADR-015), ports 3000–3999/5000–5999 avoided, @SpecSource on constraint copy

### docs\CHAT_HANDOFF_PACKAGE.md
- L219: .github/workflows/immutable-link-check.yml

### docs\CHAT_HANDOFF_PACKAGE.md
- L253: State which version the next chat should read (MICRO/SHORT/CORE/FULL).

### docs\CONTACT_SUPPORT_COPY.md
- L85: All major cards via **Stripe**. We never store your card details.

### docs\CONTACT_SUPPORT_COPY.md
- L95: > Accessibility note: Every interactive element on this page should have clear labels and meet WCAG AA color contrast. Keep form fields large and error messages specific.

### docs\DATABASE_SCHEMA.md
- L228: **Note:** Anonymous assessments should be created/updated via server (service role) endpoints so they bypass RLS until linked to a user.

### docs\decisions\ADR-015-assessment-question-count.md
- L1: # ADR-015: Assessment Question Count (57 Questions)

### docs\decisions\ADR-015-assessment-question-count.md
- L34: - All 57 questions must be answered for valid result

### docs\DEPLOYMENT_GUIDE.md
- L28: > Never expose service-role or secrets to client code. Use Vercel's encrypted environment variables.

### docs\DEPLOYMENT_GUIDE.md
- L132: - Never log PII or secrets.

### docs\DEPLOYMENT_GUIDE.md
- L134: - Stripe secrets and Supabase service role never exposed client-side.

### docs\digital-personality-types.md
- L171: ✗ Include absolutes ("always," "never")

### docs\digital-personality-types.md
- L171: ✗ Include absolutes ("always," "never")

### docs\digital-personality-types.md
- L297:   Facet: Always-On (reverse)

### docs\digital-personality-types.md
- L1720:   "message": "Swipe direction must be 'up', 'right', 'down', 'left', or 'skip'"

### docs\digital-personality-types.md
- L2146: Critical Path (must complete in sequence):

### docs\digital-personality-types.md
- L2201: Benchmark: Should feel "quick" to users

### docs\dynamic-test-model.md
- L58: → Should NOT change much over time

### docs\dynamic-test-model.md
- L63: → SHOULD change with intention, context, technology evolution

### docs\dynamic-test-model.md
- L100: - Asking "Are you generally extraverted?" → Shouldn't change monthly

### docs\dynamic-test-model.md
- L101: - Asking "How much time did you spend on social media this month?" → Should change

### docs\dynamic-test-model.md
- L140: - Include stability check items (should NOT change)

### docs\dynamic-test-model.md
- L151: → Score must change by ±14 points to be "real" (not measurement error)

### docs\dynamic-test-model.md
- L157: You need to be explicit about what SHOULD vs. SHOULDN'T change:

### docs\dynamic-test-model.md
- L159: Should be stable (trait-like):

### docs\dynamic-test-model.md
- L163: Should change (state-like):

### docs\dynamic-test-model.md
- L412: r = 0.90 for "digital communication style" → Good (should be stable)

### docs\dynamic-test-model.md
- L437: - Digital Engagement should ↓

### docs\dynamic-test-model.md
- L438: - Digital Communication style should stay stable

### docs\dynamic-test-model.md
- L491: 1. Trait dimensions: Should be stable (r > 0.75 at 0,3,6 months)

### docs\dynamic-test-model.md
- L492: 2. State dimensions: Should vary appropriately

### docs\dynamic-test-model.md
- L651: Must distinguish signal from noise

### docs\dynamic-test-model.md
- L727: Educational burden (helping users understand what should/shouldn't change)

### docs\dynamic-test-model.md
- L756: Budget and timeline should be high-level with placeholders

### docs\ENVIRONMENT_CONFIG.md
- L3: > Use Vercel's encrypted env management. Never commit `.env` to git.

### docs\ENVIRONMENT_CONFIG.md
- L4: > For local dev, use `.env.local` (never committed).

### docs\ENVIRONMENT_CONFIG.md
- L107: - **Never** commit `.env*` to git.

### docs\future\COUPLES_REPORT_STRUCTURE.md
- L4: Turn two individual Swipe Type results into a practical, shared playbook. The report should feel hopeful, specific, and usable tonight.

### docs\FUTURE_FEATURES_INDEX.md
- L5: **Content Standards:** All content features must follow [Profile Standards v2.1](PROFILE_STANDARDS_V2.1.md) for quality and consistency.

### docs\FUTURE_FEATURES_INDEX.md
- L25: - **Dependencies:** Core Swipe Type MVP must be complete

### docs\FUTURE_FEATURES_INDEX.md
- L131: - [ ] Ask: "Should this become an artifact/document?"

### docs\LANDING_PAGE_COPY.md
- L66: **Free (always):**

### docs\LANDING_PAGE_COPY.md
- L78: **Trust note:** Private by default. We never sell your data. Stripe handles payments securely.

### docs\MONITORING_ALERTS.md
- L83: - **Redaction**: never log secrets, tokens, or cardholder data; avoid free-text PII.

### docs\planning\4-llm-evaluation-synthesis.md
- L15: 🔴 **Axis formulas under-specified** (must document before implementation)

### docs\PRIVACY_POLICY.md
- L12: - **Payments:** Processed by Stripe. We receive non-card details like payment status, amount, and a receipt URL. We **never** store full card numbers.

### docs\PROFILE_STANDARDS_V2.1.md
- L14: **Purpose:** This document establishes the definitive standards for creating, reviewing, and maintaining Swipe Type profiles. All content creators, reviewers, and quality assurance personnel must follow these guidelines to ensure consistency, accuracy, and user value.

### docs\PROFILE_STANDARDS_V2.1.md
- L18: **Quality Threshold:** All profiles must meet or exceed the standards outlined in Section 12 (Quality Assurance) before publication.

### docs\PROFILE_STANDARDS_V2.1.md
- L27: **Free Tier (Always Available):**

### docs\PROFILE_STANDARDS_V2.1.md
- L74: - Use absolutes ("you always/never...")

### docs\PROFILE_STANDARDS_V2.1.md
- L74: - Use absolutes ("you always/never...")

### docs\PROFILE_STANDARDS_V2.1.md
- L76: - Include absolutes ("always," "never")

### docs\PROFILE_STANDARDS_V2.1.md
- L76: - Include absolutes ("always," "never")

### docs\PROFILE_STANDARDS_V2.1.md
- L531: *This document serves as the definitive guide for Swipe Type profile creation and quality assurance. All team members involved in content creation, review, and maintenance must be familiar with these standards and apply them consistently.*

### docs\STRIPE_ENDPOINTS.md
- L109: - **PCI:** Use Checkout (hosted); never send PAN/CVV through our servers.

### docs\SWIPE_TYPE_PHASE_B_TECHNICAL_ARCHITECTURE.md
- L121: - ✅ Never store card data - Stripe handles all card information

### docs\SWIPE_TYPE_PHASE_B_TECHNICAL_ARCHITECTURE.md
- L216: Must disclose:

### docs\SWIPE_TYPE_PHASE_B_TECHNICAL_ARCHITECTURE.md
- L454: **Critical:** This endpoint MUST verify webhook signatures

### docs\SWIPE_TYPE_PHASE_B_TECHNICAL_ARCHITECTURE.md
- L616: | Webhook never arrives | Manual verification after 5 min | "Verifying purchase..." then unlock |

### docs\swipe-test-scoring.md
- L117: Example of appropriate hedging: "Based on your profile, people with similar patterns often find these phrases effective..." vs "Your communication style means you should say these phrases..."

### docs\swipe-test-scoring.md
- L212: Should be good (if validated)

### docs\swipe-test-scoring.md
- L322: Inter-item correlations within domains (should be r = 0.20-0.60)

### docs\swipe-test-scoring.md
- L355: Your "Communication" domain should correlate:

### docs\swipe-test-scoring.md
- L359: Your "Conflict" domain should correlate:

### docs\swipe-test-scoring.md
- L363: Your channels should correlate modestly:

### docs\swipe-test-scoring.md
- L367: Should NOT correlate strongly with:

### docs\swipe-test-scoring.md
- L690: What You SHOULD Expect:

### docs\swipe-test-scoring.md
- L693: Test-retest at 4-8 weeks should exceed 0.70

### docs\swipe-test-scoring.md
- L696: But factors should be interpretable and theoretically coherent

### docs\swipe-test-scoring.md
- L700: Not expecting extensive meta-analyses, but shouldn't be zero research

### docs\swipe-test-scoring.md
- L708: What You Should NOT Expect (and Don't Need):

### docs\swipe-test-scoring.md
- L738: If categorical, you MUST verify:

### docs\swipe-test-scoring.md
- L740:  What happens near boundaries? (slight differences shouldn't create different labels)

### docs\swipe-test-scoring.md
- L844: Should show:

### docs\swipe-test-scoring.md
- L925: 5. SPECIFIC TESTS YOU SHOULD RUN

### docs\swipe-test-scoring.md
- L950: 2. Item-total correlations (should be r > 0.30)

### docs\swipe-test-scoring.md
- L951: 3. α if item deleted (should not increase by > 0.02)

### docs\swipe-test-scoring.md
- L994: 1. Pearson r for continuous scores (should be > 0.70)

### docs\swipe-test-scoring.md
- L995: 2. Agreement % for categorical assignments (should be > 70%)

### docs\swipe-test-scoring.md
- L996: 3. Cohen's κ for types (should be > 0.60)

### docs\swipe-test-scoring.md
- L1053: Good answer: "People high on [dimension X] should exhibit [specific behavior Y] 

### docs\swipe-test-scoring.md
- L1089: - Always emphasize it's one data point

### docs\swipe-test-scoring.md
- L1106: - Should not drive any decisions

### docs\swipe-test-scoring.md
- L1142: 🚩 "Research is ongoing/forthcoming" (should exist before marketing)

### docs\swipe-test-scoring.md
- L1255: 2. ALWAYS use alongside:

### docs\swipe-test-scoring.md
- L1260: 3. NEVER use alone for:

### docs\swipe-test-scoring.md
- L1278: Reliability data? (Must have α > 0.70)

### docs\swipe-test-scoring.md
- L1300: The art is balancing scientific rigor with practical utility. Just be clear about limitations and never use it for high-stakes decisions.

### docs\swipe-test-scoring.md
- L1464: Example of appropriate hedging: "Based on your profile, people with similar patterns often find these phrases effective..." vs "Your communication style means you should say these phrases..."

### docs\swipe-test-scoring.md
- L1559: Should be good (if validated)

### docs\swipe-test-scoring.md
- L1669:  Inter-item correlations within domains (should be r = 0.20-0.60)

### docs\swipe-test-scoring.md
- L1702: Your "Communication" domain should correlate:

### docs\swipe-test-scoring.md
- L1706: Your "Conflict" domain should correlate:

### docs\swipe-test-scoring.md
- L1710: Your channels should correlate modestly:

### docs\swipe-test-scoring.md
- L1714: Should NOT correlate strongly with:

### docs\TERMS_OF_SERVICE.md
- L13: - You must be at least 13 years old (or the age of digital consent in your region).

### docs\TESTING_STRATEGY.md
- L125: - CI must pass unit & integration tests on PR.

### docs\TESTING_STRATEGY.md
- L125: - CI must pass unit & integration tests on PR.

### docs\TESTING_STRATEGY.md
- L126: - Staging E2E must pass core flows before production promotion.

### docs\test-scoring-methods.md
- L26: Each language should appear equally often:

### docs\test-scoring-methods.md
- L303: Scores must differ by ≥4 points to be reliably different

### docs\test-scoring-methods.md
- L327: The user wants "all details" with math, so I should be as thorough as I was with the Love Languages analysis.Complete Mathematical & Psychometric Analysis of Enneagram Assessment

### docs\test-scoring-methods.md
- L397: 1 = Never  2 = Rarely  3 = Sometimes  4 = Often  5 = Always

### docs\test-scoring-methods.md
- L397: 1 = Never  2 = Rarely  3 = Sometimes  4 = Often  5 = Always

### docs\test-scoring-methods.md
- L500: Order: Always list dominant first, then in sequence of Heart-Head-Gut or by descending score.

### docs\test-scoring-methods.md
- L638: In well-designed tests, correlations between type scores should be low:

### docs\test-scoring-methods.md
- L1089: Can always invoke "levels of development" to explain inconsistencies

### docs\test-scoring-methods.md
- L1159: Always include:

### docs\test-scoring-methods.md
- L2722: Theoretical assumption: Four dichotomies should be independent (orthogonal)

### docs\test-scoring-methods.md
- L3036: Ideal test: Should provide high information at decision threshold

### docs\test-scoring-methods.md
- L3866: Bottom line: MBTI has good scale psychometrics but dichotomization and missing Neuroticism create serious problems. For self-insight and conversation, it's acceptable. For selection, prediction, or clinical use, it's inappropriate. The mathematics clearly shows continuous dimensional models (Big Five) are superior in every psychometric way.RetryPDnow create a high-level summary brief in plain language (math descriptions are ok, not calculations or code).  audience = test developers and evaluators.Synthesized comprehensive assessment framework for test developers.The user wants a high-level summary brief comparing all four assessments (Love Languages, Enneagram, MBTI, Big Five) written for test developers and evaluators. This should be plain language but can include math descriptions (not calculations or code). The audience is technical but needs accessible synthesis.

### docs\test-scoring-methods.md
- L3876: Should be concise but comprehensive enough for decision-making.Comparative Psychometric Brief: Four Popular Personality Assessments

### docs\test-scoring-methods.md
- L3952: If all scores must sum to constant (e.g., Σ scores = 30),

### docs\test-scoring-methods.md
- L4103: ☐ Never use for selection or high-stakes assessment

### docs\test-scoring-methods.md
- L4122: 2. Never Dichotomize Continuous Scores

### docs\test-scoring-methods.md
- L4135: Always provide: Score ± 1.96 × SEM

### docs\test-scoring-methods.md
- L4154: If type stability < 75%, types should not be used for decisions.

### docs\test-scoring-methods.md
- L4371: Never: Use ipsative instruments or dichotomized types for statistical inference or important decisions

### docs\test-scoring-methods.md
- L4373: The mathematical constraints of ipsative scoring and artificial dichotomization are not merely technical issues—they fundamentally limit what conclusions can be drawn. Test developers must prioritize normative, continuous, validated measurement for any application requiring statistical analysis or predictive validity.

### docs\test-scoring-methods.md
- L4374: When in doubt: Default to Big Five. It's not always the most engaging, but it's always defensible.

### docs\UNIVERSAL_STARTER.md
- L10: @DecisionID ADR-015 (commit abc123d) // Question count = 57

### docs\UNIVERSAL_STARTER.md
- L38: - Cite immutable sources (ADR, commit SHAs) when asserting constraints.

### docs\UNIVERSAL_STARTER.md
- L50: **Immutable Sources:** ADR-015 (commit abc123d), /src/lib/scoringAlgorithm.ts, /src/data/questions.ts, /src/data/swipeTypeMapping.ts, /src/data/mockProfiles.ts.

### docs\UNIVERSAL_STARTER.md
- L50: **Immutable Sources:** ADR-015 (commit abc123d), /src/lib/scoringAlgorithm.ts, /src/data/questions.ts, /src/data/swipeTypeMapping.ts, /src/data/mockProfiles.ts.

### docs\UNIVERSAL_STARTER.md
- L54: - **Questions:** 57 (NOT 72/48). @DecisionID ADR-015 (commit abc123d)

### docs\UNIVERSAL_STARTER.md
- L63: - `/src/data/questions.ts` // 57 items, immutable constraint

### docs\UNIVERSAL_STARTER.md
- L68: - `/docs/ADR-015.md` // 57-question ADR (immutable)

### docs\UNIVERSAL_STARTER.md
- L68: - `/docs/ADR-015.md` // 57-question ADR (immutable)

### docs\UNIVERSAL_STARTER.md
- L88: - **Git is source of truth.** Never trust uncommitted state (caught the 72 → 57 regression).

### docs\UNIVERSAL_STARTER.md
- L89: - **AP v3.1 prevents drift.** Immutable links would've blocked the wrong item count + "teaser" profile regression.

### docs\UNIVERSAL_STARTER.md
- L124: - **Immutable links required** in PRs touching questions.ts, scoring/*, assessment.json.

### docs\UNIVERSAL_STARTER.md
- L146: - **Constraints:** 57 questions (ADR-015), avoid ports 3000–3999/5000–5999

### docs\UNIVERSAL_STARTER.md
- L153: ## 15) Immutable Sources (to cite)

### docs\UNIVERSAL_STARTER.md
- L155: - **57 questions:** ADR-015 (commit abc123d)

### docs\WORKFLOW_CHECKLIST.md
- L32:   GPT/CLD proposals must respect current repo state and test results.

### docs\WORKFLOW_CHECKLIST.md
- L88: **Remember:** Keep `SYNC_STATE.md` honest, update `CHAT_INDEX.md` consistently, use triggers appropriately, and always document handoffs clearly.

### FOUNDATION_SUMMARY.md
- L12: | **.cursorrules** | AI assistant instructions and patterns | Cursor IDE automatically uses this |

### FOUNDATION_SUMMARY.md
- L50: 1. .cursorrules (REQUIRED - core patterns)

### FOUNDATION_SUMMARY.md
- L57: - **Writing components**: `.cursorrules` + `QUICK_REFERENCE.md`

### FOUNDATION_SUMMARY.md
- L60: - **Security features**: `SECURITY.md` + `.cursorrules`

### FOUNDATION_SUMMARY.md
- L69: - Clear, consistent patterns in `.cursorrules`

### FOUNDATION_SUMMARY.md
- L120: - **Protected Files:** `.env.local`, `.env`, `package.json`, `app.json` / `app.config.ts` require double approval.  

### FOUNDATION_SUMMARY.md
- L134: └─ Start coding with .cursorrules active

### FOUNDATION_SUMMARY.md
- L156: 2. AI reads: .cursorrules, ARCHITECTURE.md, QUICK_REFERENCE.md

### FOUNDATION_SUMMARY.md
- L203: 1. **Use Cursor with .cursorrules**

### FOUNDATION_SUMMARY.md
- L204:    - Cursor automatically loads `.cursorrules`

### FOUNDATION_SUMMARY.md
- L214:    - AI knows your patterns from `.cursorrules`

### FOUNDATION_SUMMARY.md
- L253: **Update .cursorrules when:**

### FOUNDATION_SUMMARY.md
- L277: ### "Which doc should I read first?"

### FOUNDATION_SUMMARY.md
- L283: ### "How do I use .cursorrules?"

### MOBILE_TESTING_COMMANDS.md
- L88: 2. **Save files** (auto-reload should work for web)

### MOBILE_TESTING_COMMANDS.md
- L95: - **Always kill Node processes** before starting fresh

### MOBILE_TESTING_COMMANDS.md
- L111: *These commands ensure you always get a fresh barcode with the latest code changes for mobile testing.*

### NEXT_SESSION_CONTEXT.md
- L155: - ✅ `.cursorrules` - AI assistant patterns

### NEXT_SESSION_CONTEXT.md
- L237: - Press `w` for web - Should see "Hello World!"

### NEXT_SESSION_CONTEXT.md
- L238: - Scan QR code for mobile - Should work with Expo Go

### PROJECT_BRIEF.md
- L165: - Follows .cursorrules conventions

### PROJECT_TEMPLATE_GUIDE.md
- L13: 2. **.cursorrules** - AI assistant instructions (Cursor auto-loads this)

### PROJECT_TEMPLATE_GUIDE.md
- L54: ├── .cursorrules

### PROJECT_TEMPLATE_GUIDE.md
- L122: - `.cursorrules` - Core patterns work for all React Native

### PROJECT_TEMPLATE_GUIDE.md
- L175: - [ ] Add any project-specific patterns to .cursorrules

### PROJECT_TEMPLATE_GUIDE.md
- L188: │   ├── .cursorrules

### PROJECT_TEMPLATE_GUIDE.md
- L228: 1. **.cursorrules** - Cursor auto-loads this, knows your patterns

### PROJECT_TEMPLATE_GUIDE.md
- L236: 2. .cursorrules loads automatically

### PROJECT_TEMPLATE_GUIDE.md
- L266: cp $TEMPLATE_DIR/.cursorrules .

### PROJECT_TEMPLATE_GUIDE.md
- L317: - ✅ **Understands your patterns** via .cursorrules

### README.md
- L114: ├── .cursorrules            # AI assistant instructions

### README.md
- L171: - Follow the patterns in `.cursorrules`

### README.md
- L206: 1. **Load context**: AI assistants should read `.cursorrules`, `AGENTS.md`, and relevant documentation

### README.md
- L206: 1. **Load context**: AI assistants should read `.cursorrules`, `AGENTS.md`, and relevant documentation

### README.md
- L208: 3. **Type safety**: Always maintain TypeScript strict compliance

### README.md
- L211: See [AGENTS.md](./AGENTS.md) for common mistakes AI assistants should avoid.

### README.md
- L309: - **[.cursorrules](./.cursorrules)** - Cursor IDE rules and patterns

### README.md
- L407: - Read `.cursorrules` for project conventions

### README.md
- L413: - Load `.cursorrules` for project context

### SECURITY.md
- L67: // Never hardcode sensitive values

### SECURITY.md
- L76: - Never commit API keys or secrets to git

### SECURITY.md
- L138: // Never store sensitive data in AsyncStorage

### SECURITY.md
- L141: // Never store in plain JavaScript

### SECURITY.md
- L144: // Never log tokens

### SECURITY.md
- L208: // Always validate and sanitize user input

### SECURITY.md
- L243: // Always use parameterized queries

### SECURITY.md
- L403: **Always validate at multiple layers:**

### SECURITY.md
- L433: **Never expose sensitive information in errors:**

### SECURITY.md
- L455: console.log('User login:', { email, password }); // NEVER!

### SECURITY.md
- L527: # Always commit lock files

### START_HERE.md
- L158: Following .cursorrules and ARCHITECTURE.md, 

### START_HERE.md
- L188: - `.cursorrules` - AI assistant patterns (auto-loaded by Cursor)

### START_HERE.md
- L321: "According to our ARCHITECTURE.md, how should I [task]?"

### START_HERE.md
- L335: - ✅ AI-ready with .cursorrules

### swipe-app\supabase\config.toml
- L130: # If disabled, the refresh token will never expire.

### swipe-app\supabase\config.toml
- L179: # Controls the minimum amount of time that must pass before sending another signup confirmation or password reset email.

### swipe-app\supabase\config.toml
- L208: # Controls the minimum amount of time that must pass before sending another sms otp.

### TECHNICAL_DECISIONS_NEEDED.md
- L6: **Decision Needed**: How should we handle data storage?

### TECHNICAL_DECISIONS_NEEDED.md
- L14: **Decision Needed**: What backend approach should we use?

### TECHNICAL_DECISIONS_NEEDED.md
- L22: **Decision Needed**: How should we handle user authentication?

### TECHNICAL_DECISIONS_NEEDED.md
- L30: **Decision Needed**: What AI service should we use?

### TECHNICAL_DECISIONS_NEEDED.md
- L39: **Decision Needed**: What analytics approach should we use?

### TECHNICAL_DECISIONS_NEEDED.md
- L48: **Decision Needed**: What development approach should we use?

### TECHNICAL_DECISIONS_NEEDED.md
- L56: **Decision Needed**: What testing approach should we use?

### TECHNICAL_DECISIONS_NEEDED.md
- L65: **Decision Needed**: How should we deploy the application?

### TECHNICAL_DECISIONS_NEEDED.md
- L73: **Decision Needed**: What privacy and security measures should we implement?

### TECHNICAL_DECISIONS_NEEDED.md
- L81: **Decision Needed**: How should we implement the business model?

### TECHNICAL_DECISIONS_NEEDED.md
- L133: *These decisions will shape the entire development process and should be reviewed carefully.*

### TROUBLESHOOTING_MOBILE_BARCODE.md
- L97: When the mobile barcode command works, you should see:

### TROUBLESHOOTING_MOBILE_BARCODE.md
- L217: *This troubleshooting guide should resolve the mobile barcode generation issue and allow proper testing of the swipe functionality on mobile devices.*

# FUTURE FEATURES INDEX - Single Source of Truth

**Purpose:** Track all post-MVP features, their documentation location, and status.

**Content Standards:** All content features must follow [Profile Standards v2.1](PROFILE_STANDARDS_V2.1.md) for quality and consistency.

**AI Coordination:** For multi-LLM workflow coordination during feature development, see [Multi-LLM Coordination](MULTI_LLM_COORDINATION.md).

**Last Updated:** 2025-10-08

---

## 📋 FEATURE CATEGORIES

### 1. NEW ASSESSMENT TYPES

#### Digital Personality Types (DST)
- **Status:** Planned (Post-MVP Phase 2)
- **Documentation:** `docs/digital-personality-types.md` ✅ CREATED
- **Key Concepts:**
  - Digital personality assessment (separate from relationship Swipe Type)
  - 15-25 questions
  - Measures digital habits, tech relationship, online behavior
  - Complements Swipe Type (relationship-focused)
- **Dependencies:** Core Swipe Type MVP must be complete
- **Priority:** Medium

#### Dynamic Test Model (Ongoing Assessment)
- **Status:** Planned (Post-MVP Phase 3)
- **Documentation:** `docs/dynamic-test-model.md` ✅ CREATED
- **Key Concepts:**
  - "Rolling profile" - personality evolves over time
  - Periodic check-ins (mini-assessments: 3-5 questions)
  - Life event triggers (job change, relationship status, major life events)
  - Longitudinal tracking (personality change visualization)
  - Adaptive questioning based on previous responses
- **Dependencies:** 
  - User authentication system
  - Historical data storage
  - Analytics for change detection
- **Priority:** High (differentiator feature)

---

### 2. COUPLES & COMPATIBILITY

#### Couples Compatibility Framework
- **Status:** Documented (Batch 6)
- **Documentation:** `docs/COUPLES_COMPATIBILITY_FRAMEWORK.md`
- **Key Concepts:**
  - 8×8 compatibility matrix (64 pair combinations)
  - Shared relationship playbooks
  - 16 high-traffic pair descriptions (priority)
- **Dependencies:** Individual assessment complete
- **Priority:** High (revenue opportunity)

---

### 3. TECHNICAL ENHANCEMENTS

#### Adaptive Testing (CAT)
- **Status:** Research phase
- **Documentation:** NONE YET ⚠️
- **Key Concepts:**
  - Computerized Adaptive Testing
  - Branching logic based on responses
  - Shorter, more accurate assessments
  - Item Response Theory (IRT)
- **Dependencies:** Large validation dataset, IRT expertise
- **Priority:** Low (complex, uncertain ROI)

---

### 4. USER EXPERIENCE

#### Reassessment Features
- **Status:** Conceptual (linked to Dynamic Test)
- **Documentation:** See Dynamic Personality Test docs
- **Key Concepts:**
  - "Take again" functionality
  - Comparison with previous results
  - Change visualization
  - Progress tracking
- **Dependencies:** User accounts, data persistence
- **Priority:** Medium

---

## ⚠️ MISSING DOCUMENTATION

**Need to Create:**
1. `adaptive-testing.md` - CAT research and approach
2. `reassessment-features.md` - User re-testing flows

**✅ Created:**
1. `digital-personality-types.md` - DST specification
2. `dynamic-test-model.md` - Ongoing testing system

**Action Items:**
- [ ] User to provide previous DST documentation
- [ ] User to provide previous Dynamic Testing documentation
- [ ] Claude to create artifacts for future reference
- [ ] Integrate into main roadmap

---

## 📊 PRIORITY MATRIX

| Feature | Status | Priority | Effort | Value |
|---------|--------|----------|--------|-------|
| Couples Compatibility | Documented | HIGH | Medium | High |
| Dynamic Test Model | Planned | HIGH | High | Very High |
| Digital Personality Types (DST) | Planned | MEDIUM | Medium | Medium |
| Adaptive Testing (CAT) | Research | LOW | Very High | Uncertain |
| Reassessment UI | Conceptual | MEDIUM | Low | Medium |

---

## 🔄 UPDATE PROTOCOL

**When adding new features:**
1. Add entry to this index
2. Create dedicated doc in `docs/`
3. Update priority matrix
4. Link to related features
5. Note dependencies
6. Commit with message: `docs(features): add [FEATURE_NAME] to index`

**Before ending any planning session:**
- [ ] Review discussions for new features
- [ ] Ask: "Should this become an artifact/document?"
- [ ] Update this index
- [ ] Create placeholder docs for missing items

---

## 📍 CURRENT STATE

**MVP (In Progress):**
- Individual Swipe Type Assessment (57 questions)
- Basic scoring algorithm (being validated)
- Premium report ($12)
- Results screens

**Phase 0 (Current Focus):**
- Academic validation of scoring
- Test data generation
- Benchmark creation

**Next Phase (After MVP Launch):**
- Couples compatibility OR
- Dynamic testing foundation

---

## 💡 NOTES

- Dynamic Testing is a **differentiator** - most personality tests are static
- DST creates an **ecosystem** (relationship + digital personality)
- Adaptive Testing is **nice-to-have** but complex and risky
- Focus on **high-value, achievable** features first

---

## 📚 DOCUMENTATION ADDED (2025-10-09)

### Reference Archives
- `test-scoring-methods.md` - How LL/EN/MBTI/Big5 score (reference only)

### Future Scope (Expanded)
- `digital-personality-types.md` - DST specification (expanded from previous)
- `dynamic-test-model.md` - Ongoing assessment design (expanded from previous)

**Status:** Templates ready for content

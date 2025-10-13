---
title: Multi-LLM Production Workflow
version: 1.0 (Field Test)
status: Draft - Testing in Production
date: January 2025
author: Product Team
purpose: Coordinate parallel work across AI systems
next_review: After profile regeneration sprint completion
---

# Multi-LLM Production Workflow

**FIELD TEST VERSION - Will be refined based on actual coordination experience**

## Overview

This document establishes the coordination framework for parallel AI system work, specifically for the Swipe Type profile regeneration project. It defines roles, handoff protocols, and quality gates to ensure seamless collaboration between ChatGPT, Cursor AI, and human oversight.

## System Roles & Responsibilities

### ChatGPT (GPT-5) — Architect / Lead Dev
- **Primary Role:** Content generation and architectural design
- **Responsibilities:**
  - Generate complete profile content following Profile Standards v2.1
  - Create comprehensive implementation specifications
  - Design system architecture and data flows
  - Write detailed technical documentation
- **Outputs:** Full-file implementations, detailed specs, content drafts
- **Handoff:** Clear instructions for Cursor AI implementation

### Cursor AI (Claude 4.5 Sonnet) — In-IDE Engineer
- **Primary Role:** Code implementation and testing
- **Responsibilities:**
  - Implement code changes via visible diffs
  - Generate and update tests
  - Fix import issues and type errors
  - Perform surgical refactors
- **Constraints:** 
  - No hidden terminal actions
  - No editing protected files without approval
  - Bias toward minimal, surgical changes
- **Outputs:** Code diffs, test implementations, refactored code

### Human (Daniel) — Product Lead
- **Primary Role:** Decision making and quality oversight
- **Responsibilities:**
  - Approve visible diffs and major changes
  - Enforce protected file policies
  - Orchestrate handoffs between systems
  - Make product decisions and prioritization
- **Gates:** All major changes require human approval

## Workflow Phases

### Phase 1: Content Generation (ChatGPT)
**Duration:** 2-3 days
**Deliverables:**
- [ ] Complete profile content for all 8 types
- [ ] JSON schema matching Profile Standards Section 2
- [ ] Content quality validation reports
- [ ] Implementation specifications

**Quality Gates:**
- [ ] All content meets Profile Standards v2.1 requirements
- [ ] Flesch-Kincaid reading level 8th-10th grade
- [ ] No Barnum statements detected
- [ ] Word count within ±5% of targets
- [ ] Lexicon usage 6-10 terms across 3+ sections
- [ ] Script quota ≥10 per type
- [ ] Domain diversity ≥3 per type

**Handoff to Cursor AI:**
- [ ] Complete content package delivered
- [ ] Implementation specs provided
- [ ] Quality validation completed
- [ ] Ready for code implementation

### Phase 2: Code Implementation (Cursor AI)
**Duration:** 1-2 days
**Deliverables:**
- [ ] Database schema updates
- [ ] API endpoint implementations
- [ ] Component scaffolding
- [ ] Test suite updates
- [ ] Integration with existing codebase

**Quality Gates:**
- [ ] All tests passing
- [ ] No linting errors
- [ ] Type safety maintained
- [ ] Backward compatibility preserved
- [ ] Performance benchmarks met

**Handoff to Human:**
- [ ] Code review completed
- [ ] All diffs visible and documented
- [ ] Ready for human approval
- [ ] Deployment checklist prepared

### Phase 3: Integration & Testing (Human + Cursor AI)
**Duration:** 1 day
**Deliverables:**
- [ ] End-to-end testing completed
- [ ] Performance validation
- [ ] User acceptance testing
- [ ] Production deployment

**Quality Gates:**
- [ ] All integration tests passing
- [ ] Performance within acceptable limits
- [ ] User experience validated
- [ ] Production readiness confirmed

## Handoff Protocols

### ChatGPT → Cursor AI
**Format:** Structured specification document
**Required Elements:**
- [ ] Complete file contents with line-by-line specifications
- [ ] Test requirements and expected outcomes
- [ ] Dependencies and import requirements
- [ ] Performance considerations
- [ ] Error handling requirements

**Example Handoff:**
```markdown
## File: src/components/ProfileCard.tsx
**Purpose:** Display profile information with new type system
**Requirements:**
- Use new SwipeTypeName types
- Display Steady Helper correctly
- Handle all 8 Profile Standards types
- Maintain responsive design

**Implementation:**
[Complete code with comments]
```

### Cursor AI → Human
**Format:** Visible diff with explanation
**Required Elements:**
- [ ] Clear diff showing all changes
- [ ] Explanation of changes made
- [ ] Test results and coverage
- [ ] Performance impact assessment
- [ ] Rollback plan if needed

**Example Handoff:**
```markdown
## Changes Made
- Updated SwipeTypeName type definitions
- Added Steady Helper mapping
- Updated display names
- Added comprehensive tests

## Test Results
- All 8 type integrity tests passing
- Mapping tests updated and passing
- No breaking changes detected

## Ready for Review
[ ] Code review
[ ] Performance validation
[ ] User acceptance testing
```

## Quality Assurance Framework

### Content Quality (ChatGPT)
- [ ] **Reading Level:** Flesch-Kincaid 8th-10th grade
- [ ] **Barnum Detection:** No statements fitting 5+ types
- [ ] **Word Count:** Within ±5% of targets
- [ ] **Lexicon Usage:** 6-10 terms across 3+ sections, <3× frequency
- [ ] **Script Quota:** ≥10 scripts per type
- [ ] **Domain Diversity:** ≥3 domains per type
- [ ] **Growth/Friction Overlap:** <30% threshold
- [ ] **Duplication Check:** No suite-wide catchphrases

### Code Quality (Cursor AI)
- [ ] **Type Safety:** No TypeScript errors
- [ ] **Test Coverage:** All new code tested
- [ ] **Performance:** No performance regressions
- [ ] **Linting:** No ESLint errors
- [ ] **Documentation:** Code properly commented
- [ ] **Accessibility:** WCAG compliance maintained

### Integration Quality (Human)
- [ ] **End-to-End:** Complete user flows working
- [ ] **Performance:** Response times within limits
- [ ] **User Experience:** Intuitive and smooth
- [ ] **Error Handling:** Graceful failure modes
- [ ] **Security:** No vulnerabilities introduced

## Communication Protocols

### Daily Standup Format
**Time:** 9:00 AM EST
**Duration:** 15 minutes
**Participants:** All systems + Human

**Agenda:**
1. **ChatGPT:** Content generation progress
2. **Cursor AI:** Implementation status
3. **Human:** Decisions and blockers
4. **Next Steps:** Clear handoff requirements

### Issue Escalation
**Level 1:** System-to-system communication
**Level 2:** Human intervention required
**Level 3:** Architecture decision needed

**Response Times:**
- Level 1: < 1 hour
- Level 2: < 4 hours
- Level 3: < 24 hours

## Success Metrics

### Content Generation
- [ ] All 8 profiles completed within 3 days
- [ ] Quality scores above thresholds
- [ ] Zero Barnum statements
- [ ] Complete implementation specs provided

### Code Implementation
- [ ] All features implemented within 2 days
- [ ] 100% test coverage for new code
- [ ] Zero linting errors
- [ ] Performance within acceptable limits

### Integration
- [ ] End-to-end testing completed
- [ ] User acceptance testing passed
- [ ] Production deployment successful
- [ ] Zero critical bugs in production

## Risk Mitigation

### Content Risks
- **Risk:** Quality standards not met
- **Mitigation:** Automated QA tools, human review
- **Contingency:** Regeneration with refined prompts

### Code Risks
- **Risk:** Breaking changes introduced
- **Mitigation:** Comprehensive testing, gradual rollout
- **Contingency:** Rollback plan, feature flags

### Integration Risks
- **Risk:** Performance degradation
- **Mitigation:** Load testing, monitoring
- **Contingency:** Performance optimization, scaling

## Monitoring & Feedback

### Real-time Monitoring
- [ ] Content generation progress
- [ ] Code implementation status
- [ ] Test results and coverage
- [ ] Performance metrics
- [ ] Error rates and logs

### Feedback Loops
- [ ] Daily quality reviews
- [ ] Weekly process improvements
- [ ] Post-sprint retrospectives
- [ ] Continuous optimization

## Future Refinements

### Based on Field Test Results
- [ ] Refine handoff protocols
- [ ] Optimize quality gates
- [ ] Improve communication channels
- [ ] Enhance monitoring systems
- [ ] Streamline approval processes

### Version 2.0 Improvements
- [ ] Automated quality validation
- [ ] Real-time collaboration tools
- [ ] Advanced monitoring dashboards
- [ ] Predictive quality scoring
- [ ] Intelligent handoff optimization

---

**Next Review:** After profile regeneration sprint completion
**Status:** Field Test Version - Will be refined based on actual coordination experience


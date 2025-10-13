# ADR-015: Assessment Question Count (57 Questions)

**Date:** 2025-01-10  
**Status:** Accepted (Documents Production System)  
**Deciders:** Daniel (Product Owner/Founder)  
**Commit:** fbbeae9 (Oct 8, 2025)

## Context
The assessment requires enough questions to accurately type users across 8 Swipe Types while maintaining high completion rates (target 3-4 minutes).

## Decision
Use **57 questions total**:
- Structure: Love Language + Enneagram framework
- Balanced for accuracy and completion time
- 8 Swipe Type profiles

## Rationale
- Optimized for 3-4 minute completion time
- Sufficient for accurate typing across 8 types
- Tested and validated (Oct 8, 2025)
- Committed as production-ready system

## Implementation
- File: `/src/data/questions.ts`
- Commit: fbbeae9 - "feat: Complete Milestone A - Production-ready assessment logic"
- Commit message: "Fix generateResponses() to fill all 57 questions"
- itemCount: 57
- itemBankVersion: v1.0
- modelVersion: v1.0
- assessmentVersion: v1.0

## Consequences
- Assessment takes 3-4 minutes to complete
- All 57 questions must be answered for valid result
- Progress bar shows X/57
- Scoring algorithm expects 57 responses

## Important Note
After Oct 8, 2025, uncommitted changes temporarily modified this to 72 questions. This ADR documents the committed, production-ready system of 57 questions as the official specification. Any references to 72 questions were incorrect and have been reverted.

## References
- Production commit: fbbeae9 (Oct 8, 2025)
- Implementation: `/src/data/questions.ts`
- Config: `/config/assessment.json` (itemCount: 57)
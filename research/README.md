# Swipe Type — Phase 0 Academic Validation Corpus (PROVISIONAL)

**Goal:** Validate scoring before building it. This folder holds study matrices, provisional distributions, and benchmarks for Love Languages (LL) and Enneagram (EN).

**Status:** ResearchGate baseline completed; Google Scholar (GS) placeholders reserved.

---

## Contents

- `data/love-languages-matrix.json` — per-study LL records (factor models, distributions, mixed-type prevalence).
- `data/enneagram-matrix.json` — per-study EN records (factor models, reliability, any % distributions).
- `data/combined-distributions.json` — provisional synthesis (clearly marked PROVISIONAL).
- `benchmarks/expected-distributions.json` — PROVISIONAL target ranges derived from baseline.
- `benchmarks/validation-criteria.json` — fit & reliability targets (DFI-aware), invariance thresholds.
- `benchmarks/scoring-thresholds.json` — z-band + POMP normalization and mixed-type policy.
- `benchmarks/response-format.json` — ipsative vs. normative guidance and mitigations.

---

## Paper Categories (for triage)

1. **Primary distributions** (LL/EN %)  
2. **Validation/factor structure** (CFA/EFA, fit, reliability)  
3. **Mixed/multi-type handling** (prevalence, cutoffs)  
4. **Psychometric methods** (DFI, invariance, CI)  
5. **Outcome context** (satisfaction, attachment) — lower priority for distributions

---

## Key Findings (ResearchGate Baseline)

**Love Languages**
- Mixed profiles are the norm (≈ **92.75%** mixed; Surijah & Septiarly, 2016).
- Competing structures: 5-factor vs **4-factor** (Acts of Service + Gifts merge).  
- Provisional primary distribution (mean of two convenience samples):  
  Quality Time ~35%, Words ~20%, Touch ~19%, Acts ~15%, Gifts ~12%.

**Enneagram**
- 9-factor structure replicated across multiple validations (CFA acceptable; α ≈ .70–.89).  
- Provisional type distribution available from one US college sample (for sanity checks only).

---

## Google Scholar Additions (Pending)

Fill placeholders in both matrices with **large-N**, **representative** (non-student) studies reporting:
- Concrete **primary distribution %** (LL and EN)
- **Mixed-type** prevalence and/or **categorization thresholds**
- CFA/EFA **fit** + **reliability**; add **MG-CFA** invariance where available

---

## Review Checklist (Cursor → Claude)

- [ ] Matrices contain one row per *keeper* study; no averaging inside matrices.  
- [ ] Combined distributions marked **PROVISIONAL** and list sources used.  
- [ ] Benchmarks reflect DFI-aware targets, reliability minima, and mixed-type policy.  
- [ ] GS placeholders present (≥3 per track).  
- [ ] Ready for `feature/academic-scoring-v2` once GS integration completes.





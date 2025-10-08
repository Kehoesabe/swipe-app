# QA CHECKLIST — Swipe Type Assessment

## Purpose
Ensure item quality, scale reliability, distinctness between constructs, and healthy session behavior before launch.

---

## Item-Level Targets
- **Response Distribution (per item)**
  - YES!: 15–35%
  - Yes: 20–35%
  - No:  20–35%
  - NO!: 15–35%
  - ⚠️ Red flag: any option >60% or <5%

- **Item-Total Correlation (corrected, within scale)**
  - Target: r ≥ 0.30
  - Acceptable: r ≥ 0.25
  - ⚠️ Red flag: r < 0.20

- **Reverse Items (pre-recode check)**
  - Target negative correlation with scale: −0.30 to −0.60
  - ⚠️ Red flag: positive correlation (likely coding bug)

- **Timing**
  - Median per-item time: 3–8s
  - ⚠️ Red flag: median <2s (speeding)

- **Straightlining / Longstring**
  - No more than 12 identical consecutive swipes
  - ⚠️ Red flag triggers soft warning banner in-app and QA note

---

## Scale-Level Targets
For each **Connection Style** (6 scales) and **Enneagram Type** (9 scales):

- **Internal Consistency (Cronbach's α)**
  - Target: α ≥ 0.70
  - Acceptable: α ≥ 0.65 (scales with 3 items)
  - ⚠️ Red flag: α < 0.60

- **Inter-Item Mean (sanity)**
  - Range expected: −1.0 to +1.5 (normalized)
  - ⚠️ Red flag: all items skewed high or low

---

## Inter-Scale Distinctness
- **Between Connection Styles:** r < 0.50 (acceptable up to 0.60)
- **Between Enneagram Types:** r < 0.40 (acceptable up to 0.50)
- ⚠️ Red flag: r > 0.70 (construct overlap)

---

## Session-Level Health
- Completion rate: **≥ 85%**
- Median completion time (57 items): **5–7 min**
- Undo usage: **< 8%** of items (informational)
- Device input mix:
  - Mobile swipe ≥ 50%
  - Keyboard/buttons clearly represented on web

---

## Pilot & Validation Protocol
1. **Pilot (n=50)**
   - Validate coding: reverse items negative pre-recode
   - Remove/repair items failing any red-flag criterion
2. **Full Study (n=200–300)**
   - Compute all targets above
   - Inspect blend rates; margin distribution; centroid tie-break frequency
3. **Decision**
   - If all pass → Ship
   - If 1–2 items fail → targeted rewrites
   - If scales fail (α < 0.60) → rework items, revalidate with n≥100

---

## Acceptance Checklist (Pass/Fail)
- [ ] No item has >60% on any single option
- [ ] All item-total r ≥ 0.20 (and reverse items negative pre-recode)
- [ ] α ≥ 0.65 for all scales (≥0.70 target)
- [ ] No inter-scale r > 0.70
- [ ] Completion rate ≥ 85%
- [ ] Median time 5–7 minutes
- [ ] Longstring & speeding rates within expectations
- [ ] Analytics events firing (see `docs/ANALYTICS_SPEC.md`)

# Couples Compatibility Framework (DST)

## Overview
This framework turns two individual Swipe Types into an at-a-glance compatibility profile plus actionable guidance. It includes:
- An 8×8 matrix (all pairings)
- Rating rubric (High / Balanced / Growth / Challenging)
- Scoring heuristics and implementation notes
- Guidance for blends (near-ties)

---

## The 8 Swipe Types (axes shorthand)
- **Solid Rock (SR)** — Stability through consistency
- **Watchful Guard (WG)** — Protection through strength
- **Warm Heart (WH)** — Nurture through closeness
- **Gentle Guide (GG)** — Care through verbal recognition
- **Deep Connector (DC)** — Depth via relational attunement
- **Authentic Soul (AS)** — Depth via self-expression
- **Progress Partner (PP)** — Growth & achievement orientation
- **Free Spirit (FS)** — Energy, novelty, adventure

**Complementarity heuristics:**
- **Stability ↔ Energy**: SR pairs well with FS; PP with DC/WH depending on context.
- **Depth–Relational ↔ Depth–Self**: DC ↔ AS creates rich, balancing dynamics.
- **Care channels**: WH (actions/touch) complements GG (words) for a full spectrum.
- **Protection energy** (WG) can steady FS/PP, but can also clash if over-controlling.

---

## Ratings Legend
- **High** – Natural synergy; complementary needs and instincts
- **Balanced** – Similar values/pace; low friction; requires variety to avoid stasis
- **Growth** – Good potential with conscious effort and role clarity
- **Challenging** – Frequent cross-pressures; needs advanced skills/agreements

---

## 8×8 Compatibility Matrix

|        | SR | WG | WH | GG | DC | AS | PP | FS |
|--------|----|----|----|----|----|----|----|----|
| **SR** | Balanced | Growth | High | Balanced | Balanced | Growth | Growth | High |
| **WG** | Growth | Balanced | Growth | Growth | Growth | Challenging | Balanced | Challenging |
| **WH** | High | Growth | Balanced | High | Balanced | Balanced | Growth | Balanced |
| **GG** | Balanced | Growth | High | Balanced | High | Balanced | Balanced | Growth |
| **DC** | Balanced | Growth | Balanced | High | Balanced | High | Growth | Growth |
| **AS** | Growth | Challenging | Balanced | Balanced | High | Balanced | Growth | Balanced |
| **PP** | Growth | Balanced | Growth | Balanced | Growth | Growth | Balanced | High |
| **FS** | High | Challenging | Balanced | Growth | Growth | Balanced | High | Balanced |

*Matrix is symmetric by design; diagonals are typically **Balanced** (like-with-like).*

---

## Scoring Heuristics (for DST Engine)

1. **Base compatibility score (0–100)**
   - Start at **70** for same-type pairs (familiarity effect).
   - Start at **65** for different-type pairs.

2. **Axis synergy adjustments (+/– 0–12 each)**
   - **Stability ↔ Energy complement**: +10 (e.g., SR×FS, PP×FS* if shared goals)
   - **Depth complement (Relational ↔ Self)**: +8 (DC×AS)
   - **Care channel complement (Words ↔ Actions/Touch)**: +6 (GG×WH)
   - **Protection fit**: +6 if partner welcomes advocacy (WG×WH, WG×DC); –8 if autonomy-clash (WG×FS, WG×AS)

3. **Friction penalties (–0–15 each)**
   - **Pace clash** (stability vs novelty without agreements): –8
   - **Control vs autonomy** (over-directiveness, WG/PP vs FS/AS): –10
   - **Depth mismatch** (DC/AS vs PP/FS preferring lightness): –6 unless rituals exist.

4. **Maturity buffers (+0–10)**
   - If both have strong repair language (GG/WH/DC traits present), add +6.
   - If at least one is routine-builder (SR/PP), add +4.

5. **Rating mapping**
   - **≥85** → High
   - **75–84** → Balanced
   - **65–74** → Growth
   - **<65** → Challenging

> **Blends:** If either partner has a secondary within **0.20** of primary, compute score for both pairings and take the **max**. Surface the secondary dynamic in the report ("notes of …").

---

## Implementation Notes
- Input: primary & (optional) secondary Swipe Types per person.
- Output: rating + narrative (pair description) + top 3 strengths + top 3 watchouts + 3 rituals.
- Store: keep raw subscale means to enable tailored tips.
- A/B: test whether to show rating label or a 0–100 bar only.



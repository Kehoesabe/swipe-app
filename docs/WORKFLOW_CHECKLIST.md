# SWIPE — Multi-LLM Workflow Checklist

This file summarizes the daily rhythm, triggers, and safety rules for the coordinated ChatGPT (GPT) + Claude (CLD) + Cursor (CUR) workflow.

---

## 🤖 LLM ROLE ASSIGNMENTS
| LLM | Primary Role | When to Use | Files They Touch |
|-----|---------------|-------------|------------------|
| **GPT** | Architecture, research, content specs | Design, system architecture, content, docs | `docs/`, research, ADRs |
| **CLD** | Review, risk checks, test planning | Code review, edge cases, test design, deploy review | `docs/` (reviews/tests) |
| **CUR** | Implementation & tests (**source of truth**) | Code edits, builds, deployments, running tests | `src/`, `scripts/`, configs |
| **MIX** | Shared coordination | When GPT & CLD contribute equally | Coordination docs only |

---

## 📁 FILE OWNERSHIP MATRIX
| File Type | Primary | Secondary | Update Triggers |
|------------|----------|------------|-----------------|
| `SYNC_STATE.md` | Any active LLM | All | Session start/end, new blocker, handoff ready |
| `docs/CHAT_INDEX.md` | Any active LLM | All | New session, status change |
| `src/`, `scripts/`, configs | **CUR** | GPT (design), CLD (review) | Code or infra change |
| `docs/` content/specs | GPT | CLD (review) | New spec or research |
| `vercel.json` etc. | **CUR** (per GPT design) | CLD (risk & rollout) | Deploy change |

---

## ⚙️ CORE PROTOCOLS
- **Non-Assumption:** Ask only if missing  
  (a) project name (SWIPE)  (b) blocker owner  (c) last Cursor action.  
- **Cursor Truth Loop:** Cursor = final source of truth.  
  GPT/CLD proposals must respect current repo state and test results.
- **Two Triggers Only:**  
  - 📦 **HANDOFF READY** – when work is complete.  
  - 🚨 **BLOCKER DETECTED** – when progress halts.

---

## ✅ DAILY / SESSION CHECKLISTS

### 🌅 Daily Start (≈ 90 sec)
- Read **ACTIVE NOW + BLOCKERS** in `SYNC_STATE.md`.  
- Pick today's single intended outcome.  
- Paste current `SYNC_STATE.md` if stale.

### 🔄 New Chat (≈ 60 sec)
- Update `SYNC_STATE.md` if changed.  
- Add row to `docs/CHAT_INDEX.md` (Seq, Title, Date, Model, Status).  

### 📦 Handoff (Trigger)
- Post **HANDOFF READY** block (from `COORDINATION.md`).  
- Update **HANDOFF QUEUE** in `SYNC_STATE.md`.  
- Mark receiving LLM's row as `Active`.

### 🚨 Blocker (Trigger)
- Post **BLOCKER DETECTED** block.  
- Assign owner in **BLOCKERS**.  
- If > 2 hrs → flag **ESCALATE NOW** and simplify/rollback.

### 🌙 Session End (≈ 60 sec)
- Update `SYNC_STATE.md` with reality.  
- Flip `CHAT_INDEX.md` status (`Plan→Active→Done`).  
- Paste **NEXT CHAT** footer.  
- Commit and push changes.  

---

## 🚨 Emergency Procedures
- **Stuck:** Use BLOCKER trigger → update `SYNC_STATE.md`.  
- **Unclear handoff:** Check `HANDOFF QUEUE` + `CHAT_INDEX.md`; clarify via `COORDINATION.md`.  
- **File conflict:** `git status` → prefer **revert + minimal patch** over stacked hotfixes.  
- **Escalation:** If same issue 3× → flag **PATTERN** and propose process change.

---

## 🎯 Current Focus (SWIPE-06)
- **Active:** Env variable error resolution (build & deploy)  
- **Lead LLM:** CLD (review/testing) → CUR (implements)  
- **Focus:** BOM cleanup · post-export patch · Vercel deploy  
- **Success:**  
  - App boots on Vercel without env-var errors  
  - `postexport-patch.mjs` runs cleanly  
  - `/api/health` returns 200  
- **Next handoffs:** CLD → GPT (log verify) · GPT → CUR (env hardening diff)

---

**Remember:** Keep `SYNC_STATE.md` honest, update `CHAT_INDEX.md` consistently, use triggers appropriately, and always document handoffs clearly.

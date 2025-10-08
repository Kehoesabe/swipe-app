# UI QA Checklist (Assessment & Results)

- Dark background `#1A1A2E`; no white panels anywhere.
- Question card centered; `borderRadius≈28`; soft shadow; card color `#2D3748`.
- Ghost card appears on drag, lags slightly (≈85% of main translation) and fades with distance.
- Direction labels show **pending** choice at edge of travel:
  - ↑ Strongly Agree: bright green
  - → Slightly Agree: green
  - ← Slightly Disagree: neutral gray
  - ↓ Strongly Disagree: red
- Same visuals for swipe, keyboard, and button input.
- Commit animation 250ms ease-out; light haptic on commit.
- Progress bar animates fill over 400ms; counter reads "Question X / 57".
- Results screen: dark, centered, no red/white; type color accent only.
- Screen reader announces pending choice at threshold and final on commit.

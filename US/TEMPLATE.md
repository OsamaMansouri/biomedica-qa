# US-XXX-000 · _Story title (PO writes this line)_

> **Pair card** — PO: title in Jira. QA: AC + automated and/or manual proof.

| Field | Value |
|-------|-------|
| Epic | EP-___ |
| Priority | P0 / P1 / P2 |
| Status | ⚪ Backlog / 🟡 In test / 🟢 Ready |
| Jira | `BIOM-___` |

## PO — intent

**As a** _persona_  
**I want** _capability_  
**So that** _outcome_

## QA — acceptance criteria

- Given … When … Then …

## Proof

| Type | Reference |
|------|-----------|
| Automated | `playwright/code-first/...` or — |
| Manual | [`docs/manual-testing.md`](../docs/manual-testing.md) section or steps below |
| Gherkin (AC) | `playwright/bdd/features/...` or — |

## Notes

---

**Checklist**

- [ ] Jira AC matches this card
- [ ] `test-coverage.csv` row updated
- [ ] `npm run qa:smoke:fr` passes (if automated)

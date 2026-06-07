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
| Gherkin (AC) | `playwright/bdd/features/...` — semicolon-separated; `—` if none yet |
| Automated | `playwright/code-first/...` or — |
| Manual | **Manual_Test_Notes** in `test-coverage.csv` + **Manual_OK** in catalogs — **write and run before automation** |

## Notes

---

**Checklist**

- [ ] Jira AC matches this card
- [ ] **Gherkin_Feature** + **Manual_Test_Notes** filled in `test-coverage.csv`
- [ ] `test-coverage.csv` **Automated_Playwright** updated (if automated)
- [ ] `npm run qa:smoke:fr` passes (if automated)

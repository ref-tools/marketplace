# Ref templates

Catalog title: `ui-sweep: <Feature name>`. `Bugs` and any other sweep refs are **sub-refs** of the catalog.

## Catalog ref (create immediately)

```markdown
# ui-sweep: <Feature name>

## Status
- Phase: inventory | sandbox | capture | publish | done
- Sandbox: booting | up | torn down
- Shots: 0 / N
- Bugs ref: <link or TBD>

## Look at these
<!-- Highest-signal shots first. With --fix, add before/after pairs here. -->

## TODO
- [ ] Inventory
- [ ] Sandbox + smoke
- [ ] Capture (live + edge)
- [ ] Upload + render
- [ ] Regroup by element
- [ ] Bug triage
```

### Per-element section (after regroup)

```markdown
:::collapse
### <Element name> — N screens — states covered: <list>
:::

![title](ref-media://…)
<!-- one-line description · viewport · bugs seen -->

:::end
```

## Bugs sub-ref

### Default (no `--fix`)

```markdown
# Bugs

## Needs you
| Decision | Options | Recommended |
| --- | --- | --- |
| … | A / B | A — <why> |

## <Area>
| Severity | Bug | Repro | Suspected file | Fix proposal |
| --- | --- | --- | --- | --- |
| high | … | … | `path` | … |

## Follow-ups
- …
```

### With `--fix`

Put **Status** first:

```markdown
# Bugs

## Status
| Area | PR | Checks | Merge after |
| --- | --- | --- | --- |
| … | draft #… | pending | — |

Merge order: 1) … 2) …

## Needs you
…

## <Area>
<!-- After a fix: replace the proposal with what changed; add the PR chip. -->
```

## Writer rules

- Insert rendered shot blocks **verbatim**; do not rewrite titles.
- After write, read back and verify image counts.
- Re-read a shared section before every edit; never overwrite rows you didn't write.

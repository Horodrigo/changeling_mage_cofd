# Persisted character schema decision

The supported schema remains version 2. It keeps a small, game-line-neutral
character record and stores line-owned state in `line_data`.

This is intentional rather than transitional. The common record contains only
identity, Chronicles traits, specialties, merits, derived values, transient
state, and persistence metadata. Mage and Changeling fields are not added to
that record; their rules, builders, and sheets own the contents of `line_data`.

A discriminated TypeScript union would improve compile-time knowledge of the
individual `line_data` records, but would not remove a current architectural
coupling and would require broad rewrites of the persistence and shared-sheet
interfaces. The existing boundary is simpler for the next game line: it adds
its own data inside `line_data` and its own normalization/rules module without
changing Core's persisted field list.

Current-schema validation is separate from normalization. Imports whose
`schema_version` is not `2` fail as unsupported; Core performs only structural
normalization of version 2 data. The selected line's lazy rules normalize
current line data and synchronize its derived grants afterwards. Historical
migration dispatch is deliberately not retained.

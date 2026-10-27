# export-kit adopted: two hand-rolled downloads become one kit call

- **What changed.** The Word (.doc) invoice export and the JSON backup each built
  their own `Blob` -> `URL.createObjectURL` -> `<a download>` -> `revokeObjectURL`
  chain. `export-kit` exists to be that chain once, so both now call it:
  `Export.save(name, data, 'application/msword')` and `Export.json(name, data)`.
- **Nothing else moves.** Filenames, mime types, the UTF-8 BOM Word needs, the
  `8.0` backup version and the "Backup downloaded successfully" message are
  unchanged. `Export` is **inlined** in the page, so the app is still ONE file.
- **Proof.** `node tests/retrofit-export-kit.test.js` boots the real page and asserts
  a file comes out of the kit with the right name, mime and bytes: 24/24. Against the
  page before the change it is 2/12, so the suite bites. `retrofit-parity` reports
  nothing removed (functions 5 -> 29, ids 3 -> 3).

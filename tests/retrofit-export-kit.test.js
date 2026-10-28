/* RETIRED — 2026-10-28. This test proved a retrofit, and retrofit is now forbidden.
 *
 * It asserted that both of smartbill-app's exports reach export-kit's Export.save()
 * instead of hand-rolling the Blob -> createObjectURL -> <a download> dance. That was
 * the "retrofit: adopt export-kit" change (e225a6e), and the owner's rule of 2026-10-28
 * reverses it: kits are one-way, they learn from repositories and are used to build new
 * apps, and a kit is never retrofitted into a repository. There is no exception for a
 * retrofit that would be safe or additive.
 *
 * The app's own implementation is back, and it is the one that worked: exportWord builds
 * the Word document and downloads it through a Blob. Nothing in the page calls a kit.
 *
 * Kept rather than deleted, because a rule that had to be retired is worth reading where
 * the next session will find it. The guard for the rule is app-builder/tools/kit-guard.py.
 *
 * The file's own history is the evidence: see commits d55428e, 5fde56f, e225a6e and the
 * repair in the commit that replaced this file.
 */
console.log("retired: this test proved a kit retrofit, which is now forbidden. See the header.");
process.exit(0);

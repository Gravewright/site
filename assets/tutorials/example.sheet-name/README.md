Sheet name action, target Gravewright 0.3.0 / SDK 1.x.

ZIP the contents of this folder, with manifest.json directly at its root.
An installation owner reviews and installs the ZIP under Modules, Install module,
Install from ZIP. A GM activates example.sheet-name version 1.0.0 in the campaign.
Open an actor or token sheet and find Sheet name action below the existing sheet.

Save native sheet edits first. Click Reload server value, edit Sheet name, then
Save name. Do not edit the native form and this panel simultaneously. Every save
sends both revisions read by actors.sheet and preserves all other JSON data.
Snapshot tokens use data.token.name; linked tokens rename their actor. An existing
nonobject data.token is rejected rather than replaced. The server checks access.

Closing waits for a pending save. An unsaved name blocks closing until Save name
or Reload server value. Conflicts reload the server value and never retry a write.
On an uncertain network failure, reload before editing again. Deactivation aborts
pending client work but cannot undo a write the server already committed.

See the bilingual tutorial-sheet-module guide for complete instructions and tests.

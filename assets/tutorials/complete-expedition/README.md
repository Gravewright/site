# Complete Example Expedition

Target: Gravewright 0.3.0, SDK 1.x. Package ID: example.complete-expedition.

This single system ZIP provides working actor/token sheet replacements, character
and NPC actor types, gear and spell item types, native initiative configuration,
and actor_pack/item_pack/spell_pack content in compendiums/expedition.json.

As owner, review and install through Systems, Install system, Install from ZIP.
Create a disposable campaign with Complete Example Expedition as its system.
As GM, open Compendiums and import Harbor Scout, Signal Rope and Blue Glow.
The imported actor has stamina 8 and combat.initiative 3. Open its sheet, save
Stamina 17, close and reopen. Add it or a token to a scene's initiative tracker
and roll initiative: 1d20+3 yields 4 to 23. A new empty character has no stored
initiative modifier, so the native resolver uses zero. The displayed stamina
default of 10 is only a form default until saved. No derived game rules run.

Linked token sheets share actor data; independent tokens use their snapshots.
Item/spell content imports through native items; this package does not provide
a custom item editor, spell rules or equipment automation. Languages use the
separate installation-wide language-package workflow, not system.locales.

For changes, increment version, build a new ZIP, install it and explicitly select
the new release. Never replace installed bytes. Imported documents remain copies.
See THIRD_PARTY_NOTICES.txt, MIT-COMPENDIUM.txt and LICENSE.txt before reuse.

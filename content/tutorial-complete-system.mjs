// One original installable system, composed from the working sheet and library
// examples. Keep upstream GPL and MIT notices with their respective files.
import {packageExamples} from './examples-packages.mjs';
import {tutorialCompendiumPackages} from './tutorial-compendiums.mjs';
const sheet=packageExamples.find(example=>example.id==='system');
const library=tutorialCompendiumPackages.find(example=>example.id==='system-library');
const systemId='example.complete-expedition',id='complete-expedition';
const collection=JSON.parse(library.files['compendiums/beacon.json']);
collection.name='Complete Expedition Library';
for(const pack of collection.packs)for(const entry of pack.entries){
  entry.systemId=systemId;
  if(pack.type==='actor_pack')entry.data={...entry.data,combat:{...(entry.data.combat||{}),initiative:3}};
}
const manifest={...structuredClone(sheet.manifest),id:systemId,name:'Complete Example Expedition',
  description:'One original system with editable actor/token sheets, initiative and three installed content packs.',
  system:{actorTypes:[{id:'character',label:'Character'},{id:'npc',label:'NPC'}],itemTypes:[{id:'gear',label:'Gear'},{id:'spell',label:'Spell'}],combat:{formula:'1d20+@combat.initiative',manualInput:'number',showRoll:true}},
  content:{compendiums:['compendiums/expedition.json']}
};
const scope='.gw-module-root[data-module-id="example.complete-expedition"] .example-panel';
const css=`${scope} { box-sizing: border-box; padding: var(--space-4); color: var(--text); background: var(--surface); font: 14px/1.5 system-ui, sans-serif; }
${scope} h2 { font-size: 18px; margin: var(--space-0) var(--space-0) var(--space-3); }
${scope} label { display: block; margin-bottom: var(--space-3); }
${scope} input { display: block; max-width: 100%; box-sizing: border-box; }
${scope} :is(input,button) { font: inherit; color: inherit; background: var(--surface); padding: var(--space-2); margin: var(--space-1) var(--space-2) var(--space-1) var(--space-0); border: 1px solid var(--border); border-radius: var(--radius-sm); }
${scope} :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
${scope} [role=status] { overflow-wrap: anywhere; }
`;
const notices=`Complete Example Expedition notices

main.mjs derives from the Gravewright documentation Example Expedition sheet.
The system package and this derivative sheet are GPL-3.0-only. The complete GPL
license is in LICENSE.txt. Preserve source availability and applicable notices.

compendiums/expedition.json derives from the original Beacon Expedition Library
example in tutorial-compendiums.mjs. Its original content was published under
the MIT License, Copyright (c) 2026 Gravewright contributors. The full original
MIT notice is preserved in MIT-COMPENDIUM.txt. Changes here update systemId and
the collection name and add the original numeric combat.initiative example.

No rulebook, proprietary catalog, licensed game branding or external artwork is
included. Gear and spell entries are original fictional data, without automated
game rules. English interface labels remain those of the demonstrated sheet.
`;
const readme=`# Complete Example Expedition

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
`;
const files={'main.mjs':sheet.files['main.mjs'],'styles.css':css,'compendiums/expedition.json':JSON.stringify(collection,null,2)+'\n','MIT-COMPENDIUM.txt':library.files['LICENSE.txt'],'THIRD_PARTY_NOTICES.txt':notices,'README.md':readme};
export const completeSystemPackages=[{id,slug:'tutorial-complete-system',manifest,files}];
const fence=(language,text)=>'```'+language+'\n'+text.trimEnd()+'\n```';
const base='../../assets/tutorials/'+id+'/';
function body(locale){
  const pt=locale==='pt',s=(en,br)=>pt?br:en;
  return [
    `## ${s('What the single system ZIP provides','O que o ZIP único do sistema entrega')}`,
    s('Build **Complete Example Expedition** on Gravewright **0.3.0**. This is a functional original system package: complete character/NPC sheet replacements on actor.sheet and token.sheet, a saved stamina field, gear/spell item types, native initiative and three installed compendium packs. No separately installed module or server-rules companion is required. It is a small teaching system, not a complete implementation of a published RPG.','Monte **Complete Example Expedition** no Gravewright **0.3.0**. É um sistema original funcional: substituições completas de fichas de personagem/NPC em actor.sheet e token.sheet, vigor persistido, tipos de item gear/spell, iniciativa nativa e três packs de compêndio. Não exige módulo instalado separadamente nem complemento de regras no servidor. É um sistema pequeno de ensino, não a implementação completa de um RPG publicado.'),
    s('The sheet code is reused from the working [editable system package](docs:example-package-system), and the original JSON is derived from [installed system compendiums](docs:tutorial-system-compendiums). This guide prints every functional file, so you can build from an empty folder. The package is GPL-3.0-only; the MIT notices for the derived original collection remain intact.','O código da ficha reutiliza o [pacote de sistema editável](docs:example-package-system), e o JSON original deriva de [compêndios de sistema instalados](docs:tutorial-system-compendiums). O guia mostra todos os arquivos funcionais para começar com pasta vazia. O pacote é GPL-3.0-only; os avisos MIT da coleção original derivada permanecem intactos.'),
    `## ${s('1. Create the directory and understand the contract','1. Crie a pasta e entenda o contrato')}`,
    `[${s('Download the complete system source ZIP','Baixar ZIP-fonte completo do sistema')}](${base}${id}-source.zip)`,
    fence('text',id+'/\n  manifest.json\n  main.mjs\n  styles.css\n  compendiums/expedition.json\n  LICENSE.txt\n  MIT-COMPENDIUM.txt\n  THIRD_PARTY_NOTICES.txt\n  README.md'),
    s('Create complete-expedition and its compendiums subdirectory. Save the exact files in section 5 as UTF-8. Copy [LICENSE.txt]('+base+'LICENSE.txt) unchanged from the ZIP. Do not replace that GPL license with the separate MIT notice. No npm build, Python app or host source modification is required.','Crie complete-expedition e a subpasta compendiums. Salve os arquivos exatos da seção 5 em UTF-8. Copie [LICENSE.txt]('+base+'LICENSE.txt) sem alterações do ZIP. Não substitua essa licença GPL pelo aviso MIT separado. Não exige build npm, app Python nem alteração no host.'),
    s('The manifest ID example.complete-expedition is also the systemId of every catalog entry. character and npc must match system.actorTypes; gear and spell must match system.itemTypes. content.compendiums names the physical JSON file. The three permitted installed pack types are actor_pack, item_pack and spell_pack; the spell pack follows item import semantics, without adding spell rules to the core.','O ID example.complete-expedition também é o systemId de cada entrada do catálogo. character e npc correspondem a system.actorTypes; gear e spell correspondem a system.itemTypes. content.compendiums aponta para o arquivo JSON físico. Os tipos instalados permitidos são actor_pack, item_pack e spell_pack; o pack de magia segue a importação de itens, sem acrescentar regras de magia ao core.'),
    `## ${s('2. Package, install and create the campaign','2. Empacote, instale e crie a campanha')}`,
    s('From the source folder, use an existing Python interpreter and explicitly list the package files. On POSIX replace python with python3 or the path to the host virtual environment. Keep the output ZIP outside the source folder.','Na pasta dos fontes, use um Python existente e liste explicitamente os arquivos. Em POSIX, substitua python por python3 ou pelo caminho do ambiente do host. Mantenha o ZIP de saída fora da pasta dos fontes.'),
    fence('powershell',`Set-Location -LiteralPath ./complete-expedition
python -m json.tool manifest.json
python -m json.tool compendiums/expedition.json
python -m zipfile -c ../complete-expedition-source.zip manifest.json main.mjs styles.css compendiums/expedition.json LICENSE.txt MIT-COMPENDIUM.txt THIRD_PARTY_NOTICES.txt README.md
python -m zipfile -l ../complete-expedition-source.zip`),
    s('1. As installation owner, open **Inside → Systems → Install system → Install from ZIP**, review and select complete-expedition-source.zip, then click **Install**. Use Systems, because this manifest declares system. Local upload needs explicit trust but no remote catalog signature.\n2. Create a new disposable campaign and choose **Complete Example Expedition** as its system. Enter the table as GM and verify the exact 1.0.0 version in **Gravewright → Extensions → Table modules**. Installing a system does not switch existing campaigns automatically.\n3. In Actors, create one Character and one NPC, then open both sheets. You should see the real Example Expedition sheet form with Stamina, Save and Reload server value. Native window controls remain supplied by the host.','1. Como dono, abra **Inside → Sistemas → Instalar sistema → Instalar de ZIP**, revise e selecione complete-expedition-source.zip e clique **Instalar**. Use Sistemas porque o manifesto declara system. O envio local exige confiança explícita, mas não assinatura remota.\n2. Crie campanha descartável e escolha **Complete Example Expedition** como sistema. Entre como mestre e confira a versão exata 1.0.0 em **Gravewright → Extensions → Table modules**. Instalar sistema não troca campanhas existentes automaticamente.\n3. Em Atores, crie Character e NPC e abra as duas fichas. O formulário real Example Expedition sheet deve mostrar Stamina, Save e Reload server value. Os controles da janela continuam fornecidos pelo host.'),
    `## ${s('3. Import and edit the original content','3. Importe e edite o conteúdo original')}`,
    s('Open **Compendiums**. Under **Complete Expedition Library**, inspect **Scouts**, **Equipment** and **Signals**. As GM, read then import Harbor Scout, Signal Rope and Blue Glow. The entry bodies belong to this system; the API returns those installed collection documents, not an invented envelope with a required kind field. Import creates campaign copies only when requested. Reopening the campaign does not silently import duplicates.','Abra **Compêndios**. Em **Complete Expedition Library**, confira **Scouts**, **Equipment** e **Signals**. Como mestre, leia e importe Harbor Scout, Signal Rope e Blue Glow. Os corpos pertencem a este sistema; a API devolve esses documentos da coleção, sem envelope inventado que exija kind. A importação cria cópias na campanha somente quando solicitada. Reabrir a campanha não importa duplicatas sozinho.'),
    s('Open the imported Harbor Scout actor. Its stored data starts with stamina 8, role Watch keeper and combat.initiative 3. Change Stamina to 17, click Save, close and reopen. The value must remain 17; role and combat must still be present. The sheet copies the existing data and changes only stamina, sending both version and sheetVersion read from the same sheet. Test another session with a stale version; the form reloads on conflict and asks for a review rather than forcing the write.','Abra Harbor Scout importado. Seus dados começam com stamina 8, role Watch keeper e combat.initiative 3. Mude Stamina para 17, clique Save, feche e reabra. O valor deve continuar 17; role e combat devem permanecer. A ficha copia os dados existentes e altera somente stamina, enviando version e sheetVersion da mesma leitura. Teste outra sessão com versão antiga; o formulário recarrega no conflito e pede revisão em vez de forçar a gravação.'),
    s('Create linked and independent tokens for the imported actor. A linked token saves actor data. An independent token uses its own tokenId snapshot and sheetVersion. Changing its stamina must leave the original actor unchanged. With a read-only player, editing and saving are disabled; verify a direct attempted write is also rejected by the server.','Crie tokens vinculados e independentes do ator importado. O vinculado grava no ator. O independente usa snapshot, tokenId e sheetVersion próprios. Alterar seu vigor não pode mudar o ator original. Com jogador somente leitura, edição e gravação ficam bloqueadas; confirme que tentativa direta também é rejeitada pelo servidor.'),
    s('The gear and spell are original item data, not implemented equipment or spell automation. This package reuses the host item interface and does not replace item.sheet with an incomplete custom editor. You may add a complete package-owned item editor later using the [item surface example](docs:example-surface-item-sheet) after checking the target API.','Equipamento e magia são dados originais de item, não automação de regras. O pacote reutiliza a interface de itens do host e não substitui item.sheet por editor incompleto. Um editor completo do pacote pode ser acrescentado depois com o [exemplo de superfície de item](docs:example-surface-item-sheet), após conferir a API alvo.'),
    `## ${s('4. Roll initiative with the actual stored modifier','4. Role iniciativa com o modificador armazenado')}`,
    s('Open a scene, add Harbor Scout or its token to the native initiative tracker and use **Roll initiative**. The package provides formula **1d20+@combat.initiative**, so this imported actor rolls **1d20+3**, a value from 4 through 23. The core resolves this numeric path from the actor or independent snapshot and evaluates the native dice expression. No system-specific calculation derives it from another attribute.','Abra uma cena, adicione Harbor Scout ou seu token à iniciativa nativa e use **Roll initiative / Rolar iniciativa**. O pacote fornece **1d20+@combat.initiative**; o ator importado rola **1d20+3**, de 4 a 23. O core resolve o caminho numérico do ator ou snapshot e avalia a expressão nativa. Nenhum cálculo específico deriva esse modificador de outro atributo.'),
    s('A freshly created actor has no catalog data unless you import it. A missing combat.initiative path resolves to 0, so that actor rolls 1d20. Its form displays stamina 10 as an initial UI default until the user saves. The form does not expose initiative editing; to add that field, implement its input, validation and revision-preserving save inside this package. manualInput number describes numeric manual initiative when applicable; the configured formula selects the native roll input. There is no required external provider.','Um ator criado do zero não recebe dados do catálogo automaticamente. Sem combat.initiative, o caminho vale 0 e ele rola 1d20. O formulário mostra stamina 10 como valor inicial de interface até salvar. A ficha não expõe edição da iniciativa; para acrescentá-la, implemente campo, validação e gravação com revisões neste pacote. manualInput number descreve iniciativa manual numérica quando aplicável; a fórmula configurada seleciona o modo de rolagem nativo. Não exige provedor externo.'),
    `## ${s('5. Complete package files','5. Arquivos completos do pacote')}`,
    '### manifest.json',fence('json',JSON.stringify(manifest,null,2)),
    ...Object.entries(files).flatMap(([name,content])=>['### '+name,fence(name.endsWith('.json')?'json':name.endsWith('.css')?'css':name.endsWith('.mjs')?'javascript':'text',content)]),
    `### LICENSE.txt`,s('Copy the complete unmodified [GNU GPL version 3 license]('+base+'LICENSE.txt) included in the ZIP. The full separate MIT grant for the JSON source is printed in MIT-COMPENDIUM.txt above and must remain with the derived collection.','Copie a [GNU GPL versão 3 completa]('+base+'LICENSE.txt) e sem alterações incluída no ZIP. O aviso MIT separado dos fontes JSON está reproduzido em MIT-COMPENDIUM.txt acima e deve permanecer com a coleção derivada.'),
    `## ${s('6. Verify upgrades, language choices and deactivation','6. Confira atualização, idioma e desativação')}`,
    s('Keep the system ID and pack/entry IDs stable. For a change, increment version to 1.0.1, rebuild, install through Systems and select the exact release for the campaign. Test old characters, both token modes, saved stamina and initiative. Already imported documents are copies and are not rewritten by catalog updates. Never edit installed extracted files or replace the same version with different bytes.','Mantenha ID do sistema e IDs dos packs/entradas estáveis. Para alterar, aumente version para 1.0.1, gere o ZIP, instale em Sistemas e selecione a release exata da campanha. Teste personagens antigos, os dois modos de token, vigor salvo e iniciativa. Documentos importados são cópias e não são reescritos pelo catálogo atualizado. Não edite arquivos instalados nem troque bytes na mesma versão.'),
    s('Language selection is an installation-wide package plus a per-account preference; do not add locales to this system manifest. Follow the [language tutorial](docs:tutorial-language-package) separately. Close the sheet while saving, test invalid and stale drafts, deactivate or change the selected system only on a disposable campaign, and verify disposal and retained documents. A system without an active compatible sheet may leave its documents without a usable editor until reactivated; deactivation is not a data migration.','Idioma usa pacote global e preferência por conta; não acrescente locales ao manifesto do sistema. Siga separadamente o [tutorial de idioma](docs:tutorial-language-package). Feche durante gravação, teste rascunhos inválidos e antigos, desative ou troque o sistema somente em campanha descartável e confira liberação de recursos e documentos preservados. Sem ficha compatível ativa, documentos podem ficar sem editor útil até reativar; desativação não migra dados.'),
    `## ${s('How to use AI to extend this complete system','Como usar a IA para ampliar este sistema completo')}`,
    fence('text',s('Extend the complete example.complete-expedition package on Gravewright 0.3.0 with [one original rule or field]. Preserve the functional actor/token replacements, typed item registrations, formula 1d20+@combat.initiative, installed actor/item/spell packs and their matching systemId. Explain stored modifiers versus derived automation. Keep one installable system package and GPL/MIT notices. Deliver all changed files, exact versions, ZIP instructions and create/import/edit/save/reopen/token/initiative tests. Do not invent unsupported host APIs, add a separately installed Server Rules companion or ship proprietary rules/catalogs.','Amplie o pacote completo example.complete-expedition no Gravewright 0.3.0 com [uma regra ou campo original]. Preserve fichas funcionais de ator/token, tipos de item, fórmula 1d20+@combat.initiative, packs de ator/item/magia e systemId correto. Diferencie modificador armazenado de automação derivada. Mantenha pacote único e avisos GPL/MIT. Entregue arquivos alterados, versões exatas, comandos de ZIP e testes de criar/importar/editar/salvar/reabrir/tokens/iniciativa. Não invente APIs, crie Server Rules separado nem distribua regras/catálogos proprietários.')),
    '[SDK](docs:modules) · ['+s('Publish a release','Publicar uma release')+'](docs:tutorial-publish-module) · ['+s('All tutorials','Todos os tutoriais')+'](docs:tutorial-index)'
  ].join('\n\n');
}
export const completeSystemArticles=[{slug:'tutorial-complete-system',group:'tutorials',sourcePaths:['gravewright/modules/contracts/schemas/manifest.json','gravewright/actors/services.py','gravewright/compendiums/content.py','gravewright/compendiums/catalog.py','gravewright/compendiums/services.py','gravewright/combat/services.py','gravewright/modules/static/gravewright_modules/module-runtime.js'],en:{title:'How to create a complete original system package',summary:'One installable ZIP with working actor/token sheets, item types, stored initiative and three original compendium packs.',body:body('en')},pt:{title:'Como criar um pacote de sistema original completo',summary:'Um ZIP instalável com fichas de ator/token funcionais, tipos de item, iniciativa armazenada e três packs originais.',body:body('pt')}}];

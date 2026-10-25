Gravewright Blueprint examples / Exemplos de Blueprint
Host: 0.3.3, source revision cc4fd089e6d49d32808c45ee90fdae21d1ad17dc

These are synthetic Blueprint v2 development fixtures, not installable module
packages, complete Builder projects or campaign archives. Recreate them in the
Smart Object editor. No Smart Object JSON import button is assumed.

Extract this folder to data/blueprint-examples in a disposable source checkout.
From the host root, run:

    uv run --locked python data/blueprint-examples/check-examples.py --host .

The checker calls the host's internal validator/evaluator, uses an in-memory
database and rejects database queries. It does not execute live gameplay effects.
Use Test behavior and GM/player playtesting to check real owned targets,
permissions, native component settings and complete server chains.

Main recipes:
    door-toggle.json
    lever-toggle.json
    torch-turn-flame.json
    region-pressure-plate.json
    execution-data.json

nodes/ contains a complete graph for each of the 49 validated node types.
node-catalog.json records each central node. resources.json contains synthetic
UUIDs: replace them through the actual editor selectors, not arbitrary live
database writes. A UUID passing syntax validation does not grant ownership.
setAppearance requires a compatible dynamic surface Target. Teleport requires
a verified triggering token and a destination in the same scene. Self state
and scene state are not changed by the local evaluator.
requestRoll predicts a prompt with expression, label, visibility and audience;
it does not roll dice or wait for a result. Eligible recipients explicitly roll
through the native prompt; streamers do not receive it. setQuestStatus predicts
a change to an existing campaign quest. Bind resources.quest through the editor;
the live server requires an active GM authority and grants no general journal
editing permission to an interacting player. The checker tries both roll
visibilities and all six quest statuses without drawing dice or querying data.

Estes arquivos sao fixtures sinteticas de desenvolvimento de Blueprint v2.
Nao sao modulos instalaveis, projetos completos do Builder ou campanhas.
Recrie os nos no editor. Nao se presume um botao de importar JSON de Blueprint.
Extraia em data/blueprint-examples de um checkout descartavel e execute o
comando acima. O verificador valida o formato e preve acoes, sem consultar banco.
Use Test behavior e teste como GM/jogador para conferir alvos reais,
autorizacao, componentes e cadeias completas no servidor.
O catalogo inclui os 49 tipos de no do host 0.3.3. requestRoll preve um pedido
de rolagem, sem rolar dados nem esperar o resultado; cada destinatario elegivel
escolhe rolar na janela nativa, e streamers nao recebem o pedido. setQuestStatus
preve uma mudanca em missao existente da campanha: vincule resources.quest pelo
editor. O servidor exige autoridade de GM ativo e nao concede ao jogador
permissao geral de editar diarios. O verificador cobre as duas visibilidades de
rolagem e os seis status de missao, sem rolar dados nem consultar banco.

All example messages and fixtures are original synthetic documentation content.

New in 0.3.2: clockControl and clueControl change only the selected authored
progress resource; live execution requires an active campaign GM authority.
openMindMap opens only a permitted map and optional topic for its audience;
it does not share the map or grant access to linked documents. mindMapNode
marks one existing topic complete, incomplete or toggled through a specific
GM-authored action, without granting general map editing permissions.
Bind the synthetic clock, clue, mind map and topic UUIDs through the real editor.
The checker predicts actions without querying or changing real resources.

Novos na 0.3.2: clockControl e clueControl alteram somente o progresso escolhido
pelo autor; a execução exige autoridade de um GM ativo da campanha. openMindMap
abre mapa/tópico permitido para seu público, sem compartilhar o mapa ou conceder
acesso aos documentos vinculados. mindMapNode altera a conclusão de um tópico
por ação específica do GM, sem conceder edição geral. Escolha recursos reais
pelos seletores do editor; o verificador só prevê ações com UUIDs sintéticos.

New in 0.3.3: shaderControl changes one selected native shader parameter.
Bind resources.shader to a real shader through the editor. The opacity example
sets 0.35; connect a Number variable to Value to use a dynamic value.
Boolean enabled and six-digit hexadecimal color use Boolean and Text inputs.
Torch flame/layer visibility still gates component shaders. This action cannot
replace GLSL source. Rehearse before live execution; the checker validates
fixed and connected values, bounds, target allowlists and execution continuation.

Novo na 0.3.3: shaderControl altera um parametro do shader nativo selecionado.
Vincule resources.shader a um shader real pelo editor. O exemplo usa opacidade
0.35; conecte uma variavel Number a Value para usar um valor dinamico.
Ativacao booleana e cor hexadecimal usam entradas Boolean e Text. A chama e a
visibilidade da camada continuam controlando os shaders de tochas. A acao nao
substitui codigo GLSL. Teste antes de executar; o verificador cobre valores
fixos/conectados, limites, alvos permitidos e continuacao da execucao.

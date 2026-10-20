Gravewright Blueprint examples / Exemplos de Blueprint
Host: 0.3.0, source revision 23ea61b8efb566cad0e3359489b0dad45e214906

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

nodes/ contains a complete graph for each of the 42 validated node types.
node-catalog.json records each central node. resources.json contains synthetic
UUIDs: replace them through the actual editor selectors, not arbitrary live
database writes. A UUID passing syntax validation does not grant ownership.
setAppearance requires a compatible dynamic surface Target. Teleport requires
a verified triggering token and a destination in the same scene. Self state
and scene state are not changed by the local evaluator.

Estes arquivos sao fixtures sinteticas de desenvolvimento de Blueprint v2.
Nao sao modulos instalaveis, projetos completos do Builder ou campanhas.
Recrie os nos no editor. Nao se presume um botao de importar JSON de Blueprint.
Extraia em data/blueprint-examples de um checkout descartavel e execute o
comando acima. O verificador valida o formato e preve acoes, sem consultar banco.
Use Test behavior e teste como GM/jogador para conferir alvos reais,
autorizacao, componentes e cadeias completas no servidor.

All example messages and fixtures are original synthetic documentation content.

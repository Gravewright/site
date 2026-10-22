// Product procedures derived from the public Gravewright 0.3.1 project.
const userGuide = ['docs/en/user-guide.md', 'docs/pt-BR/user-guide.md'];
const builderGuide = ['docs/en/map-builder.md', 'docs/pt-BR/map-builder.md'];
const releaseNotes = ['docs/releases/0.3.1.md'];
const article = (slug, group, sourcePaths, en, pt, related = [], mediaIds = []) => ({
  slug, group, sourcePaths, en, pt, related, mediaIds,
});
const text = (title, summary, body) => ({ title, summary, body });

export const wikiArticles = [
  article('getting-started', 'start', [...userGuide, 'README.md', 'README.pt-BR.md'],
    text('Your first session', 'Go from an installed Gravewright to a shared scene with characters, notes and dice.', `
## Choose your role

Gravewright is a self-hosted virtual tabletop played in a browser. One person operates the installation; campaign game masters prepare the adventure; players join campaigns. These responsibilities are related but have different permissions. Version 0.3.1 is an alpha preview: plan a short rehearsal before relying on a new feature during play.

If someone already hosts your game, ask for its address and invitation code. You do not need another server installation to join.

## Prepare your first game

1. The host follows [Installation](wiki:installation), starts the generated Runner and opens the supplied address. On a new installation, create the first owner at **/setup**.
2. The owner creates a campaign in the campaign library. Choose the native PDF system or a compatible installed system for the sheets you intend to use.
3. Open the tabletop. Create or upload a scene, configure its grid and prepare it privately.
4. Create actors, attach or configure their sheets, assign player access and place their tokens.
5. Add a journal or handout. Check which content each player can read.
6. Invite a player with a campaign code. Use a separate player session to verify the result.
7. Choose **Activate for players** on the prepared scene. Send a chat message and try **1d20 + 3** in the dice interface.

## Check the result

Both sessions should show the intended broadcast scene. The player should control their character and see only shared material. Opening a private scene as GM does not broadcast it. Saving a Map Builder project does not generate or broadcast a scene.

## If something is missing

Check campaign membership, document permissions and the broadcast scene before reuploading content. For an empty canvas, confirm that the browser supports WebGL and inspect network errors. Reconnecting or refreshing reloads the state authorized for that account. Keep a backup of the installation before significant imports or updates.
`),
    text('Sua primeira sessão', 'Da instalação a uma cena compartilhada com personagens, anotações e dados.', `
## Escolha seu papel

Gravewright é uma mesa virtual hospedada por você e acessada pelo navegador. Uma pessoa opera a instalação; os mestres de cada campanha preparam a aventura; jogadores entram nas campanhas. Essas responsabilidades têm permissões diferentes. A versão 0.3.1 é uma prévia alpha: ensaie recursos novos antes de depender deles durante a partida.

Se alguém já hospeda sua mesa, peça o endereço e o código de convite. Não é necessário instalar outro servidor para participar.

## Prepare sua primeira partida

1. O responsável segue [Instalação](wiki:installation), inicia o Runner gerado e abre o endereço informado. Numa instalação nova, cria o primeiro proprietário em **/setup**.
2. O proprietário cria uma campanha na biblioteca. Escolha o sistema PDF nativo ou um sistema instalado compatível com as fichas pretendidas.
3. Abra a mesa. Crie ou envie uma cena, configure a grade e prepare-a em particular.
4. Crie atores, anexe ou configure suas fichas, conceda acesso aos jogadores e coloque seus tokens.
5. Adicione um diário ou material. Confira o que cada jogador pode ler.
6. Convide um jogador com um código da campanha. Use outra sessão como jogador para conferir o resultado.
7. Escolha **Ativar para jogadores** na cena preparada. Envie uma mensagem e experimente **1d20 + 3** na interface de dados.

## Confira o resultado

As duas sessões devem mostrar a cena transmitida pretendida. O jogador deve controlar seu personagem e ver somente os materiais compartilhados. Abrir uma cena privada como mestre não a transmite. Salvar um projeto do Map Builder não gera nem transmite uma cena.

## Se algo estiver faltando

Confira vínculo com a campanha, permissões dos documentos e cena transmitida antes de reenviar conteúdo. Se o tabuleiro estiver vazio, confira suporte a WebGL e erros de rede no navegador. Reconectar ou atualizar recarrega o estado autorizado para aquela conta. Faça backup antes de importações ou atualizações importantes.
`), ['installation', 'campaigns', 'scenes']),

  article('installation', 'setup', ['README.md', 'README.pt-BR.md', 'docs/en/windows-runner.md', 'docs/pt-BR/windows-runner.md', 'docs/en/linux-runner.md', 'docs/en/macos-runner.md'],
    text('Install and start Gravewright', 'Prepare a portable installation on Windows, Linux or macOS and understand what the Runner does.', `
## Before you begin

Download the complete official release ZIP and extract it to a writable folder. Preserve the folder structure. The installer prepares dependencies and configuration; the generated Runner starts an installation that has already been prepared. Missing tools and packages require internet for their first download.

| Platform | Installer | Start after installation |
| --- | --- | --- |
| Windows x64 | Install Windows.bat | Gravewright Runner.bat |
| Linux x64 / ARM64 | bash "./Install Linux.sh" | Gravewright Runner.sh |
| macOS Intel / Apple Silicon | Install macOS.command | Gravewright Runner.command |

Windows requires Windows 10 version 1803 or newer, or Windows 11. macOS requires 13.5 or newer. Managed Linux downloads target glibc distributions. Intel Macs also need Apple Command Line Tools and the SDK; the initial cryptography build may take longer.

## Install and launch

1. Run the installer for your platform from the extracted installation and answer its configuration prompts.
2. Start the generated Runner. Keep its terminal open while playing.
3. Open the address shown; the usual local address is **http://127.0.0.1:3000**.
4. Create the owner at **/setup**, then enter the campaign library.
5. Press **Ctrl+C** in the Runner terminal when you want to stop the server.

## Find your files

Defaults stay inside this installation: configuration and secrets in **.env**, database in **data/gravewright.sqlite3**, uploads and packages in **data/media/**, logs in **data/logs/**, tools and caches in **data/runner/**. Keep these together when backing up. Two extracted installations have independent state.

## Recover from startup problems

If the Runner says prepared tools are missing, rerun the installer in the complete folder. Rerun it after moving or updating the installation. On Linux/macOS, use bash with the quoted script name if double-click launch fails. A permission failure needs the reported folder made writable; do not move only the database as a workaround.

The generated Runner serves the local computer on loopback. Remote players need an intentionally configured public host with HTTPS and WebSockets; see the developer deployment reference. A running local address alone does not make your table reachable over the internet.
`),
    text('Instalar e iniciar o Gravewright', 'Prepare uma instalação portátil no Windows, Linux ou macOS e entenda o Runner.', `
## Antes de começar

Baixe o ZIP completo da release oficial e extraia-o para uma pasta gravável. Preserve sua estrutura. O instalador prepara dependências e configuração; o Runner gerado inicia uma instalação já preparada. Ferramentas e pacotes ausentes precisam de internet no primeiro download.

| Plataforma | Instalador | Iniciar após instalar |
| --- | --- | --- |
| Windows x64 | Install Windows.bat | Gravewright Runner.bat |
| Linux x64 / ARM64 | bash "./Install Linux.sh" | Gravewright Runner.sh |
| macOS Intel / Apple Silicon | Install macOS.command | Gravewright Runner.command |

O Windows exige Windows 10 versão 1803 ou superior, ou Windows 11. O macOS exige 13.5 ou superior. Os downloads Linux gerenciados atendem distribuições glibc. Macs Intel também precisam das Command Line Tools e do SDK Apple; a primeira compilação de cryptography pode demorar mais.

## Instale e inicie

1. Execute o instalador da plataforma na instalação extraída e responda às perguntas de configuração.
2. Inicie o Runner gerado. Mantenha seu terminal aberto durante a partida.
3. Abra o endereço informado; o endereço local habitual é **http://127.0.0.1:3000**.
4. Crie o proprietário em **/setup** e entre na biblioteca de campanhas.
5. Pressione **Ctrl+C** no terminal do Runner para encerrar o servidor.

## Encontre seus arquivos

Os padrões ficam dentro desta instalação: configuração e segredos em **.env**, banco em **data/gravewright.sqlite3**, uploads e pacotes em **data/media/**, logs em **data/logs/**, ferramentas e caches em **data/runner/**. Inclua esse conjunto no backup. Duas instalações extraídas mantêm estados independentes.

## Recupere uma falha de inicialização

Se o Runner informar ferramentas preparadas ausentes, execute novamente o instalador na pasta completa. Faça isso também depois de mover ou atualizar a instalação. No Linux/macOS, use bash com o nome do script entre aspas se a abertura por clique falhar. Uma falha de permissão exige tornar gravável a pasta indicada; não mova somente o banco como solução.

O Runner gerado atende o computador local em loopback. Jogadores remotos precisam de hospedagem pública configurada intencionalmente com HTTPS e WebSockets; consulte a referência de implantação para devs. Um endereço local funcionando não torna a mesa acessível pela internet.
`), ['getting-started', 'backups-updates']),

  article('campaigns', 'campaign', [...userGuide, ...releaseNotes, 'gravewright/campaigns/services.py', 'gravewright/campaigns/streamer.py'],
    text('Campaigns, invitations and players', 'Create a campaign, invite people and distinguish player accounts from spectator links.', `
## Create the campaign

The installation owner creates campaigns in the campaign library at **/inside**. Choose a meaningful name, cover and system appropriate to your sheets. Open the campaign to prepare its tabletop. A campaign keeps its own membership and resources; joining one does not grant access to another.

The built-in **Gravewright PDF System** is a general sheet foundation. Other RPG systems are installed separately. Confirm compatibility before building a campaign around an optional package.

## Choose or change the cover

1. Open campaign creation or editing in the library. Fill in the campaign fields and choose the cover source: **From computer** or **By URL**. Local images support PNG, JPEG or WebP, up to 5 MB.
2. For a local image, drag it onto the upload area or focus the file control and activate it with the keyboard. The operating system's file picker still opens when choosing a file. For a URL, use the URL field instead.
3. Inspect the preview before saving. **Remove image** clears a newly selected image or an existing saved cover. Selecting the already active source again keeps the current image; changing the source clears that selection so you can choose its replacement.
4. Save the form and check the campaign card. If validation fails, correct the indicated field and submit again.

Campaign dialogs and the other host forms use the same themed fields, upload controls, focus and error states. On a narrow screen, scroll within the modal to reach its actions. Actor and folder creation also use application modals: **Cancel** closes without creating the resource, and controls pause while saving. Keep the form open until success or a useful error appears.

## Invite a player

1. Ask the player to register at **/register**, or log in at **/login** if they already have an account.
2. As campaign GM, create an access code and choose its validity and maximum uses.
3. Give the player the host address and the code through your usual private channel.
4. Have them join the campaign, then check their membership and assign the appropriate actor and document access.
5. Revoke the code when it is no longer needed.

Successful entry by a new member increments the code's use count. If joining fails, check expiration, revocation, remaining uses and the campaign associated with the code. An account on the server does not automatically become a member of every campaign.

## Prepare for the session

Use folders and clear names for scenes, actors and journals. Prepare private scenes without broadcasting them; activate the intended scene when the group is ready. If lobby/readiness controls are enabled, use them to coordinate the start.

## Use spectator access deliberately

A streamer link is restricted read-only access. It does not replace a player account and cannot edit the campaign or its Map Builder projects. Test what the spectator actually sees before broadcasting; private GM preparation and player document permissions still need deliberate configuration.

To troubleshoot a missing actor or journal, check resource access after confirming membership. To troubleshoot a missing map, check scene visibility and the current broadcast. See [Permissions](wiki:permissions) for a practical rehearsal.
`),
    text('Campanhas, convites e jogadores', 'Crie uma campanha, convide pessoas e diferencie contas de jogador de links de transmissão.', `
## Crie a campanha

O proprietário da instalação cria campanhas na biblioteca em **/inside**. Escolha nome, capa e sistema adequados às fichas. Abra a campanha para preparar a mesa. Cada campanha possui seus membros e recursos; entrar em uma não concede acesso às outras.

O **Gravewright PDF System** integrado oferece uma base genérica para fichas. Outros sistemas de RPG são instalados separadamente. Confira a compatibilidade antes de organizar sua campanha em torno de um pacote opcional.

## Escolha ou troque a capa

1. Abra a criação ou edição da campanha na biblioteca. Preencha os campos e escolha a origem da capa: do computador ou por URL. Imagens locais aceitam PNG, JPEG ou WebP, até 5 MB.
2. Para uma imagem local, arraste-a até a área de upload ou foque o controle de arquivo e o acione pelo teclado. Escolher um arquivo continua abrindo o seletor do sistema operacional. Para uma URL, use o campo de endereço.
3. Confira a prévia antes de salvar. **Remover imagem** limpa tanto uma imagem recém-selecionada quanto a capa já salva. Clicar novamente na origem ativa preserva a imagem; trocar de origem limpa a seleção para você escolher a substituta.
4. Salve e confira o cartão da campanha. Se houver erro de validação, corrija o campo indicado e envie novamente.

Os modais de campanha e os demais formulários do host compartilham campos, uploads, foco e estados de erro no tema da aplicação. Em telas estreitas, role dentro do modal até as ações. A criação de atores e pastas também usa modais da aplicação: **Cancelar** fecha sem criar o recurso, e os controles aguardam durante o salvamento. Mantenha o formulário aberto até receber sucesso ou uma mensagem de erro útil.

## Convide um jogador

1. Peça ao jogador que se cadastre em **/register**, ou entre por **/login** se já possuir conta.
2. Como mestre da campanha, crie um código de acesso e escolha validade e máximo de usos.
3. Envie o endereço da hospedagem e o código pelo canal privado que vocês utilizam.
4. Peça que ele entre na campanha; confira seu vínculo e atribua acesso ao ator e aos documentos apropriados.
5. Revogue o código quando ele não for mais necessário.

A entrada bem-sucedida de um novo membro incrementa o contador de usos. Se falhar, confira expiração, revogação, usos restantes e campanha associada. Ter conta no servidor não torna a pessoa membro de todas as campanhas.

## Prepare a sessão

Use pastas e nomes claros para cenas, atores e diários. Prepare cenas privadas sem transmiti-las; ative a cena pretendida quando o grupo estiver pronto. Se os controles de lobby/prontidão estiverem habilitados, use-os para coordenar o início.

## Use o acesso de espectador intencionalmente

Um link de transmissão oferece acesso restrito de leitura. Não substitui uma conta de jogador e não permite editar a campanha nem projetos do Map Builder. Confira o que o espectador vê antes de transmitir; preparação privada do mestre e permissões de documentos continuam exigindo configuração.

Se faltar um ator ou diário, confira o acesso ao recurso depois de confirmar o vínculo. Se faltar um mapa, confira visibilidade da cena e transmissão atual. Veja um ensaio prático em [Permissões](wiki:permissions).
`), ['permissions', 'actors', 'scenes']),

  article('permissions', 'campaign', [...userGuide, 'gravewright/table/ownership.py', 'gravewright/journals/services.py', 'gravewright/campaigns/streamer.py'],
    text('Permissions and safe sharing', 'Check exactly what a player can view, edit or control before sharing your preparation.', `
## Understand the boundaries

The installation owner administers the host. A campaign GM manages that campaign. Players receive access through campaign membership and resource permissions. A streamer remains read-only. Server checks apply to actions and protected files; a URL or a visible button is not an access grant.

Actor and journal access use levels such as **None**, **Limited**, **Read** and **Owner**. The exact limited preview depends on the resource. Read access does not grant editing or token control. Scene access, token ownership, journal page access and GM-only sections are separate decisions.

## Rehearse sharing

1. Keep your GM session open and sign in as a player in a separate browser profile.
2. Give that player the intended actor permissions. Verify that its sheet opens and that unrelated actors remain protected.
3. Place the actor's token in a visible scene and test movement with the player account.
4. Share one journal and one page intentionally. Include a harmless sample GM secret and confirm it is absent from the player view.
5. Activate the intended scene for players and verify the broadcast.
6. If you use a streamer link, inspect it independently of the player session.

## Avoid accidental disclosure

Editor layer visibility in Map Builder is an editing aid: preview and generation include all project layers. Use the tabletop's GM visibility controls for private scene images. A screenshot, download or export can have a different audience from the live table.

Universal VTT omits GM-only images, but secret-door geometry may still be present in its exported file. Review it before sending it to players. Never assume that a campaign export is a player-safe handout.

## When access looks wrong

Check the account, campaign role and explicit permission on the particular resource or page. Confirm that the intended scene is public and broadcast. Reconnect after permissions or memberships change to verify fresh authorized state. Grant the smallest access needed instead of making all documents public to diagnose one missing resource.
`),
    text('Permissões e compartilhamento seguro', 'Confira o que o jogador pode ver, editar ou controlar antes de compartilhar sua preparação.', `
## Entenda os limites

O proprietário administra a instalação. O mestre gerencia sua campanha. Jogadores recebem acesso por vínculo com a campanha e permissões dos recursos. Um streamer continua somente leitura. O servidor verifica ações e arquivos protegidos; possuir uma URL ou ver um botão não concede acesso.

Acesso a atores e diários utiliza níveis como **Nenhum**, **Limitado**, **Leitura** e **Proprietário**. A prévia limitada depende do recurso. Leitura não concede edição nem controle de token. Acesso à cena, propriedade de tokens, páginas do diário e seções exclusivas do mestre são decisões separadas.

## Ensaie o compartilhamento

1. Mantenha a sessão de mestre e entre como jogador em outro perfil do navegador.
2. Conceda as permissões pretendidas ao ator. Confira que sua ficha abre e que atores não relacionados permanecem protegidos.
3. Coloque o token do ator numa cena visível e teste o movimento pela conta do jogador.
4. Compartilhe intencionalmente um diário e uma página. Inclua um segredo fictício inofensivo do mestre e confirme sua ausência na visão do jogador.
5. Ative a cena pretendida para jogadores e confira a transmissão.
6. Se usar link de transmissão, confira-o independentemente da sessão do jogador.

## Evite revelar material por engano

Ocultar camadas no Map Builder ajuda na edição: prévia e geração incluem todas as camadas do projeto. Use os controles de visibilidade do mestre na mesa para imagens privadas. Capturas, downloads e exportações podem ter público diferente da mesa ao vivo.

Universal VTT omite imagens exclusivas do mestre, mas a geometria de portas secretas ainda pode estar no arquivo exportado. Confira antes de enviá-lo aos jogadores. Não presuma que uma exportação de campanha seja um material seguro para jogadores.

## Quando o acesso parecer incorreto

Confira conta, papel na campanha e permissão explícita do recurso ou página. Confirme que a cena pretendida está pública e transmitida. Reconecte depois de alterações para verificar o estado autorizado atual. Conceda o acesso necessário ao recurso, em vez de tornar todos os documentos públicos para diagnosticar um único item ausente.
`), ['campaigns', 'journals', 'tokens']),

  article('tabletop', 'table', [...userGuide, 'gravewright/table/dock.json'],
    text('Navigate and run the tabletop', 'Find the tools for the current scene and establish a dependable session routine.', `
## Find your workspace

The tabletop combines the map canvas, tool controls, resource directories and windows for sheets and documents. Available controls depend on your role, the active tool and installed modules. Game masters can prepare privately while players stay on the broadcast scene.

The main resource areas are scenes, actors, journals, chat and dice, audio, cards, combat and compendiums. The system provides sheet and rule behavior; browser modules may extend the interface.

## Start a session

1. Open the campaign and confirm that its required system and modules load.
2. Open the intended scene as GM. Check the grid, walls, lighting and initial camera view.
3. Confirm actor ownership and place the required tokens.
4. Open the journals and reference material you need; share only the intended pages.
5. Activate the scene for players and check a player session.
6. Have players send a message, roll dice and interact with the table before starting the encounter.

## Work on the map

Choose the tool for the operation: selection and movement, drawing, measurement, walls, fog, lighting, pings or effects. A selected token must be controlled and unlocked before it can move. Changing the active tool can explain why a click selects, measures or draws instead of moving a piece.

Keep the scene's complexity appropriate for the browsers in your group. WebGL is required for map rendering. Heavy visual effects, large images and many objects can affect clients differently; simplify and compare with a small scene when diagnosing rendering problems.

## Reconnect and finish

If updates stop, check the network and reconnect. Refreshing reloads authorized server state; it does not turn an unsaved browser draft into a saved project. Keep an interrupted Builder tab open until recovery is complete.

At the end, stop audio, confirm important edits have saved and take a campaign snapshot or installation backup when appropriate. The host can stop the Runner with **Ctrl+C** after the group has left.
`),
    text('Navegar e conduzir a mesa', 'Encontre as ferramentas da cena e estabeleça uma rotina confiável para a sessão.', `
## Encontre sua área de trabalho

A mesa reúne o mapa, controles de ferramentas, diretórios de recursos e janelas de fichas e documentos. Os controles disponíveis dependem do seu papel, ferramenta ativa e módulos instalados. O mestre pode preparar material em particular enquanto jogadores continuam na cena transmitida.

As áreas principais são cenas, atores, diários, chat e dados, áudio, cartas, combate e compêndios. O sistema fornece comportamento de fichas e regras; módulos de navegador podem ampliar a interface.

## Inicie uma sessão

1. Abra a campanha e confira o carregamento do sistema e dos módulos necessários.
2. Abra a cena pretendida como mestre. Confira grade, paredes, iluminação e visão inicial.
3. Confirme a propriedade dos atores e coloque os tokens necessários.
4. Abra os diários e materiais de referência; compartilhe somente as páginas pretendidas.
5. Ative a cena para jogadores e confira uma sessão de jogador.
6. Peça que enviem uma mensagem, rolem dados e interajam com a mesa antes do encontro.

## Trabalhe no mapa

Escolha a ferramenta da operação: seleção e movimento, desenho, medição, paredes, neblina, iluminação, pings ou efeitos. O token selecionado precisa estar sob seu controle e desbloqueado para mover. A ferramenta ativa pode explicar por que um clique seleciona, mede ou desenha em vez de mover uma peça.

Mantenha a complexidade da cena adequada aos navegadores do grupo. A renderização do mapa exige WebGL. Efeitos pesados, imagens grandes e muitos objetos afetam cada cliente de forma diferente; simplifique e compare com uma cena pequena ao investigar problemas.

## Reconecte e encerre

Se as atualizações pararem, confira a rede e reconecte. Atualizar a página recarrega o estado autorizado do servidor; não transforma um rascunho local em projeto salvo. Mantenha aberta uma aba interrompida do Builder até concluir a recuperação.

Ao terminar, pare o áudio, confirme o salvamento de edições importantes e faça um snapshot da campanha ou backup da instalação quando adequado. O responsável pode encerrar o Runner com **Ctrl+C** depois que o grupo sair.
`), ['scenes', 'tokens', 'chat-dice']),

  article('scenes', 'table', [...userGuide, ...builderGuide, ...releaseNotes, 'gravewright/maps/services.py'],
    text('Scenes, grids and the player broadcast', 'Prepare a map privately, choose an import method and put the intended scene on screen.', `
## Choose how to create the scene

| Starting material | Use | Result |
| --- | --- | --- |
| A finished map image | New scene → Upload map | A native scene |
| An editable map you want to build | New scene → Map Builder | An editable project, then a generated scene |
| A finished image to decorate in the Builder | Library → Import → Import ready-made map | A project background with editable additions |
| A .uvtt, .dd2vtt or .df2vtt file | Import Universal VTT | A native scene with supported geometry and lighting |

A normal image upload does not discover walls or reconstruct original layers. Universal VTT imports do not create Builder projects.

## Prepare and share

1. As campaign GM, create the scene in the intended folder.
2. Configure its name, grid and initial view. Match the cell size and image alignment before placing tokens.
3. Add or inspect walls, doors, fog and lights using the scene tools.
4. Place a test token and check movement and vision with a player account.
5. Choose **Activate for players** when the scene is ready. This makes it visible and broadcasts it in one operation.

Opening a scene privately as GM preserves the players' broadcast. Generating a Builder scene also begins privately; broadcasting remains a separate action. Updating a linked scene changes what clients already viewing that scene receive.

## Manage generated scenes carefully

Scenes linked to a Builder project have a red map icon for the GM and an **Edit with MapBuilder** action. Reopen the project there and use **Update scene** to apply changes to the same scene. Compatible manual edits to generated resources are imported when opening the project, returning to its tab and before updating. Scene-only objects stay separate. Changes to different properties can merge; competing edits to the same property pause synchronization and preserve your local draft. Follow [Builder synchronization and recovery](wiki:map-builder) before continuing.

## Troubleshoot

If players see the previous map, check the broadcast and the success of scene generation/update. For an upload timeout, inspect the scene directory before uploading again: server processing may have finished after the connection closed. Image byte size, decoded pixels, dimensions and tile counts have separate limits configured by the host. A larger byte allowance does not guarantee that a huge image can be rendered.
`),
    text('Cenas, grades e transmissão', 'Prepare um mapa em particular, escolha a importação e coloque a cena pretendida na tela dos jogadores.', `
## Escolha como criar a cena

| Material inicial | Use | Resultado |
| --- | --- | --- |
| Imagem de mapa pronta | Nova cena → Enviar mapa | Cena nativa |
| Mapa que você deseja construir e editar | Nova cena → Map Builder | Projeto editável e depois cena gerada |
| Imagem pronta para complementar no Builder | Biblioteca → Importar → Importar mapa pronto | Fundo do projeto com acréscimos editáveis |
| Arquivo .uvtt, .dd2vtt ou .df2vtt | Importar Universal VTT | Cena nativa com geometria e luzes suportadas |

Enviar uma imagem comum não detecta paredes nem reconstrói camadas originais. Importações Universal VTT não criam projetos do Builder.

## Prepare e compartilhe

1. Como mestre da campanha, crie a cena na pasta pretendida.
2. Configure nome, grade e visão inicial. Ajuste tamanho da célula e alinhamento da imagem antes de posicionar tokens.
3. Adicione ou confira paredes, portas, neblina e luzes pelas ferramentas da cena.
4. Coloque um token de teste e confira movimento e visão pela conta de jogador.
5. Escolha **Ativar para jogadores** quando estiver pronta. A ação torna a cena visível e a transmite de uma vez.

Abrir uma cena em particular como mestre preserva a transmissão dos jogadores. Gerar uma cena no Builder também começa em particular; transmitir é uma ação separada. Atualizar uma cena vinculada altera o que recebem os clientes que já estão vendo essa cena.

## Cuide das cenas geradas

Cenas vinculadas a projetos do Builder têm ícone de mapa vermelho para o mestre e a ação **Editar com MapBuilder**. Reabra por ela e use **Atualizar cena** para aplicar mudanças à mesma cena. Edições manuais compatíveis em recursos gerados são importadas ao abrir o projeto, voltar à sua aba e antes de atualizar. Objetos exclusivos da cena ficam separados. Mudanças em propriedades diferentes podem se combinar; edições concorrentes da mesma propriedade pausam a sincronização e preservam o rascunho local. Siga [sincronização e recuperação do Builder](wiki:map-builder) antes de continuar.

## Solucione problemas

Se jogadores ainda veem o mapa anterior, confira a transmissão e o sucesso da geração/atualização. Se houver timeout de upload, confira o diretório antes de reenviar: o processamento pode ter terminado depois da perda da conexão. Tamanho em bytes, pixels decodificados, dimensões e quantidade de tiles possuem limites separados definidos pelo host. Aceitar mais bytes não garante que uma imagem enorme possa ser renderizada.
`), ['map-builder', 'universal-vtt', 'permissions']),

  article('actors', 'tools', [...userGuide, 'gravewright/actors/services.py', 'gravewright/tokens/services.py'],
    text('Actors and your character directory', 'Organize reusable character documents, grant ownership and place representations in scenes.', `
## Actor or token?

An actor is a reusable character document in the campaign. A token is its representation in one scene. Sheet data and the token's position or visual state are related but distinct. The campaign system supplies supported actor types and sheet behavior; the native PDF system uses the **character** type.

## Prepare a character

1. As GM, open the actor directory and create an actor of a supported type.
2. Give it a clear name and organize it in a folder. Add portrait or token art that you may legally use.
3. Open the sheet. For the native system, attach and configure the character PDF; for an installed system, follow that package's sheet controls.
4. Configure the actor's permissions for the intended player. Ownership grants editing access; read access alone does not.
5. Put a token in the intended scene and confirm its sheet source and appearance.
6. Verify opening, editing and movement in a separate player session.

## Reuse characters deliberately

A linked token reads actor data. A snapshot token keeps an independent copy for that token. This distinction matters when using multiple creatures based on one actor: editing an independent creature should not accidentally change the reusable source. Check the token's link mode before changing resources through its sheet.

Folders help organize the directory but do not replace resource permissions. Deleting or changing assets can affect documents that reuse them; inspect references before removing a shared image.

## Troubleshoot

If a player cannot see an actor, confirm campaign membership and the actor's permissions. If the actor opens but cannot be edited, check ownership. If the token sheet differs from the directory actor, inspect whether the token uses a snapshot. If expected sheet fields are absent, verify the campaign's system and its installed version instead of assuming every system has the same schema.

The core does not include a universal item catalog or system-specific rules. The native PDF system has no native item types; install a suitable system package when you need those capabilities.
`),
    text('Atores e diretório de personagens', 'Organize personagens reutilizáveis, conceda propriedade e coloque suas representações nas cenas.', `
## Ator ou token?

Um ator é um documento reutilizável de personagem na campanha. Um token é sua representação numa cena. Dados da ficha e posição ou estado visual do token são relacionados, mas diferentes. O sistema da campanha fornece tipos de ator e comportamento de ficha; o PDF nativo usa o tipo **character**.

## Prepare um personagem

1. Como mestre, abra o diretório de atores e crie um ator de tipo suportado.
2. Dê um nome claro e organize-o numa pasta. Adicione retrato ou arte de token que você tenha direito de usar.
3. Abra a ficha. No sistema nativo, anexe e configure o PDF; em sistemas instalados, siga os controles fornecidos pelo pacote.
4. Configure as permissões para o jogador pretendido. Propriedade permite editar; somente leitura não.
5. Coloque um token na cena pretendida e confira origem da ficha e aparência.
6. Verifique abertura, edição e movimento numa sessão separada de jogador.

## Reutilize personagens intencionalmente

Um token vinculado lê os dados do ator. Um token snapshot mantém uma cópia independente para aquela peça. Isso importa ao usar várias criaturas baseadas num ator: editar uma criatura independente não deve alterar a fonte reutilizável por engano. Confira o modo de vínculo antes de mudar recursos pela ficha do token.

Pastas organizam o diretório, mas não substituem permissões. Excluir ou alterar assets pode afetar documentos que os reutilizam; confira referências antes de remover uma imagem compartilhada.

## Solucione problemas

Se o jogador não vê o ator, confira vínculo e permissões. Se abre sem poder editar, confira propriedade. Se a ficha do token difere da ficha do diretório, veja se utiliza snapshot. Se faltarem campos esperados, verifique o sistema da campanha e a versão instalada, sem presumir que todos os sistemas tenham o mesmo formato.

O núcleo não inclui catálogo universal de itens nem regras específicas de RPG. O PDF nativo não fornece tipos de itens; instale um pacote de sistema adequado quando precisar dessas capacidades.
`), ['character-sheets', 'tokens', 'systems-modules']),

  article('character-sheets', 'tools', [...userGuide, 'gravewright/pdf_system/schema.py', 'gravewright/actors/services.py'],
    text('Character sheets and the PDF system', 'Use an existing character PDF or the sheet supplied by an installed RPG system.', `
## Choose the right sheet

The included **Gravewright PDF System** lets a campaign use PDF character sheets without making the host depend on a particular RPG. Installed systems can instead provide their own fields, resources, item types, translations and automation. A sheet shown for an optional system is not a promise that its rules are built into the core.

## Prepare a PDF character

1. Create or open an actor in a campaign using the PDF system.
2. Upload a character-sheet PDF you are authorized to use.
3. Open the sheet's PDF editing/mapping controls and configure the fields needed by your group.
4. Enter a few sample values, save and reopen to confirm persistence before filling the entire character.
5. Grant the intended player ownership and verify the sheet from that player's session.
6. If you reuse the layout, verify it on another character before investing in a larger collection.

Mapping fields onto a PDF does not import a rulebook or implement all calculations from an RPG. Agree with your group on which values you maintain manually and which an installed system actually automates.

## Edit the intended source

Opening a sheet from a linked token uses actor data; an independent snapshot token uses its own copy. Check this before changing health, notes or other resources on duplicate creatures. A missing portrait or PDF may be an asset-access issue rather than a missing actor.

## Recover from a save conflict

If another session changed the sheet, reload the current state and reapply the intended edit. Do not repeatedly force an old form over a newer revision. If a save response is uncertain after connection loss, inspect the reopened sheet before entering the same change again.

## Content and limits

The native PDF system does not include item types or a proprietary catalog. PDFs and images retain their own licenses; owning a book does not automatically authorize redistributing it in public downloads. Keep licensed personal material in the private campaign storage and share only within your authorization.
`),
    text('Fichas de personagem e sistema PDF', 'Use uma ficha PDF existente ou a ficha fornecida por um sistema de RPG instalado.', `
## Escolha a ficha adequada

O **Gravewright PDF System** integrado permite usar fichas PDF sem tornar o host dependente de um RPG. Sistemas instalados podem fornecer campos, recursos, tipos de item, traduções e automações próprios. Uma ficha demonstrada para um sistema opcional não significa que suas regras estejam no núcleo.

## Prepare um personagem PDF

1. Crie ou abra um ator numa campanha que utiliza o sistema PDF.
2. Envie uma ficha PDF que você tenha autorização para usar.
3. Abra os controles de edição/mapeamento PDF da ficha e configure os campos necessários ao grupo.
4. Preencha valores de exemplo, salve e reabra para confirmar a persistência antes de completar o personagem.
5. Conceda propriedade ao jogador pretendido e confira a ficha pela sessão dele.
6. Ao reutilizar o layout, confira-o em outro personagem antes de preparar uma coleção maior.

Mapear campos sobre um PDF não importa um livro de regras nem implementa todos os cálculos de um RPG. Combine com o grupo quais valores são mantidos manualmente e quais um sistema instalado realmente automatiza.

## Edite a fonte pretendida

Abrir a ficha de um token vinculado utiliza os dados do ator; um token snapshot independente utiliza sua cópia. Confira antes de mudar vida, anotações ou outros recursos em criaturas duplicadas. Retrato ou PDF ausente pode indicar acesso ao asset, sem significar que o ator sumiu.

## Recupere um conflito de salvamento

Se outra sessão mudou a ficha, recarregue o estado atual e reaplique a edição pretendida. Não force repetidamente um formulário antigo sobre uma revisão nova. Se a resposta do salvamento ficar incerta após perda de conexão, confira a ficha reaberta antes de repetir a alteração.

## Conteúdo e limites

O sistema PDF nativo não inclui tipos de itens nem catálogo proprietário. PDFs e imagens mantêm suas licenças; possuir um livro não autoriza automaticamente redistribuí-lo em downloads públicos. Mantenha material pessoal licenciado no armazenamento privado da campanha e compartilhe somente dentro da sua autorização.
`), ['actors', 'tokens', 'systems-modules']),

  article('tokens', 'tools', [...userGuide, 'gravewright/tokens/services.py', 'gravewright/maps/objects.py'],
    text('Tokens, movement and vision', 'Control a character on the map and understand linked data, collision and visibility.', `
## Place and configure

1. As GM, open the intended scene and place a token based on an actor.
2. Check its image, size, name and whether it reads linked actor data or an independent snapshot.
3. Configure visibility, lock and vision settings for the role it will play.
4. Give the player the appropriate actor ownership and test selection and movement in their session.
5. Check walls, doors and lighting from that player's view before starting play.

## Move during play

Use the selection/movement tool and a token you control. The server verifies permissions, the current revision, scene bounds and wall collision. A token can be visible without being controlled. A controlled token can still be locked or blocked by a wall.

Pings and measurement help communicate intended movement, but do not bypass these restrictions. The vision available to the player depends on eligible controlled tokens and scene configuration; the GM's view is not an accurate substitute for a player test.

## Understand linked and snapshot data

A linked token's sheet source is the actor. An independent token's source is its snapshot. Check this when multiple creatures use the same actor and when a resource change appears on one creature but not another. Position, scene state and sheet data do not all have the same source.

## Diagnose movement and vision

| Symptom | Check |
| --- | --- |
| Cannot select or move | Active tool, control permissions and token lock |
| Movement stops | Walls, closed doors, scene bounds and a refreshed token revision |
| Player sees an empty/dark area | Broadcast scene, token visibility, vision enabled/range and lighting |
| A character has unexpected values | Linked versus snapshot sheet source |
| Automation fires while crossing an object | Its area-entry/exit blueprint and token path |

Movement through a Smart Object area can trigger both entry and exit when a path crosses the entire area. Configuration changes are different from accepted movement events. Use the GM automation log to investigate rather than disabling ownership or wall checks.
`),
    text('Tokens, movimento e visão', 'Controle personagens no mapa e entenda vínculo de dados, colisão e visibilidade.', `
## Coloque e configure

1. Como mestre, abra a cena pretendida e coloque um token baseado num ator.
2. Confira imagem, tamanho, nome e se utiliza dados vinculados ou um snapshot independente.
3. Configure visibilidade, bloqueio e visão para sua finalidade.
4. Conceda propriedade adequada ao jogador e teste seleção e movimento pela sessão dele.
5. Confira paredes, portas e iluminação na visão do jogador antes de começar.

## Mova durante a partida

Use a ferramenta de seleção/movimento com um token que você controla. O servidor verifica permissões, revisão atual, limites da cena e colisão com paredes. Um token pode estar visível sem estar sob seu controle. Um token controlado ainda pode estar bloqueado ou impedido por uma parede.

Pings e medição ajudam a comunicar o movimento pretendido, mas não ignoram essas restrições. A visão do jogador depende dos tokens controlados elegíveis e da configuração da cena; a visão do mestre não substitui um teste como jogador.

## Entenda vínculo e snapshot

A fonte da ficha de um token vinculado é o ator. Num token independente, é seu snapshot. Confira isso quando várias criaturas usam o mesmo ator e quando uma alteração aparece em uma, mas não em outra. Posição, estado da cena e dados da ficha não têm todos a mesma origem.

## Diagnostique movimento e visão

| Sintoma | Confira |
| --- | --- |
| Não consegue selecionar ou mover | Ferramenta ativa, controle e bloqueio do token |
| Movimento interrompido | Paredes, portas fechadas, limites da cena e revisão atualizada |
| Jogador vê área vazia/escura | Cena transmitida, visibilidade do token, visão habilitada/alcance e luzes |
| Personagem com valores inesperados | Origem da ficha vinculada ou snapshot |
| Automação ao cruzar um objeto | Blueprint de entrada/saída da área e trajeto do token |

Um movimento que cruza uma área inteira de Objeto Inteligente pode iniciar entrada e saída. Alterações de configuração diferem de eventos de movimento aceito. Investigue pelo registro de automação do mestre, em vez de desativar verificações de propriedade ou paredes.
`), ['actors', 'permissions', 'smart-objects']),

  article('chat-dice', 'tools', [...userGuide, ...releaseNotes, 'gravewright/dice/grammar/notation/GRAMMAR.md', 'gravewright/dice/grammar/notation/GRAMMAR.pt-BR.md', 'gravewright/chat/services.py'],
    text('Chat and dice notation', 'Send table messages and learn a useful set of native dice expressions.', `
## Send the right message

Open chat, check its scene/audience context and send a short test message. Select private or GM delivery only through the supported audience controls, and verify the recipient before sending secrets. A roll result is stored with its message; another user's refresh should not create another roll.

## Roll an expression

Use the dice interface to submit an expression. The native notation uses a lowercase **d**, positive integer counts and faces, arithmetic and parentheses.

| Expression | Meaning |
| --- | --- |
| 1d20 + 3 | Roll a d20 and add three |
| 2d6 + 1 | Sum two d6 and add one |
| 4d6kh3 | Keep the highest three of four d6 |
| 2d20kl1 | Keep the lower of two d20 |
| 1d6! | Explode recursively on the maximum face |
| 1d6r1 | Reroll a one once |
| 4dF | Four Fudge dice |
| 8d10 >= 8 | Count successful active dice at least eight |

Modifiers attach directly to their dice term: **4d6kh3** works; separating **kh3** with a space does not. Recursive rerolls/explosions are bounded by the engine; an expression can be rejected for complexity.

## Watch comparison spacing

**1d6!=5** means exploding on a five. **1d6 != 5** is an expression comparison. **2d6!>=5** is conditional explosion; **2d6! >= 5** explodes normally then counts successes. Use spaces deliberately when mixing modifiers and comparisons.

Supported numeric functions include **floor**, **ceil**, **round**, **abs**, **min**, **max** and **clamp** in lowercase. Unknown functions and chained comparisons are rejected.

## Respond to an object's roll request

A GM can configure a **Dice challenge** or **Request dice roll** action in a [Smart Object](wiki:smart-objects). An authorized recipient receives a native prompt with its expression and label. Review it and press **Roll** explicitly; receiving the prompt does not roll automatically. The server validates the expression and posts the result to the configured public or GM audience through the normal dice service.

Retries and multiple tabs reuse the same logical roll for that recipient. Streamers do not receive actionable requests. The object graph continues after requesting the roll; it does not wait for the result or apply RPG-specific success, damage or rewards. Those rules belong to the chosen system package.

## Troubleshoot

If a roll fails, simplify to **1d20**, then add one modifier at a time. Check lowercase notation and modifier spacing. After a lost connection, inspect chat for the committed result before submitting a new roll. A new submission is a new logical roll, even if its expression is identical. Installed systems may add their own roll controls without changing the meaning of every native expression.
`),
    text('Chat e notação de dados', 'Envie mensagens e aprenda um conjunto útil de expressões nativas de dados.', `
## Envie a mensagem certa

Abra o chat, confira contexto de cena/público e envie uma mensagem de teste. Use entrega privada ou ao mestre somente pelos controles de público suportados e confira destinatários antes de enviar segredos. O resultado é armazenado com a mensagem; atualizar a tela de outro usuário não deve criar outra rolagem.

## Role uma expressão

Use a interface de dados para enviar uma expressão. A notação nativa usa **d** minúsculo, quantidades e faces inteiras positivas, aritmética e parênteses.

| Expressão | Significado |
| --- | --- |
| 1d20 + 3 | Role um d20 e some três |
| 2d6 + 1 | Some dois d6 e acrescente um |
| 4d6kh3 | Mantenha os três maiores de quatro d6 |
| 2d20kl1 | Mantenha o menor de dois d20 |
| 1d6! | Exploda recursivamente na face máxima |
| 1d6r1 | Role novamente uma vez quando sair um |
| 4dF | Quatro dados Fudge |
| 8d10 >= 8 | Conte dados ativos com resultado pelo menos oito |

Modificadores ficam ligados ao termo de dados: **4d6kh3** funciona; separar **kh3** com espaço não. Repetições e explosões recursivas têm limites no motor; uma expressão pode ser recusada por complexidade.

## Observe os espaços nas comparações

**1d6!=5** significa explodir ao sair cinco. **1d6 != 5** é comparação de expressão. **2d6!>=5** é explosão condicional; **2d6! >= 5** explode normalmente e depois conta sucessos. Use espaços intencionalmente ao combinar modificadores e comparações.

Funções numéricas suportadas incluem **floor**, **ceil**, **round**, **abs**, **min**, **max** e **clamp**, em minúsculas. Funções desconhecidas e comparações encadeadas são recusadas.

## Responda à solicitação de um objeto

O mestre pode configurar um **Desafio de dados** ou a ação **Solicitar rolagem de dados** num [Objeto Inteligente](wiki:smart-objects). Um destinatário autorizado recebe a janela nativa com expressão e rótulo. Confira e pressione **Rolar** explicitamente; receber a solicitação não rola os dados sozinho. O servidor valida a expressão e publica o resultado para o público configurado, público ou mestre, pelo serviço normal de dados.

Retentativas e múltiplas abas reutilizam a mesma rolagem lógica daquele destinatário. Streamers não recebem solicitações acionáveis. O grafo continua depois de solicitar a rolagem; não espera o resultado nem aplica sucesso, dano ou recompensas específicos de RPG. Essas regras pertencem ao pacote do sistema escolhido.

## Solucione problemas

Se falhar, simplifique para **1d20** e acrescente um modificador por vez. Confira minúsculas e espaços. Após perder a conexão, procure o resultado confirmado no chat antes de enviar outra rolagem. Um novo envio representa uma nova rolagem lógica, mesmo com expressão idêntica. Sistemas instalados podem acrescentar controles próprios sem mudar o significado de toda expressão nativa.
`), ['tabletop', 'combat', 'smart-objects']),
  article('journals', 'tools', [...userGuide, ...releaseNotes, 'gravewright/journals/services.py', 'gravewright/journals/types.py', 'gravewright/journals/presentations.py'],
    text('Journals, quests and roll tables', 'Keep campaign knowledge, share handouts and track objectives without exposing GM notes.', `
## Choose a document

Journals include structured notes, quests, quest boards and weighted roll tables. Use a journal for reference material, a quest for objectives and rewards, a board to organize quests and a roll table for weighted results. Image/PDF attachments let you keep related handouts with the document.

## Prepare and share a journal

1. Create a document in the journal directory and choose its type.
2. Organize its pages or content sections and add authorized attachments.
3. Put private preparation in GM sections rather than relying on an obscure page title.
4. Set document and page access for the intended people. Read access and editing ownership are distinct.
5. Use the available presentation/handout controls to show the intended material.
6. Check the result as a player; a shared document does not imply every private section becomes public.

## Track a quest

Enter the player-facing description, status, objectives, rewards and assigned characters. Keep GM notes separate. Decide which objectives and rewards players should see. Link the quest to a board when you want a grouped view; hidden quest status, explicit denial and actor access still affect what each player sees.

For an interactive quest giver, bind a fixed campaign quest in the Smart Object's **Quest giver** or **Quest completion** model. The GM-authored **Set quest status** action changes that quest through the journal service. A player interacting with the object receives only that configured action, not general permission to edit quests. **Open journal** can present a journal, quest or board to selected recipients, but does not grant read access: configure document permissions first. A behavior playtest reports the planned changes and deliveries without saving quest state or opening player windows.

## Draw from a weighted table

Add active entries with appropriate weights and choose whether results are replaced after drawing. Check the result audience before a draw. A GM-only result is filtered for players even when they can access the table. If no eligible weight remains in a table without replacement, reset or adjust its entries before drawing again.

## Limits and troubleshooting

Quests support up to 64 objectives and 64 rewards, with up to 32 assigned characters. Roll tables support up to 256 entries. If a document appears on a board but cannot be edited, inspect its own access. If an attachment fails, check the file's campaign and permissions rather than publishing its storage URL. Reopen a document after a revision conflict and reapply the intended change to the current version.
`),
    text('Diários, missões e tabelas', 'Organize conhecimento, apresente materiais e acompanhe objetivos sem expor anotações do mestre.', `
## Escolha um documento

Diários incluem anotações estruturadas, missões, quadros de missões e tabelas ponderadas. Use um diário para referências, uma missão para objetivos e recompensas, um quadro para agrupar missões e uma tabela para sortear resultados com pesos. Anexos de imagem/PDF mantêm materiais relacionados junto do documento.

## Prepare e compartilhe um diário

1. Crie um documento no diretório de diários e escolha seu tipo.
2. Organize páginas ou seções e adicione anexos autorizados.
3. Coloque preparação privada em seções do mestre, em vez de depender de um título pouco visível.
4. Configure acesso ao documento e às páginas para as pessoas pretendidas. Leitura e propriedade para editar são diferentes.
5. Use os controles de apresentação/material disponíveis para mostrar o conteúdo pretendido.
6. Confira como jogador; compartilhar um documento não torna automaticamente públicas todas as seções privadas.

## Acompanhe uma missão

Preencha descrição pública, estado, objetivos, recompensas e personagens atribuídos. Separe notas do mestre. Decida quais objetivos e recompensas os jogadores devem ver. Vincule a missão a um quadro para agrupá-las; estado oculto, negação explícita e acesso aos atores ainda influenciam o que cada jogador recebe.

Para um objeto que oferece uma missão, vincule uma missão fixa da campanha no modelo **Contratante** ou **Conclusão de missão** do Objeto Inteligente. A ação **Alterar status da missão**, configurada pelo mestre, altera essa missão pelo serviço de diários. Interagir como jogador permite somente a ação configurada, sem conceder edição geral de missões. **Abrir diário** pode apresentar diário, missão ou quadro aos destinatários escolhidos, mas não concede leitura: configure antes as permissões do documento. O ensaio de comportamento informa alterações e entregas previstas sem salvar o estado da missão nem abrir janelas para jogadores.

## Sorteie numa tabela ponderada

Adicione entradas ativas com os pesos adequados e escolha se há reposição após o sorteio. Confira o público do resultado antes de sortear. Resultados exclusivos do mestre são filtrados para jogadores mesmo quando eles acessam a tabela. Se não houver peso elegível numa tabela sem reposição, redefina ou ajuste as entradas antes de sortear novamente.

## Limites e solução de problemas

Missões aceitam até 64 objetivos e 64 recompensas, com até 32 personagens atribuídos. Tabelas aceitam até 256 entradas. Se um documento aparece no quadro, mas não permite edição, confira seu próprio acesso. Se um anexo falhar, confira campanha e permissões, sem publicar a URL do armazenamento. Após conflito de revisão, reabra o documento e reaplique a alteração pretendida na versão atual.
`), ['permissions', 'compendiums', 'smart-objects']),

  article('audio', 'tools', [...userGuide, 'gravewright/audio/services.py', 'gravewright/audio/geometry.py', 'gravewright/table/media.py'],
    text('Music, ambience and positional audio', 'Prepare reusable tracks and playlists, then check what players actually hear.', `
## Prepare your audio

The GM manages campaign tracks, playlists and scene playback. Tracks can be music, ambience or effects. Upload only audio you may use, give tracks clear names and test that the browser can play each file. Effect tracks are one-shot rather than looping music.

## Build a session soundscape

1. Upload and classify your tracks in the audio workspace.
2. Set sensible volume and loop options on each track.
3. Create a playlist, select its tracks and choose sequential, shuffle or repeat playback as appropriate.
4. Open the intended scene and start playback there. Use pause, stop, seek and volume controls as needed.
5. Ask a player to interact with the page and confirm that audio is audible before the session.

Playlists support up to 200 tracks. Scene soundscape presets are reusable collections; a track on disk is not automatically playing in every scene.

## Add positional sound

Place a sound source in the scene and configure its radius, gain, falloff and occlusion. Test from the position of a controlled token. Walls and sound barriers can affect attenuation; the GM's listening context can differ from a player's. Smart Objects can play a campaign sound or control a sound already playing in the scene.

## Troubleshoot silence or uneven playback

Browsers often require a click or other interaction before audio starts. Check site/tab mute, system output, volume, scene and playback state first. For positional audio, inspect source enabled state, radius, token position and occlusion. Reconnect to refresh synchronized playback after an interruption.

Deleting a campaign track can detach playlist entries, positional sources and blueprint references using it. Stop playback and inspect reuse before removing a shared track. Deleting the file is different from removing one source from one scene; keep originals in your normal content backup.
`),
    text('Música, ambiente e áudio posicional', 'Prepare faixas e playlists reutilizáveis e confira o que os jogadores realmente ouvem.', `
## Prepare seu áudio

O mestre gerencia faixas, playlists e reprodução nas cenas. Faixas podem ser música, ambiente ou efeito. Envie somente áudio que você possa usar, escolha nomes claros e teste a reprodução de cada arquivo no navegador. Faixas de efeito são pontuais, em vez de música em loop.

## Monte a paisagem sonora

1. Envie e classifique suas faixas no painel de áudio.
2. Ajuste volume e repetição de cada faixa.
3. Crie uma playlist, selecione faixas e escolha reprodução sequencial, aleatória ou repetida conforme a necessidade.
4. Abra a cena pretendida e inicie sua reprodução. Use pausar, parar, buscar posição e volume quando necessário.
5. Peça que um jogador interaja com a página e confirme o áudio antes da sessão.

Playlists aceitam até 200 faixas. Presets de paisagem sonora são coleções reutilizáveis; um arquivo enviado não toca automaticamente em todas as cenas.

## Adicione som posicional

Coloque uma fonte sonora na cena e configure raio, ganho, queda de volume e oclusão. Teste a partir da posição de um token controlado. Paredes e barreiras sonoras podem afetar atenuação; o contexto de escuta do mestre pode diferir do jogador. Objetos Inteligentes podem tocar um som da campanha ou controlar um som que já está tocando na cena.

## Solucione silêncio ou reprodução diferente

Navegadores frequentemente exigem clique ou interação antes do áudio. Confira silenciamento do site/aba, saída do sistema, volume, cena e estado da reprodução. No som posicional, confira fonte habilitada, raio, posição do token e oclusão. Reconecte para atualizar a reprodução sincronizada após uma interrupção.

Excluir uma faixa da campanha pode desfazer referências em playlists, fontes posicionais e blueprints. Pare a reprodução e confira a reutilização antes de excluir. Remover o arquivo difere de remover uma fonte de uma cena; preserve os originais no backup de conteúdo.
`), ['tabletop', 'smart-objects', 'backups-updates']),

  article('cards', 'tools', [...userGuide, 'gravewright/cards/services.py', 'gravewright/chat/card_attachments.py'],
    text('Decks, hands and cards on the table', 'Create a deck, draw cards and control when their faces become visible.', `
## Prepare a deck

The GM creates deck definitions and playable deck instances. A definition is a reusable setup; an instance carries the current draw pile, hands and discard state. Use names and front/back images you are authorized to distribute to your group.

1. Open the cards workspace and create the deck with its cards and optional images.
2. Create the playable instance where the workflow offers a reusable definition.
3. Shuffle the draw pile before play if your game needs random order.
4. Draw to a hand, the scene/table or chat using the destination controls.
5. Check the result with a second account before drawing secret information during play.

Decks contain 1–500 cards. One draw requests 1–50 cards, and the pile must contain enough eligible cards for the entire request.

## Manage a hand

A hand belongs to its recipient. Its owner can inspect its faces. Cards placed in a scene expose their fronts only when revealed; other viewers receive the concealed representation. A GM may draw for another campaign member. Having access to a deck does not disclose every other person's hand.

Owners and the GM can use the supported actions to place, take, flip, move, give, discard or return cards. Watch the destination and face state when moving from a private hand to the public table.

## Understand chat and reset

Cards drawn to chat create a durable message attachment containing public faces only. Later flipping or moving a live card does not retroactively turn that stored public attachment into a secret. Review the audience before using chat for a draw.

Shuffle randomizes the remaining draw pile. Reset returns the deck's cards to the draw pile, clears owners and scene positions and hides faces; it changes the whole active deck. Use it between rounds only when everyone agrees the current hands can end.

If a draw fails for insufficient cards, inspect draw/discard counts instead of repeating the same request. If a card cannot move, check its owner, scene and current revision.
`),
    text('Baralhos, mãos e cartas na mesa', 'Crie um baralho, compre cartas e controle quando as faces ficam visíveis.', `
## Prepare um baralho

O mestre cria definições reutilizáveis e instâncias de baralho para jogar. A definição é a configuração; a instância mantém pilha de compra, mãos e descarte atuais. Use nomes e imagens de frente/verso que você tenha autorização para distribuir ao grupo.

1. Abra o painel de cartas e crie o baralho com cartas e imagens opcionais.
2. Crie a instância de jogo quando o fluxo oferecer uma definição reutilizável.
3. Embaralhe a pilha antes da partida se seu jogo precisar de ordem aleatória.
4. Compre para uma mão, cena/mesa ou chat pelos controles de destino.
5. Confira o resultado com outra conta antes de usar informações secretas durante a partida.

Baralhos contêm de 1 a 500 cartas. Uma compra solicita de 1 a 50, e a pilha precisa ter cartas elegíveis suficientes para o pedido inteiro.

## Gerencie uma mão

A mão pertence ao destinatário, que pode inspecionar suas faces. Cartas numa cena expõem a frente somente quando reveladas; outros espectadores recebem a representação oculta. O mestre pode comprar para outro membro da campanha. Acessar um baralho não revela todas as mãos de outras pessoas.

Proprietários e mestre podem usar as ações suportadas para colocar, pegar, virar, mover, dar, descartar ou devolver cartas. Confira destino e face ao sair de uma mão privada para a mesa pública.

## Entenda chat e redefinição

Compras para o chat criam anexos persistentes contendo somente faces públicas. Virar ou mover a carta depois não transforma retroativamente aquele anexo público em segredo. Confira o público antes de usar esse destino.

Embaralhar reorganiza a pilha restante. Redefinir devolve as cartas à pilha, remove proprietários e posicionamentos na cena e oculta as faces; altera o baralho ativo inteiro. Use entre rodadas quando todos concordarem em encerrar as mãos atuais.

Se faltar quantidade para comprar, confira contadores de compra/descarte em vez de repetir o pedido. Se não conseguir mover uma carta, confira proprietário, cena e revisão atual.
`), ['tabletop', 'chat-dice', 'permissions']),

  article('combat', 'tools', [...userGuide, 'gravewright/combat/services.py', 'gravewright/combat/effects.py'],
    text('Encounters, initiative and turns', 'Set up a scene encounter and advance turns with the campaign system in mind.', `
## Prepare an encounter

Combat is associated with a scene. The host provides an encounter tracker; the selected RPG system can supply initiative configuration and rule-specific behavior. Do not assume every system has the same initiative formula, effects or resources.

1. As GM, open the intended scene and the combat tracker.
2. Add the participating tokens or actors. Scene tokens must belong to that scene.
3. Configure the supported initiative input/formula, or enter initiative values manually.
4. Roll initiative for the intended scope where a formula is available, then inspect the order.
5. Set hidden or defeated flags as needed and start the encounter.
6. Advance turns and rounds using the tracker. Stop the encounter when it is over.

An encounter supports up to 64 combatants. Starting requires at least one; rolling initiative requires a configured formula.

## Share turn responsibility

The GM manages order, combatants and encounter configuration. A player can advance the current turn only when the encounter is active and they control its current combatant. A visible combatant is not necessarily controlled by that account.

Defeated combatants are skipped during normal advancement. If every combatant is defeated, there is no eligible next combatant. Adding or reordering entries should not be used as a substitute for selecting the intended current turn.

## Effects and previous turns

Effects and conditions may advance at turn/round boundaries according to their system and configuration. Returning to a previous turn changes tracker history; it is not a general undo of all rule automation or resource changes already committed. Inspect affected sheets when correcting a mistaken advancement.

## Troubleshoot

If initiative cannot roll, check the system's formula and required sheet values. If a player cannot end their turn, check token/actor control and the currently selected combatant. If combat appears absent after switching maps, reopen the encounter for the correct scene. Reconnect after a revision conflict and work from the current tracker rather than forcing old order data.
`),
    text('Encontros, iniciativa e turnos', 'Prepare um encontro da cena e avance turnos considerando o sistema da campanha.', `
## Prepare um encontro

Combate está associado a uma cena. O host fornece o rastreador; o sistema de RPG escolhido pode fornecer configuração de iniciativa e regras próprias. Não presuma que todos os sistemas tenham a mesma fórmula, efeitos ou recursos.

1. Como mestre, abra a cena pretendida e o rastreador de combate.
2. Adicione tokens ou atores participantes. Tokens precisam pertencer àquela cena.
3. Configure entrada/fórmula de iniciativa suportada ou preencha valores manualmente.
4. Role a iniciativa para o escopo desejado quando houver fórmula e confira a ordem.
5. Ajuste indicadores de oculto ou derrotado e inicie o encontro.
6. Avance turnos e rodadas pelos controles. Encerre quando terminar.

Um encontro aceita até 64 combatentes. É necessário pelo menos um para iniciar; rolar iniciativa exige fórmula configurada.

## Compartilhe a responsabilidade pelo turno

O mestre gerencia ordem, participantes e configuração. Um jogador pode avançar o turno atual somente quando o encontro está ativo e ele controla o combatente atual. Estar visível não significa que o combatente esteja sob controle daquela conta.

Combatentes derrotados são ignorados no avanço normal. Se todos estiverem derrotados, não há próximo combatente elegível. Adicionar ou reordenar participantes não substitui selecionar o turno atual pretendido.

## Efeitos e turnos anteriores

Efeitos e condições podem avançar nos limites de turno/rodada conforme sistema e configuração. Voltar ao turno anterior muda o histórico do rastreador; não desfaz genericamente regras automatizadas ou alterações de recursos já confirmadas. Confira as fichas afetadas ao corrigir um avanço indevido.

## Solucione problemas

Se não puder rolar iniciativa, confira fórmula e valores exigidos pela ficha. Se um jogador não consegue encerrar o turno, confira controle do token/ator e combatente atual. Se o combate parece ausente depois de trocar de mapa, abra o encontro da cena correta. Após conflito de revisão, reconecte e use o rastreador atual, sem forçar dados antigos da ordem.
`), ['tokens', 'chat-dice', 'systems-modules']),

  article('compendiums', 'content', [...userGuide, 'gravewright/compendiums/services.py', 'gravewright/compendiums/catalog.py', 'gravewright/compendiums/graph.py'],
    text('Compendiums and reusable content', 'Collect reusable campaign material, lock finished packs and import compatible entries.', `
## What a compendium contains

A compendium is a reusable content pack rather than a full installation backup. Campaign packs can contain supported actors, items, journals, scenes and decks. Installed system packages may also provide catalogs. The core's generic item support does not mean the native PDF system includes item types.

## Build a campaign pack

1. As GM, create a compendium with a meaningful name.
2. Add the supported campaign resources you want to reuse.
3. Inspect entries and any linked media in a test import.
4. Choose whether the pack is shared with players.
5. Lock a finished pack to prevent accidental editing; unlock it before changing its entries.

A portable entry can include its supported dependency graph and linked assets. This does not promise that every third-party module's private state can be transferred. Imported references are mapped into the destination campaign instead of granting access to the original campaign.

## Import an entry

Open the appropriate pack and inspect the intended entry. As GM, import it into the current campaign. Check the new document, its images and its permissions before sharing it. A pack associated with another system cannot be imported as though its schema belonged to the current system.

Import creates campaign content. Later editing of that copy is distinct from maintaining the source pack; do not assume it stays synchronized with a publisher's next release.

## Troubleshoot and respect content rights

If a player cannot see a pack, inspect shared/access settings. If the GM cannot edit it, check its lock. If import reports a system mismatch, choose the matching campaign/system rather than renaming IDs. Missing media needs investigation of the source entry and import result, not a public alias for private storage.

Only distribute content you own or are authorized to redistribute. A reusable structure, installed package or book purchase does not authorize including proprietary rules catalogs, books or licensed artwork in a public pack. Keep an installation backup as well: compendiums do not preserve all campaign history, accounts or host configuration.
`),
    text('Compêndios e conteúdo reutilizável', 'Reúna materiais, bloqueie pacotes finalizados e importe entradas compatíveis.', `
## O que um compêndio contém

Um compêndio é um pacote de conteúdo reutilizável, não um backup completo. Pacotes da campanha podem conter atores, itens, diários, cenas e baralhos suportados. Sistemas instalados também podem fornecer catálogos. Suporte genérico a itens no núcleo não significa que o sistema PDF nativo inclua tipos de item.

## Monte um pacote da campanha

1. Como mestre, crie um compêndio com nome significativo.
2. Adicione os recursos suportados que pretende reutilizar.
3. Confira entradas e mídias vinculadas numa importação de teste.
4. Escolha se o pacote será compartilhado com jogadores.
5. Bloqueie um pacote finalizado para evitar edição acidental; desbloqueie antes de alterar entradas.

Uma entrada portátil pode incluir dependências suportadas e assets vinculados. Isso não garante transferir todo estado privado de módulos terceiros. Referências importadas são adaptadas à campanha de destino, sem conceder acesso à origem.

## Importe uma entrada

Abra o pacote adequado e confira a entrada. Como mestre, importe para a campanha atual. Verifique documento novo, imagens e permissões antes de compartilhar. Um pacote associado a outro sistema não pode ser importado como se seu formato pertencesse ao sistema atual.

Importar cria conteúdo da campanha. Editar essa cópia depois é diferente de manter o pacote original; não presuma que continuará sincronizada com a próxima release do autor.

## Solucione problemas e respeite direitos

Se um jogador não vê o pacote, confira compartilhamento/acesso. Se o mestre não consegue editar, confira o bloqueio. Se a importação aponta sistema incompatível, escolha campanha/sistema correspondente, sem renomear identificadores. Investigue mídia ausente na entrada e no resultado da importação, sem criar endereço público para armazenamento privado.

Distribua somente conteúdo próprio ou autorizado. Uma estrutura reutilizável, pacote instalado ou compra de livro não autoriza incluir catálogos proprietários, livros ou arte licenciada num pacote público. Mantenha também backup da instalação: compêndios não preservam todo histórico, contas e configuração do host.
`), ['systems-modules', 'journals', 'backups-updates']),

  article('systems-modules', 'content', [...userGuide, ...releaseNotes, 'docs/en/modules.md', 'docs/pt-BR/modules.md', 'LICENSING.md', 'LICENSING.pt-BR.md'],
    text('Systems, modules and the marketplace', 'Install trusted packages and understand the difference between host installation and table activation.', `
## Choose the package type

| Type | Responsibility | Who selects it |
| --- | --- | --- |
| RPG system | Sheets, document types and its own rules/content | Owner installs; campaign selects the system |
| Browser module | Table tools and interface extensions | Owner installs; GM activates for the table |
| Trusted Django app | Server-wide extension | Owner activates with a managed restart |

The native PDF system remains available without a marketplace. Installing a system does not include every book or catalog for that game.

## Install a package

1. As installation owner, open **Systems** or **Modules** in the library.
2. Choose **Install** to browse the configured marketplace, or **Install from ZIP** for a local package you explicitly trust.
3. Inspect author, version, compatibility, permissions and license. Marketplace discovery shows the newest compatible, non-revoked release per package.
4. Wait for installation to finish, then refresh the installed library if the connection was interrupted.
5. Select the system for the campaign, or have its GM activate the browser module in **Settings → Extensions**.
6. Reload existing clients when required and test with both GM and player accounts.

Installing a new version does not automatically replace the exact release active in every table. Activation is a separate selection. Server apps require the owner's server-wide activation and managed restart.

## Trust and language

Browser module JavaScript executes on the application's origin. Signatures validate package provenance and integrity; they do not sandbox the code. A local ZIP installation is the owner's trust decision and still undergoes archive and compatibility validation.

English is the default interface language. Available language packages/settings and system catalogs determine translations; user-authored names and notes are not translated automatically. Preserve each user's explicit language choice.

## Browse and search in your language

1. The owner installs and activates the compatible **Translator** language package for the installation. It is managed globally rather than enabled as a campaign extension. Reload existing pages after activation.
2. In account **Settings**, choose English, Portuguese (Brazil) or Spanish from the available languages. This is each account's own preference; another signed-in account does not inherit it.
3. Open **Systems** or **Modules**, then its installation browser. Marketplace category names and package tag badges follow the selected language. Categories belong to the selected package type and sort by their displayed labels.
4. Search by an original tag or its translated label in either the installed library or the marketplace. For example, **Translation** and **Tradução** can find the same tagged package. Clear the category or use **All packages** when checking the full catalog.

Translation changes presentation only. Package IDs, original tags, signed records and category-filter identities stay intact. Package and publisher names, descriptions, acronyms and custom tags without a translation stay as authored. Long tags wrap on small screens. Without an active language package, the interface uses English; disabling it returns to English on the next page load. The installed library stays available when catalog discovery is offline.

## Troubleshoot

An empty marketplace may mean missing catalog/key configuration or unavailable networking; installed packages remain separate from discovery. Do not disable verification to fix a rejected archive. Confirm the host version and package requirements. Before changing a system, back up and inspect existing actor data and compendiums; switching systems does not automatically convert all documents into another RPG's format.
`),
    text('Sistemas, módulos e marketplace', 'Instale pacotes confiáveis e diferencie instalação no host de ativação na mesa.', `
## Escolha o tipo de pacote

| Tipo | Responsabilidade | Quem seleciona |
| --- | --- | --- |
| Sistema de RPG | Fichas, tipos de documento e suas regras/conteúdo | Proprietário instala; campanha escolhe o sistema |
| Módulo de navegador | Ferramentas e extensões da interface | Proprietário instala; mestre ativa na mesa |
| App Django confiável | Extensão para todo o servidor | Proprietário ativa com reinício gerenciado |

O sistema PDF nativo permanece disponível sem marketplace. Instalar um sistema não inclui todos os livros ou catálogos daquele jogo.

## Instale um pacote

1. Como proprietário, abra **Sistemas** ou **Módulos** na biblioteca.
2. Escolha **Instalar** para navegar no marketplace configurado, ou **Instalar de ZIP** para um pacote local explicitamente confiável.
3. Confira autor, versão, compatibilidade, permissões e licença. A descoberta apresenta a versão compatível mais recente e não revogada por pacote.
4. Aguarde o término e atualize a biblioteca instalada se houver interrupção de conexão.
5. Selecione o sistema na campanha, ou peça ao mestre para ativar o módulo em **Configurações → Extensões**.
6. Recarregue clientes existentes quando necessário e teste como mestre e jogador.

Instalar uma versão nova não substitui automaticamente a release exata ativa em todas as mesas. Ativação é uma escolha separada. Apps de servidor exigem ativação global pelo proprietário e reinício gerenciado.

## Confiança e idioma

O JavaScript de módulos executa na origem da aplicação. Assinaturas verificam procedência e integridade; não isolam o código. Instalar ZIP local é uma decisão de confiança do proprietário e continua submetido à validação de arquivo e compatibilidade.

Inglês é o idioma padrão. Pacotes/configurações de idioma disponíveis e catálogos dos sistemas determinam traduções; nomes e textos autorais não são traduzidos automaticamente. Preserve a escolha explícita de cada usuário.

## Navegue e busque no seu idioma

1. O proprietário instala e ativa o pacote de idioma **Translator** compatível para a instalação. Sua ativação é global, em vez de uma extensão da campanha. Recarregue páginas já abertas depois de ativá-lo.
2. Nas **Configurações** da conta, escolha inglês, português do Brasil ou espanhol entre os idiomas disponíveis. A preferência pertence à conta; outra conta conectada não a herda.
3. Abra **Sistemas** ou **Módulos** e depois seu navegador de instalação. Categorias e etiquetas dos pacotes no Marketplace seguem o idioma escolhido. As categorias pertencem ao tipo de pacote selecionado e são ordenadas pelo rótulo exibido.
4. Busque pela tag original ou traduzida tanto na biblioteca instalada quanto no Marketplace. Por exemplo, **Translation** e **Tradução** podem localizar o mesmo pacote. Limpe a categoria ou use **Todos os pacotes** para conferir o catálogo completo.

A tradução muda somente a apresentação. IDs dos pacotes, tags originais, registros assinados e identidades dos filtros de categoria permanecem intactos. Nomes de pacotes e publicadores, descrições, siglas e tags personalizadas sem tradução permanecem como foram escritos. Tags longas quebram linha em telas pequenas. Sem pacote de idioma ativo, a interface usa inglês; desativá-lo restaura inglês no próximo carregamento. A biblioteca instalada continua disponível quando a descoberta do catálogo está offline.

## Solucione problemas

Marketplace vazio pode indicar catálogo/chaves ausentes ou falha de rede; pacotes instalados são independentes da descoberta. Não desative verificação para corrigir um arquivo recusado. Confira versão do host e requisitos do pacote. Antes de trocar de sistema, faça backup e confira atores e compêndios; a troca não converte automaticamente todo documento ao formato de outro RPG.
`), ['character-sheets', 'compendiums', 'backups-updates']),

  article('map-builder', 'builder', [...builderGuide, ...releaseNotes, 'gravewright/maps/builder_services.py', 'gravewright/maps/builder.py'],
    text('Map Builder: from project to playable scene', 'Build an editable map, manage assets and publish changes without losing the project.', `
## Project, preview and scene

Only a current campaign GM can edit Builder projects. Open **Scenes → New scene → Map Builder**. Entering the editor preserves the players' current broadcast. A project stores editable work; generation produces the native scene used in play.

| Action | What it changes |
| --- | --- |
| Autosave / Ctrl+S | The editable project |
| Preview | A temporary view including all project layers |
| Generate scene | A new private native scene |
| Update scene | The same linked native scene |
| Activate for players | Scene visibility and the player broadcast |

## Build your first room

1. Name the project in the header. Set dimensions, cell size and background in **Panels → Settings**.
2. Choose **Tiles** for grid-oriented materials or **Painting** for softer terrain work. Configure the brush in **Panels → Tools**.
3. Import authorized images in **Library → Import** and classify them as floor, wall, door or object. Families and collections help organize reusable materials.
4. Paint the floor, draw walls and doors and add objects, lights or effects. A door is an independent segment; uploading a map image does not detect its walls.
5. Use **Panels → Layers** to select, name, lock or hide editor layers. Use **Panels → Selection** for selected-element properties.
6. Wait for the saved status, then inspect **Preview**. Hidden editor layers still appear in preview and generation.
7. Choose **Generate scene**. Later reopen the project through **Panels → Projects** or **Edit with MapBuilder** on its linked scene, then choose **Update scene**.
8. Activate the scene for players when ready.

## Import a finished image

Choose **Library → Import → Import ready-made map**, select an upload or existing campaign image and enter map dimensions in cells and cell size. This creates a background beneath your additions. It does not reconstruct the image's original objects. Changing the background preserves existing coordinates; a dimension change that would exclude objects is refused.

## Edit an object's properties, appearance and behavior

Select the element and right-click it, press **Shift+F10** or use the keyboard's context-menu key. On touch screens, open **Panels → Selection → Object options**. The same menu offers **Properties**, **Appearance** and **Behavior**, plus the native editor, **Edit nodes**, torch components or presence filters when that element supports them. **Duplicate**, **Rotate** and **Delete** are also available.

Use Properties for the element's name and supported settings, Appearance for its artwork and visual configuration, and Behavior for its interaction. Enter or leave a name field to apply it; Escape discards that field's pending edit. Names of up to 120 characters keep the element's identity and node connections. Applied property changes save automatically and can be undone. Objects and Empty Objects also offer **Ready-made models**; follow [Smart Objects](wiki:smart-objects) for all 14 models and their editable nodes.

Valid graph edits save automatically too. **Close** or **Escape** waits for pending valid changes; an invalid field stays open for correction. Saving configuration does not operate the mechanism. Use **Generate scene** or **Update scene** explicitly to publish project changes.

## Useful controls

**V** selects; **F** returns to floor painting; **E** removes an entire object. Area floor erasing is a separate tool. **Ctrl+Z** undoes, **Ctrl+Shift+Z/Ctrl+Y** redoes, **Space + drag** pans, the wheel zooms and **0** fits the map. **[ / ]** adjusts the brush. With the floor brush active, **Shift + left drag** changes its size without painting; Escape cancels that adjustment.

## Bring tabletop edits back into the project

1. Edit a generated element in the game, then reopen its project, return to the Builder tab or request **Update scene**. Compatible manual changes to names, geometry, artwork, lights, effects and Blueprints are imported at those points.
2. Inspect the imported result. Deleted generated objects disappear from the project; split wall spans remain independently editable. Manually added scene objects stay separate from the editable source.
3. Continue editing and wait for the saved status. Changes to different properties merge with pending local work. Undoing your local edit preserves imported game changes.
4. If both sides changed the same property differently, synchronization stops with your local draft preserved. Choose **Reload saved project** to adopt the server version or **Save a copy** to retain your work as a new project. Unsupported object-type changes or geometry also stop with a diagnostic; do not force an older revision over the scene.
5. Review and choose **Update scene**. It requires current project and scene revisions and remains a GM operation. Synchronizing or saving does not execute behaviors or change the player broadcast.

Updating preserves scene-only tokens, images, lights, effects, drawings and fog, plus the scene's name, folder, visibility, broadcast and environment. Keep map dimensions and cell size unchanged when manual scene content exists. Live door state is preserved; lights, effects and other runtime settings retain their live values when their authored defaults are unchanged. Deliberately changing an authored default applies it on update. Automated **Move/Rotate** actions leave source geometry unchanged, so an update reapplies authored positions and angles.

## Save, recover and respect limits

Autosave records completed edits after a short pause; the header shows waiting, saving or saved. **Ctrl+S** synchronizes immediately. Returning to the game waits for pending saves; a failure keeps the editor open for retry or explicit discard. A lost response retries the same operation rather than creating another write. A revision conflict pauses saving and keeps the draft: use the explicit reload/copy choices above. **Discard changes** removes only unacknowledged work. If the initial project or library load fails, use **Retry**; editing stays blocked so an empty replacement is not created.

Projects allow 32 layers, 2,000 combined objects, 256 classified images and a 1 MB document. Dimensions are 1–200 cells and 16–256 pixels per cell, subject to a shared 16,777,216-pixel image limit or a smaller host limit. Image uploads are limited to 25 MB and 40 million decoded pixels. Maximum dimensions cannot all be used simultaneously.

A browser draft is recovery help, not a backup. **Remove asset** deletes the campaign resource and may affect other maps; Undo cannot restore the deleted file. Players and streamers cannot edit Builder projects; test player interaction separately from GM editing.
`),
    text('Map Builder: do projeto à cena jogável', 'Construa um mapa editável, organize assets e publique mudanças preservando o projeto.', `
## Projeto, prévia e cena

Somente um mestre atual da campanha pode editar projetos. Abra **Cenas → Nova cena → Map Builder**. Entrar preserva a transmissão atual dos jogadores. O projeto guarda o trabalho editável; a geração produz a cena nativa usada na partida.

| Ação | O que altera |
| --- | --- |
| Salvamento automático / Ctrl+S | Projeto editável |
| Prévia | Visão temporária incluindo todas as camadas |
| Gerar cena | Nova cena nativa privada |
| Atualizar cena | A mesma cena nativa vinculada |
| Ativar para jogadores | Visibilidade e transmissão |

## Construa a primeira sala

1. Nomeie o projeto no cabeçalho. Defina dimensões, célula e fundo em **Painéis → Configurações**.
2. Escolha **Tiles** para materiais orientados à grade ou **Pintura** para terreno suave. Configure o pincel em **Painéis → Ferramentas**.
3. Importe imagens autorizadas em **Biblioteca → Importar**, classificando-as como chão, parede, porta ou objeto. Famílias e coleções organizam materiais reutilizáveis.
4. Pinte o chão, trace paredes e portas e adicione objetos, luzes ou efeitos. Uma porta é um segmento independente; enviar um mapa não detecta suas paredes.
5. Use **Painéis → Camadas** para selecionar, nomear, bloquear ou ocultar camadas de edição. Use **Painéis → Seleção** para propriedades do elemento selecionado.
6. Aguarde o estado salvo e confira a **Prévia**. Camadas ocultas do editor continuam na prévia e geração.
7. Escolha **Gerar cena**. Depois reabra por **Painéis → Projetos** ou **Editar com MapBuilder** na cena vinculada e use **Atualizar cena**.
8. Ative a cena para jogadores quando estiver pronta.

## Importe uma imagem pronta

Escolha **Biblioteca → Importar → Importar mapa pronto**, selecione upload ou imagem da campanha e informe dimensões em células e tamanho da célula. Isso cria o fundo sob seus acréscimos. Não reconstrói objetos originais da imagem. Trocar o fundo preserva coordenadas; dimensões que excluiriam objetos são recusadas.

## Edite propriedades, aparência e comportamento

Selecione o elemento e clique com o botão direito, pressione **Shift+F10** ou use a tecla de menu de contexto. Em telas de toque, abra **Painéis → Seleção → Opções do objeto**. O mesmo menu oferece **Propriedades**, **Aparência** e **Comportamento**, além do editor nativo, **Editar nós**, componentes de tocha ou filtros de presença quando suportados pelo elemento. **Duplicar**, **Girar** e **Excluir** também estão disponíveis.

Use Propriedades para nome e ajustes suportados, Aparência para imagens e configuração visual, e Comportamento para a interação. Pressione Enter ou saia do campo de nome para aplicar; Escape descarta a edição pendente daquele campo. Nomes de até 120 caracteres preservam identidade e conexões dos nós. Alterações aplicadas são salvas automaticamente e podem ser desfeitas. Objetos e Objetos vazios também oferecem **Modelos prontos**; veja os 14 modelos e seus nós editáveis em [Objetos Inteligentes](wiki:smart-objects).

Edições válidas de grafos também são salvas automaticamente. **Fechar** ou **Escape** aguarda alterações válidas pendentes; campos inválidos permanecem abertos para correção. Salvar a configuração não aciona o mecanismo. Use **Gerar cena** ou **Atualizar cena** explicitamente para publicar mudanças do projeto.

## Controles úteis

**V** seleciona; **F** retorna à pintura de chão; **E** remove um objeto inteiro. A borracha de área do chão é separada. **Ctrl+Z** desfaz, **Ctrl+Shift+Z/Ctrl+Y** refaz, **Espaço + arrastar** move a câmera, a roda ajusta zoom e **0** enquadra o mapa. **[ / ]** ajusta o pincel. Com o pincel de chão ativo, **Shift + arrastar com botão esquerdo** muda seu tamanho sem pintar; Escape cancela o ajuste.

## Traga edições da mesa de volta ao projeto

1. Edite um elemento gerado no jogo e reabra o projeto, volte à aba do Builder ou solicite **Atualizar cena**. Mudanças manuais compatíveis de nomes, geometria, imagens, luzes, efeitos e Blueprints são importadas nesses momentos.
2. Confira o resultado importado. Objetos gerados excluídos desaparecem do projeto; trechos de parede divididos continuam editáveis separadamente. Objetos adicionados manualmente à cena ficam separados do projeto.
3. Continue a edição e aguarde o estado salvo. Mudanças em propriedades diferentes se combinam com trabalho local pendente. Desfazer sua edição local preserva as mudanças importadas do jogo.
4. Se os dois lados alterarem a mesma propriedade de formas diferentes, a sincronização para e preserva seu rascunho local. Escolha **Recarregar projeto salvo** para adotar o servidor ou **Salvar uma cópia** para manter o trabalho num novo projeto. Trocas de tipo de objeto ou geometria não suportada também param com diagnóstico; não force uma revisão antiga sobre a cena.
5. Confira e escolha **Atualizar cena**. A ação exige revisões atuais do projeto e da cena e continua exclusiva do mestre. Sincronizar ou salvar não executa comportamentos nem muda a transmissão dos jogadores.

Atualizar preserva tokens, imagens, luzes, efeitos, desenhos e neblina exclusivos da cena, além de nome, pasta, visibilidade, transmissão e ambiente. Mantenha dimensões e tamanho da célula quando houver conteúdo manual na cena. O estado das portas ao vivo é preservado; luzes, efeitos e outros ajustes de execução mantêm seus valores enquanto os padrões autorais não mudarem. Alterar intencionalmente um padrão no projeto o aplica ao atualizar. Ações automatizadas de **Mover/Girar** mantêm a geometria-fonte; atualizar reaplica posições e ângulos autorais.

## Salve, recupere e respeite os limites

O autosave registra edições concluídas após uma pausa curta; o cabeçalho mostra alterações aguardando, salvando ou salvas. **Ctrl+S** sincroniza imediatamente. Voltar ao jogo aguarda salvamentos pendentes; uma falha mantém o editor aberto para tentar novamente ou descartar explicitamente. Perder uma resposta repete a mesma operação sem criar outra escrita. Conflitos de revisão pausam o salvamento e preservam o rascunho: use as opções explícitas de recarregar/copiar acima. **Descartar alterações** remove somente trabalho não confirmado. Se o carregamento inicial do projeto ou biblioteca falhar, use **Tentar novamente**; a edição fica bloqueada para não criar uma substituição vazia.

Projetos aceitam 32 camadas, 2.000 objetos combinados, 256 imagens classificadas e documento de 1 MB. Dimensões de 1–200 células e células de 16–256 pixels compartilham o limite de 16.777.216 pixels da imagem, ou um teto menor do host. Uploads de imagem aceitam até 25 MB e 40 milhões de pixels decodificados. Não é possível usar simultaneamente todos os máximos.

O rascunho do navegador ajuda na recuperação, mas não é backup. **Remover asset** exclui o recurso da campanha e pode afetar outros mapas; Desfazer não recupera o arquivo. Jogadores e streamers não podem editar projetos; teste a interação de jogadores separadamente da edição como mestre.
`), ['smart-objects', 'scenes', 'universal-vtt'], ['builder']),

  article('smart-objects', 'builder', [...builderGuide, ...releaseNotes, 'gravewright/maps/blueprint_runtime.py', 'gravewright/maps/builder.py'],
    text('Smart Objects: models, nodes and safe playtests', 'Start with an interactive model, customize its logic and test behavior before applying it to the game.', `
## Start with an event

Doors, objects, levers, torches, Empty Objects and presence regions share a visual blueprint editor. Double-click an editable element in Map Builder to open **Smart Object**. Select a starting event, connect its output to a node and configure explicit actions. An empty authored interaction graph does nothing: no implicit toggle is added.

Doors offer **On interact** and **On destroy**. Objects also support **On area enter/exit**; regions offer area entry/exit and destruction. Named signals provide **On signal**. An event starts execution; it does not compare a state or choose an image by itself. Legacy state-specific interaction/entry/exit graphs and change events are discarded rather than migrated; recreate their behavior with current events and logic nodes.

## Choose one of the 14 ready-made models

Select an Object or Empty Object and open **Object options → Ready-made models**, choose a model in **Behavior**, or open **Object catalog** in the node editor. These entry points share the same editable catalog.

| Model | Starting behavior |
| --- | --- |
| Interactive switch | Toggle the object and optionally a linked door |
| Chest | Open/close and show a message on its first opening |
| Secret passage | Toggle a required linked door |
| Readable book | Open an authorized journal handout for chosen recipients |
| Altar | Show a message with a five-second cooldown |
| Warning trap | Warn on token entry while armed; interact to arm/disarm |
| Bell | Notify chosen recipients with a short cooldown |
| Pressure plate | Open a linked door on entry; close when the last token leaves |
| Dice challenge | Ask selected recipients to roll explicitly |
| Quest giver | Set a bound quest active and open its journal entry |
| Quest completion | Set a bound quest completed and open its journal entry |
| Entrance sign | Show a message on first entry; interact to read it again |
| Timed switch | Activate, optionally open a door, then reset after a delay |
| Door button | Open a linked door when pressed |

Search the catalog, choose the model and supply its required door, journal/quest, recipients, message, expression or delay. **Add a sound when activated** enables a campaign sound and volume; **Use an active image** enables another Object image for the active state. Leaving either unchecked adds no corresponding override. The inactive state keeps the original image, and Empty Objects remain image-free.

Choose **Apply**, inspect the generated nodes and customize them as needed. Applying preserves the object's identity and geometry as one Undo step; closing the catalog without applying leaves it unchanged. Replacing existing authored nodes requires confirmation. The warning trap reports a warning: damage, RPG checks, item consumption and system-specific rewards belong to the RPG system package, not these generic models.

## Build a door toggle

1. Select **On interact** and connect **Check state**, configured to compare **Closed**.
2. Connect **True → Change state: Opened**.
3. Connect **False → Change state: Closed**.
4. Add **Control light**, **Play sound** or **Change image** after the appropriate action when desired.
5. Bind another target using a typed **Element reference**, **Light reference** or compatible group. Without a target connection, element actions normally address the edited element.
6. Simulate both initial states, then run a server playtest before updating the scene.

Value nodes supply typed data; they do not execute a chain by themselves. **Compare state/value**, **All conditions** and **Any condition** can feed the Boolean **Test** input of a decision. **Sequence** runs its branches in order; **Choose path** selects a typed case; **Random** selects a weighted branch.

## Remember a puzzle with variables and signals

Use **Get variable/Set variable** with a case-sensitive name, scope **This element** or **Scene**, and type Boolean, Number or Text. For example, set scene Boolean **PuzzleSolved** to True, then emit the named signal **PuzzleSolved**. A receiving **On signal** graph reads that variable and opens its passage.

Each event reads an initial state/variable snapshot. A later read inside that same event still sees the initial value; the next queued receiving event sees the assignment. A signal alone does not open a door, carries no custom payload and remains inside the scene. Configure the receiver's action explicitly. GM **Automation → Variables** inspects memory; resetting a variable removes that entry without running a graph.

Area events run for eligible token crossings. A token crossing the entire area can cause entry and exit in one accepted move. Use event context and conditions when you want only the first arrival or last departure to matter. **Interact with object** explicitly runs a target's interaction behavior; **Change state** alone does not run another graph or its image/sound actions.

## Request a roll or advance a quest

For **Request dice roll**, choose the native expression, optional label, recipients and result visibility. The server checks membership and scene access before delivering each request. The recipient must press **Roll**; streamers cannot receive an actionable prompt. Retrying or opening another tab reuses the recipient's logical roll. The graph continues without waiting for a result. See [Chat and dice](wiki:chat-dice) for native notation.

For **Open journal**, bind a campaign journal, quest or board and choose recipients who already have access. Opening it does not grant permission to read it. **Set quest status** binds one fixed campaign quest and desired status authored by the GM. A player can trigger that configured change through the object without gaining general journal editing rights. Check the quest's own visibility and permissions separately; see [Journals and quests](wiki:journals).

## Use time deliberately

**Delay** persists a continuation; **Timer** is a named one-shot countdown whose expiry runs the matching named signal. They survive closed browsers/server restarts, and pausing scene automation keeps pending jobs waiting. GM **Automation → Waiting** shows the queue. Behavior changes, removed targets or lost access can cancel pending work. Exports, campaign snapshots and copies omit these jobs; a full database backup includes them.

## Simulate, playtest and publish

**Simulate** is a local graph preview. **Test behavior** runs the server engine against the unsaved Builder document or a live element, showing predicted state, variable and cross-element changes. Choose an optional test actor/token for token-dependent actions. Tests use GM permissions, so also test a real player separately.

Tests roll everything back and deliver no live sounds, messages, handouts, roll prompts or camera changes. Quest changes and roll requests appear in the report without saving quest state or opening recipient windows. Delay stops at the wait; Timer scheduling is listed without advancing time or firing receivers. Verify actual timing in a controlled live scene. After successful editing, wait for autosave and choose **Generate scene/Update scene**; returning to the table alone does not apply project graphs.

## Limits and troubleshooting

Each event graph allows 32 nodes and 64 connections; a door's graphs allow 128 nodes combined. A scope stores up to 64 variables. Delay/Timer share 64 pending jobs per scene and 256 per campaign. Cycles, invalid typed connections and oversized chains are rejected.

If nothing happens, check the starting event, connected actions, targets, pause state and **Automation log**. A player-triggered chain cannot lock/unlock by default; the GM must explicitly allow player locking/unlocking on that state action. A missing target can be skipped with a diagnostic. Teleport is within the same scene; these tools do not promise cross-scene or group transport.
`),
    text('Objetos Inteligentes: modelos, nós e playtest', 'Comece com um modelo interativo, personalize sua lógica e teste o comportamento antes de aplicá-lo ao jogo.', `
## Comece por um evento

Portas, objetos, alavancas, tochas, Objetos vazios e regiões de presença compartilham o editor visual de blueprint. Dê dois cliques num elemento editável do Map Builder para abrir **Objeto Inteligente**. Escolha um evento inicial, conecte sua saída e configure ações explícitas. Um grafo autoral de interação vazio não faz nada: não existe alternância implícita.

Portas oferecem **Ao interagir** e **Ao destruir**. Objetos também têm **Ao entrar/sair da área**; regiões oferecem entrada/saída e destruição. Sinais nomeados fornecem **Ao receber sinal**. O evento inicia execução; não compara estado nem escolhe imagem sozinho. Grafos antigos de interação/entrada/saída por estado e eventos de mudança são descartados, sem migração das ações; recrie o comportamento com eventos e lógica atuais.

## Escolha um dos 14 modelos prontos

Selecione um Objeto ou Objeto vazio e abra **Opções do objeto → Modelos prontos**, escolha um modelo em **Comportamento** ou abra **Catálogo de objetos** no editor de nós. Essas entradas compartilham o mesmo catálogo editável.

| Modelo | Comportamento inicial |
| --- | --- |
| Interruptor | Alterna o objeto e, opcionalmente, uma porta vinculada |
| Baú | Abre/fecha e mostra mensagem na primeira abertura |
| Passagem secreta | Alterna uma porta vinculada obrigatória |
| Livro interativo | Abre um diário autorizado para destinatários escolhidos |
| Altar | Mostra mensagem com intervalo de cinco segundos |
| Armadilha de aviso | Avisa na entrada de token enquanto armada; interação arma/desarma |
| Sino | Notifica destinatários escolhidos com intervalo curto |
| Placa de pressão | Abre uma porta na entrada; fecha quando o último token sai |
| Desafio de dados | Solicita rolagem explícita aos destinatários escolhidos |
| Contratante | Ativa uma missão vinculada e abre seu diário |
| Conclusão de missão | Conclui uma missão vinculada e abre seu diário |
| Placa de entrada | Mostra mensagem na primeira entrada; interação permite reler |
| Interruptor temporizado | Ativa, opcionalmente abre porta e reverte após uma espera |
| Botão de porta | Abre uma porta vinculada quando pressionado |

Busque no catálogo, escolha o modelo e informe porta, diário/missão, destinatários, mensagem, expressão ou espera exigidos. **Adicionar som ao ativar** habilita um som da campanha e volume; **Usar imagem ao ativar** habilita outra imagem de Objeto para o estado ativo. Deixar uma opção desmarcada não acrescenta aquela substituição. O estado inativo mantém a imagem original, e Objetos vazios continuam sem imagem.

Escolha **Aplicar**, confira os nós gerados e personalize-os quando necessário. Aplicar preserva identidade e geometria do objeto como uma etapa de Desfazer; fechar o catálogo sem aplicar mantém o objeto intacto. Substituir nós autorais existentes exige confirmação. A armadilha apenas emite um aviso: dano, testes de RPG, consumo de itens e recompensas específicas pertencem ao pacote do sistema de RPG, fora desses modelos genéricos.

## Monte uma porta que alterna

1. Selecione **Ao interagir** e conecte **Verificar estado**, comparando com **Fechada**.
2. Ligue **Verdadeiro → Mudar estado: Aberta**.
3. Ligue **Falso → Mudar estado: Fechada**.
4. Acrescente **Controlar luz**, **Tocar som** ou **Trocar imagem** depois da ação apropriada quando desejar.
5. Para outro alvo, conecte **Referência de elemento**, **Referência de luz** ou grupo de tipo compatível. Sem conexão de alvo, ações de elemento normalmente usam o elemento editado.
6. Simule os dois estados iniciais e faça um ensaio pelo servidor antes de atualizar a cena.

Nós de valor fornecem dados tipados; não executam sozinhos uma sequência. **Comparar estado/valor**, **Todas as condições** e **Qualquer condição** podem alimentar a entrada booleana **Teste** da decisão. **Sequência** executa ramos em ordem; **Escolher caminho** seleciona um caso tipado; **Aleatório** escolhe um ramo com peso.

## Memorize um enigma com variáveis e sinais

Use **Ler variável/Definir variável** com nome sensível a maiúsculas, escopo **Este elemento** ou **Cena** e tipo Booleano, Número ou Texto. Por exemplo, defina o booleano de cena **PuzzleSolved** como Verdadeiro e emita o sinal **PuzzleSolved**. Um grafo **Ao receber sinal** lê a variável e abre a passagem.

Cada evento lê um retrato inicial de estado/variáveis. Uma leitura posterior no mesmo evento ainda vê o valor inicial; o próximo evento receptor enfileirado vê a atribuição. O sinal sozinho não abre portas, não carrega payload personalizado e permanece na cena. Configure explicitamente a ação receptora. **Automação → Variáveis** permite ao mestre conferir a memória; redefinir remove a entrada sem executar um grafo.

Eventos de área respondem à travessia de tokens elegíveis. Atravessar toda a área pode causar entrada e saída no mesmo movimento aceito. Use contexto do evento e condições para responder somente à primeira chegada ou última saída. **Interagir com objeto** executa explicitamente o comportamento do alvo; **Mudar estado** sozinho não executa outro grafo nem suas ações de imagem/som.

## Solicite uma rolagem ou avance uma missão

Em **Solicitar rolagem de dados**, escolha expressão nativa, rótulo opcional, destinatários e visibilidade do resultado. O servidor confere vínculo e acesso à cena antes de entregar cada solicitação. O destinatário precisa pressionar **Rolar**; streamers não recebem janela acionável. Retentativas ou outra aba reutilizam a rolagem lógica daquele destinatário. O grafo continua sem aguardar resultado. Veja a notação nativa em [Chat e dados](wiki:chat-dice).

Em **Abrir diário**, vincule um diário, missão ou quadro da campanha e escolha destinatários que já tenham acesso. Abrir não concede permissão de leitura. **Alterar status da missão** vincula uma missão fixa da campanha e o estado desejado, configurados pelo mestre. O jogador pode acionar essa mudança pelo objeto sem receber edição geral de diários. Confira separadamente visibilidade e permissões da missão; veja [Diários e missões](wiki:journals).

## Use o tempo intencionalmente

**Delay** persiste uma continuação; **Temporizador** conta uma vez e executa o sinal nomeado correspondente ao vencer. Ambos sobrevivem a navegador fechado/reinício do servidor, e pausar a automação mantém trabalhos pendentes. **Automação → Aguardando** mostra a fila. Mudanças de comportamento, alvos removidos ou perda de acesso podem cancelar trabalhos. Exportações, snapshots e cópias de campanha os omitem; backup completo do banco os inclui.

## Simule, teste e publique

**Simular** oferece prévia local do grafo. **Testar comportamento** usa o motor do servidor sobre o documento não salvo ou elemento ao vivo, mostrando mudanças previstas de estado, variáveis e outros elementos. Escolha ator/token de teste para ações que dependem dele. O ensaio usa permissões do mestre; teste também um jogador real separadamente.

Os testes revertem tudo e não entregam sons, mensagens, materiais, solicitações de rolagem ou movimentos de câmera ao vivo. Mudanças de missão e solicitações aparecem no relatório sem salvar o estado da missão nem abrir janelas dos destinatários. Delay para na espera; o temporizador mostra agendamento sem avançar o tempo nem executar receptores. Confira tempos reais numa cena controlada. Depois da edição, aguarde autosave e use **Gerar cena/Atualizar cena**; voltar à mesa não aplica os grafos sozinho.

## Limites e solução de problemas

Cada grafo aceita 32 nós e 64 conexões; os grafos de uma porta somam até 128 nós. Um escopo guarda até 64 variáveis. Delay/Temporizador compartilham 64 trabalhos pendentes por cena e 256 por campanha. Ciclos, conexões tipadas inválidas e cadeias excessivas são recusados.

Se nada acontecer, confira evento inicial, ações conectadas, alvos, pausa e **Registro de automação**. Uma cadeia iniciada por jogador não tranca/destranca por padrão; o mestre precisa permitir isso explicitamente naquela ação de estado. Alvo ausente pode ser ignorado com diagnóstico. Teleporte ocorre na mesma cena; as ferramentas não prometem transporte entre cenas ou em grupo.
`), ['map-builder', 'tokens', 'audio', 'chat-dice', 'journals'], ['builder']),

  article('universal-vtt', 'builder', ['docs/en/universal-vtt.md', 'docs/pt-BR/universal-vtt.md', 'gravewright/maps/universal_vtt.py'],
    text('Import and export Universal VTT', 'Bring in a prepared map or transfer a native scene while understanding the format limits.', `
## Choose the right interchange

Universal VTT imports **.uvtt**, **.dd2vtt** and **.df2vtt** files into a new native scene with supported image, grid, walls, doors and lights. Only a campaign GM may import/export. Imported scenes start GM-only and preserve the existing player broadcast. They do not become Map Builder projects.

For a PNG/JPEG/WebP/TIFF image you want to decorate in the Builder, use **Import ready-made map** instead. An image cannot reconstruct original walls or layers.

## Import a scene

1. Choose **Scenes → New scene → Import Universal VTT**, starting inside the destination folder when appropriate.
2. Select the file and check the scene name, which must be 1–120 characters.
3. Choose **Import scene** and wait. Grid and lighting come from the file; this modal has no separate configuration for them.
4. Read the warnings after creation, then close the modal.
5. Inspect grid alignment, wall openings, door states and lighting before activating for players.

Portals become doors. Baked-in lighting may cause imported lights to start disabled. Ambient color, shadows and unsupported light features are approximated; inspect warnings rather than assuming an exact match.

## Recover an uncertain import

Validation errors create no partial scene. If the connection fails, keep the modal open with the same file/name and choose **Import scene** again: it reuses the operation identity. Changing fields or reopening starts another operation. If you already closed/refreshed, check **Scenes** before importing again to avoid a duplicate.

## Export the applied scene

First generate/update a Builder scene if your latest changes are still in its project. Right-click the native scene, choose **Export Universal VTT**, then **Prepare export**, inspect warnings and **Download Universal VTT**. The prepared download is a snapshot of that moment; reopen and prepare again after scene changes.

The background and supported visible images/surfaces are flattened into PNG. Walls, doors and enabled lights retain supported interchange data. Tokens, blueprints, variables, jobs, audio, cards, journals, particles, shaders and campaign state are not transferred. GM-only images are omitted, but secret-door geometry may remain; inspect before sharing.

## Limits

The format uses numeric version **0.2**, separate from the app version. The JSON limit is 64 MiB; embedded compressed image limit is 48 MiB; raster area is at most 16,777,216 pixels or a smaller host limit. Geometry allows 5,000 native objects and 20,000 line-of-sight vertices. Import accepts embedded single-frame PNG/WebP rather than remote image URLs. Excessive geometry or missing export tiles fails the operation instead of producing a partial download. Keep the original project and a proper installation backup.
`),
    text('Importar e exportar Universal VTT', 'Traga um mapa pronto ou transfira uma cena nativa conhecendo os limites do formato.', `
## Escolha o intercâmbio adequado

Universal VTT importa **.uvtt**, **.dd2vtt** e **.df2vtt** para uma nova cena nativa com imagem, grade, paredes, portas e luzes suportadas. Somente mestres podem importar/exportar. A cena começa exclusiva do mestre e preserva a transmissão atual. Não vira projeto do Map Builder.

Para uma imagem PNG/JPEG/WebP/TIFF que receberá elementos no Builder, use **Importar mapa pronto**. Uma imagem não reconstrói paredes nem camadas originais.

## Importe uma cena

1. Escolha **Cenas → Nova cena → Importar Universal VTT**, iniciando dentro da pasta de destino quando adequado.
2. Selecione o arquivo e confira o nome, que deve ter de 1 a 120 caracteres.
3. Escolha **Importar cena** e aguarde. Grade e iluminação vêm do arquivo; a janela não as configura separadamente.
4. Leia os avisos depois da criação e feche a janela.
5. Confira alinhamento da grade, aberturas, portas e iluminação antes de ativar para jogadores.

Portais viram portas. Iluminação incorporada pode deixar luzes importadas desativadas. Cor ambiente, sombras e recursos sem equivalente são aproximados; confira os avisos em vez de presumir correspondência exata.

## Recupere uma importação incerta

Erros de validação não deixam cena parcial. Se a conexão falhar, mantenha a janela aberta com os mesmos arquivo/nome e escolha **Importar cena** novamente: a operação reutiliza sua identidade. Alterar campos ou reabrir inicia outra operação. Se já fechou/atualizou, confira **Cenas** antes de importar novamente e criar duplicata.

## Exporte a cena aplicada

Primeiro gere/atualize a cena do Builder se suas mudanças ainda estiverem só no projeto. Clique com botão direito na cena nativa, escolha **Exportar Universal VTT**, depois **Preparar exportação**, confira avisos e **Baixar Universal VTT**. O download é uma cópia daquele momento; reabra e prepare novamente depois de mudanças.

Fundo e imagens/superfícies visíveis suportadas são achatados num PNG. Paredes, portas e luzes ativadas mantêm dados de intercâmbio suportados. Tokens, blueprints, variáveis, trabalhos, áudio, cartas, diários, partículas, shaders e estado da campanha não são transferidos. Imagens do mestre são omitidas, mas a geometria de portas secretas pode permanecer; confira antes de compartilhar.

## Limites

O formato utiliza versão numérica **0.2**, separada da versão do aplicativo. O limite de JSON é 64 MiB; a imagem comprimida incorporada aceita 48 MiB; o raster tem até 16.777.216 pixels ou teto menor do host. A geometria aceita 5.000 objetos nativos e 20.000 vértices de visão. São aceitos PNG/WebP incorporados de quadro único, em vez de URLs remotas. Geometria excessiva ou tiles ausentes na exportação impedem a operação, sem gerar download parcial. Preserve projeto original e backup da instalação.
`), ['scenes', 'map-builder', 'backups-updates']),

  article('backups-updates', 'hosting', ['docs/en/deployment.md', 'docs/pt-BR/deployment.md', ...userGuide, ...releaseNotes, 'gravewright/administration/archives.py'],
    text('Backups, recovery and updates', 'Protect the installation, distinguish portable exports from backups and apply releases deliberately.', `
## Choose the right protection

| Option | Purpose | Important boundary |
| --- | --- | --- |
| Campaign export/import | Transfer portable content | May omit private history and adjust ownership |
| Campaign snapshot | Campaign recovery point | Not the entire host or module installation state |
| Full installation backup | Recover data, private media and configuration together | Requires a consistent database/file set |
| Universal VTT export | Exchange a map scene | Omits most game and automation state |

Availability depends on permissions and host options. Before restoring campaign content, preserve the current state and read the consequences shown by the interface.

## Make a full backup

1. Arrange a maintenance window and stop writes, including ASGI/Runner and maintenance processes.
2. Copy the configured SQLite database with associated journal/WAL files when present, private media and installed package files, optional compendiums and required configuration/trust keys.
3. Preserve **.env** privately and record the matching code version and lock file. Include recovery/updates state when preserving an installation for rollback.
4. Restore into a separate writable folder first, with paths pointing to the copy.
5. Verify login, a campaign, representative uploads and required modules before directing players there.

The default database is **data/gravewright.sqlite3**, not a root **db.sqlite3**. A database without its matching media is incomplete. Never publish backups or secrets with site/application source.

## Apply an update

The owner can open the library notification bell and choose **View update**, or go to **Administration → Updates**. Review installed/available versions and release notes, create a backup, then choose the install action when ready. Keep the Runner open while download, verification, dependency preparation, backup, migration and restart complete. Table connections are interrupted during the change; the page reloads after the expected version is confirmed.

The bell is informational; it does not automatically authorize an installation. Installed release notes remain available offline. Direct ASGI deployments require their operator's update procedure rather than assuming the local Runner workflow applies.

## Manual replacement and recovery

Stop the Runner, preserve **.env**, configured data/media, local extensions and recovery state, replace application files with the verified full release and rerun the platform installer. Updates to a reissued ZIP with the same version need manual installation because the updater compares versions.

If recovery fails, keep transaction and backup directories and inspect diagnostics. Do not delete them or restore old code over a newer migrated database. Restore matching code, database and media together.

Pending Blueprint Delay/Timer jobs are excluded from exports, snapshots and copies but included in a full database backup. A restored database may resume expired work at startup. When inspecting a recovery copy, the operator can disable its automation worker until they intentionally resume it.
`),
    text('Backups, recuperação e atualizações', 'Proteja a instalação, diferencie exportação de backup e aplique releases intencionalmente.', `
## Escolha a proteção adequada

| Opção | Finalidade | Limite importante |
| --- | --- | --- |
| Exportar/importar campanha | Transferir conteúdo portátil | Pode omitir histórico privado e ajustar propriedade |
| Snapshot de campanha | Ponto de recuperação | Não inclui todo host ou estado de instalação de módulos |
| Backup completo | Recuperar dados, mídia privada e configuração juntos | Exige conjunto consistente de banco/arquivos |
| Exportar Universal VTT | Intercâmbio de cena de mapa | Omite grande parte do jogo e automação |

A disponibilidade depende de permissões e opções da instalação. Antes de restaurar conteúdo, preserve o estado atual e leia as consequências exibidas na interface.

## Faça um backup completo

1. Combine uma manutenção e interrompa escritas, incluindo processos ASGI/Runner e manutenção.
2. Copie banco SQLite configurado e arquivos journal/WAL quando presentes, mídias privadas e pacotes instalados, compêndios opcionais e configurações/chaves de confiança necessárias.
3. Preserve **.env** em particular e registre versão do código e lock file correspondentes. Inclua estado de recuperação/atualizações ao preservar a instalação para rollback.
4. Restaure primeiro numa pasta gravável separada, ajustando caminhos para a cópia.
5. Verifique login, uma campanha, uploads representativos e módulos antes de direcionar jogadores.

O banco padrão é **data/gravewright.sqlite3**, não **db.sqlite3** na raiz. Um banco sem suas mídias correspondentes é incompleto. Nunca publique backups ou segredos junto do código do site/aplicativo.

## Aplique uma atualização

O proprietário pode abrir o sino da biblioteca e escolher **Ver atualização**, ou entrar em **Administração → Atualizações**. Confira versões e notas, faça backup e escolha instalar quando estiver pronto. Mantenha o Runner aberto durante download, verificação, dependências, backup, migrações e reinício. Conexões da mesa são interrompidas; a página recarrega depois de confirmar a versão esperada.

O sino informa; não autoriza instalação automaticamente. Notas da versão instalada continuam disponíveis offline. Hospedagem ASGI direta exige o procedimento do operador, sem presumir o mesmo fluxo do Runner local.

## Substituição manual e recuperação

Pare o Runner, preserve **.env**, dados/mídias configurados, extensões locais e estado de recuperação, substitua arquivos da aplicação pela release completa verificada e execute o instalador. ZIP reemitido com a mesma versão exige instalação manual porque o atualizador compara versões.

Se a recuperação falhar, preserve diretórios de transação e backup e confira diagnósticos. Não os exclua nem restaure código antigo sobre banco já migrado. Restaure código, banco e mídias correspondentes juntos.

Trabalhos pendentes de Delay/Temporizador ficam fora de exportações, snapshots e cópias, mas entram no backup completo do banco. Um banco restaurado pode retomar trabalhos vencidos ao iniciar. Ao inspecionar uma cópia de recuperação, o operador pode desabilitar seu executor de automação até retomar intencionalmente.
`), ['installation', 'compendiums', 'smart-objects']),
];

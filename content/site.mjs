// Product copy is kept together so both static pages share the same structure.
export const project = 'https://github.com/Gravewright/gravewright';
export const release = `${project}/releases/tag/v0.1.0-alpha.0`;
export const download = `${project}/releases/download/v0.1.0-alpha.0/Gravewright-0.1.0-alpha.0-django.zip`;
export const commands = `git clone https://github.com/Gravewright/gravewright.git
cd gravewright
uv sync --locked
cp -n .env.example .env
uv run --locked python manage.py migrate
uv run --locked python main.py`;

export const locales = {
  en: {
    lang: 'en', file: 'index.html', otherFile: 'pt-br.html', otherLabel: 'Português', docs: 'en', suffix: '',
    title: 'Gravewright — Open-Source Virtual Tabletop for RPGs',
    description: 'Free, open-source virtual tabletop for RPGs with maps, lighting and PDF character sheets. Download Gravewright Alpha 0.1.0 with the Windows Runner.',
    skip: 'Skip to content', home: 'Gravewright home', navigation: 'Main navigation', menu: 'Toggle navigation',
    nav: ['The experience', 'Alpha 0.1.0', 'Get started', 'Contribute'],
    eyebrow: 'Open-source virtual tabletop · Alpha 0.1.0',
    lead: 'Your worlds deserve more than a grid and a character sheet.',
    intro: 'Set the scene, bring your characters to life and keep the story moving. A tabletop in your browser. A world under your control.',
    download: 'Download for Windows', explore: 'Watch the battle showcase', notes: 'Release notes', documentation: 'Documentation',
    downloadHint: 'Complete source ZIP with the Windows Runner · Windows x64',
    panelLabel: 'Made for memorable sessions', panelAria: 'What makes Gravewright yours',
    pillars: [
      ['Set the atmosphere', 'Light, fog, sound and visual effects give every scene a sense of place.'],
      ['Bring your character', 'Use PDF character sheets, map their fields and place your tokens on the board.'],
      ['Keep the party together', 'Maps, journals, chat and dice share one space for your session.'],
      ['Keep control of your world', 'Host your own campaigns and extend an open-source tabletop.']
    ],
    aboutLabel: 'Why Gravewright?', aboutTitle: 'More atmosphere. More room for your story.',
    aboutCopy: 'From the first room to the last roll of the night, keep the places, characters and discoveries of your campaign together.',
    features: [
      ['Maps that tell a story', 'Build scenes with walls, lighting and fog. Choose what the players can see and when to reveal it.'],
      ['Characters at the center', 'Connect actors and tokens with the PDF sheets your table already knows.'],
      ['A place for every discovery', 'Keep journals, quests, handouts and compendiums close to the action.'],
      ['Tools for game night', 'Roll dice, share audio, draw cards and track combat without leaving the table.']
    ],
    experienceLabel: 'Gravewright in action · 51 seconds', experienceTitle: 'Enter the dragon’s lair.',
    experienceCopy: 'Watch The Dragon’s Legacy: a lava-filled battlefield, lighting and fog controls, and characters moving through the scene. A real capture of Gravewright, set to an orchestral battle soundtrack.',
    roles: [
      ['For the GM', 'Prepare your next reveal', 'Organize the campaign, set permissions and broadcast the scene when the party is ready.'],
      ['For the players', 'Meet in the browser', 'Join a network-hosted campaign, open your character and take your place at the table.'],
      ['For the campaign', 'Carry the story forward', 'Keep characters, journals and shared discoveries together from one session to the next.']
    ],
    sheetsLabel: 'Your characters', sheetsTitle: 'A familiar sheet. A place in the world.',
    sheetsCopy: 'The native Gravewright PDF System connects character actors, PDF sheets and field mapping with tokens on the map. Keep your character close to the story.',
    releaseLabel: 'The current release', releaseTitle: 'Meet Alpha 0.1.0.',
    releaseCopy: 'The first release of the Django implementation brings the tabletop, campaign tools, extension interfaces and a native Windows Runner together.',
    releaseFeatures: [
      ['A native Windows Runner', 'Checks uv, Python and Node.js/npm, prepares dependencies and builds the frontend before opening your browser.'],
      ['Your campaigns, kept separately', 'The Runner stores personal data outside the source folder and reuses unchanged tools and frontend builds.'],
      ['An open foundation', 'Documented Python, HTTP, WebSocket and browser interfaces help developers understand and extend the project.'],
      ['Documentation in two languages', 'Getting started, architecture, APIs, modules and deployment guides in English and Brazilian Portuguese.']
    ],
    installLabel: 'Get Gravewright', installTitle: 'From download to your first table.',
    installCopy: 'On Windows, start with the complete project ZIP. The Runner takes care of the tools and dependencies it needs.',
    steps: [
      ['Download & extract', 'Extract the entire ZIP to a folder you can write to. Keep the project files together.'],
      ['Run Gravewright', 'Double-click Gravewright Runner.bat. Missing tools and packages need an internet connection.'],
      ['Make it yours', 'Wait for the browser to open, then create your first owner account. Keep the console open while playing.']
    ],
    requirement: 'Windows 10 (1803+) or Windows 11 · x64 · Browser with WebGL',
    localTitle: 'Playing together over a network?',
    localCopy: 'The Windows Runner serves only the computer running it, at 127.0.0.1:3000. Hosting players on a LAN or the internet uses the separate server setup with HTTPS and Redis.',
    deployment: 'Read the hosting guide', runnerGuide: 'Windows Runner guide',
    sourceLabel: 'For developers', sourceTitle: 'Prefer to run from source?',
    sourceCopy: 'Use Python 3.14 or newer and uv. These commands use a POSIX shell and preserve an existing .env file.',
    sourceHeader: 'Terminal · source setup', copy: 'Copy', copied: 'Copied', selected: 'Selected',
    copiedMessage: 'Commands copied to the clipboard.', selectedMessage: 'Clipboard unavailable. Commands selected for manual copying.',
    extensionsLabel: 'Make it your own', extensionsTitle: 'An open core. Room for your ideas.',
    extensionsCopy: 'Build integrations, explore browser modules or contribute to the tabletop itself. Follow the documented interfaces, contracts and module lifecycle.',
    licenseTitle: 'GPL-3.0-only core. Independent modules, any license.',
    licenseCopy: 'The section 7 Independent Module Permission allows independently written modules to use any license, including proprietary licenses, whether or not they use the provided APIs. Copies and modifications of core implementation code remain subject to its license.',
    api: 'Explore the APIs', modules: 'Build a module', licensing: 'Read the licensing policy',
    faqLabel: 'A few useful things', faqTitle: 'Before your first session.',
    faq: [
      ['Where does the Runner keep my campaigns?', 'Under %LOCALAPPDATA%\\Gravewright\\data, including settings, database, media and logs. Stop the server and back up the whole data folder before replacing source files or applying updates.'],
      ['Is the application available in Portuguese?', 'The application UI currently supports English. The website and project documentation are available in English and Brazilian Portuguese.'],
      ['Can I install an update automatically?', 'Updates are manual. Download the new source after backing up your data. Release discovery does not install an update automatically.'],
      ['What should I know about Alpha 0.1.0?', 'The project is in its alpha stage. Keep backups of important campaigns and check the user guide for current limits. The native PDF ruleset does not include a complete item editor or catalog.'],
      ['Are browser modules isolated?', 'Browser modules run in the main page. Install code you trust; package signatures do not provide a sandbox.']
    ],
    contributeLabel: 'Help shape Gravewright', contributeTitle: 'Bring your experience to the table.',
    contributeCopy: 'Report a reproducible bug, share feedback from a session, improve accessibility or help with code and documentation. Small, thoughtful contributions make a difference.',
    contribute: 'Contribution guide', issues: 'Report an issue', security: 'Security policy',
    finalLabel: 'Your next story starts here', finalTitle: 'Set the scene. Gather the party.',
    footer: 'An open-source virtual tabletop.', top: 'Back to top', mediaSoon: 'Preview coming soon', image: 'Image', video: 'Video',
    videoFallback: 'Your browser cannot play this video.', videoDownload: 'Download the video', transcript: 'Read the transcript', musicCredit: 'Music',
  },
  pt: {
    lang: 'pt-BR', file: 'pt-br.html', otherFile: 'index.html', otherLabel: 'English', docs: 'pt-BR', suffix: '.pt-BR',
    title: 'Gravewright — Mesa Virtual Open Source para RPG',
    description: 'Mesa virtual gratuita e open source para RPG, com mapas, iluminação e fichas PDF. Baixe Gravewright Alpha 0.1.0 com o Runner para Windows.',
    skip: 'Pular para o conteúdo', home: 'Página inicial do Gravewright', navigation: 'Navegação principal', menu: 'Abrir ou fechar navegação',
    nav: ['A experiência', 'Alpha 0.1.0', 'Comece a jogar', 'Contribua'],
    eyebrow: 'Mesa virtual open source · Alpha 0.1.0',
    lead: 'Seus mundos merecem mais que uma grade e uma ficha de personagem.',
    intro: 'Prepare a cena, dê vida aos personagens e deixe a história avançar. Uma mesa no navegador. Um mundo sob seu controle.',
    download: 'Baixar para Windows', explore: 'Assista à demonstração', notes: 'Notas da release', documentation: 'Documentação',
    downloadHint: 'ZIP completo do código com o Runner para Windows · Windows x64',
    panelLabel: 'Para sessões memoráveis', panelAria: 'O que torna o Gravewright seu',
    pillars: [
      ['Prepare a atmosfera', 'Luz, névoa, som e efeitos visuais dão identidade a cada lugar.'],
      ['Traga seu personagem', 'Use fichas PDF, mapeie seus campos e coloque os tokens no mapa.'],
      ['Reúna o grupo', 'Mapas, diários, chat e dados dividem o mesmo espaço durante a sessão.'],
      ['Cuide do seu mundo', 'Hospede suas campanhas e expanda uma mesa virtual open source.']
    ],
    aboutLabel: 'Por que Gravewright?', aboutTitle: 'Mais atmosfera. Mais espaço para sua história.',
    aboutCopy: 'Da primeira sala à última rolagem da noite, mantenha os lugares, personagens e descobertas da campanha juntos.',
    features: [
      ['Mapas que contam histórias', 'Prepare cenas com paredes, iluminação e névoa. Escolha o que os jogadores veem e quando revelar.'],
      ['Personagens no centro', 'Conecte atores e tokens às fichas PDF que sua mesa já conhece.'],
      ['Um lugar para cada descoberta', 'Deixe diários, missões, materiais e compêndios perto da ação.'],
      ['Ferramentas para a sessão', 'Role dados, compartilhe áudio, compre cartas e acompanhe o combate sem sair da mesa.']
    ],
    experienceLabel: 'Gravewright em ação · 51 segundos', experienceTitle: 'Entre no covil do dragão.',
    experienceCopy: 'Assista a The Dragon’s Legacy: um campo de batalha cercado por lava, controles de iluminação e névoa e personagens se movendo pela cena. Uma captura real do Gravewright com trilha orquestral de batalha.',
    roles: [
      ['Para o mestre', 'Prepare a próxima revelação', 'Organize a campanha, ajuste as permissões e transmita a cena quando o grupo estiver pronto.'],
      ['Para os jogadores', 'Encontre o grupo no navegador', 'Entre em uma campanha hospedada pela rede, abra seu personagem e ocupe seu lugar à mesa.'],
      ['Para a campanha', 'Leve a história adiante', 'Mantenha personagens, diários e descobertas compartilhadas juntos de uma sessão para a outra.']
    ],
    sheetsLabel: 'Seus personagens', sheetsTitle: 'Uma ficha conhecida. Um lugar no mundo.',
    sheetsCopy: 'O Gravewright PDF System nativo conecta personagens, fichas PDF e mapeamento de campos aos tokens no mapa. Deixe seu personagem perto da história.',
    releaseLabel: 'A release atual', releaseTitle: 'Conheça a Alpha 0.1.0.',
    releaseCopy: 'O primeiro lançamento da implementação Django reúne a mesa, ferramentas de campanha, interfaces de extensão e um Runner nativo para Windows.',
    releaseFeatures: [
      ['Um Runner nativo para Windows', 'Verifica uv, Python e Node.js/npm, prepara dependências e compila o frontend antes de abrir o navegador.'],
      ['Suas campanhas, em uma pasta própria', 'O Runner guarda dados pessoais fora do código e reutiliza ferramentas e builds do frontend que não mudaram.'],
      ['Uma base aberta', 'Interfaces Python, HTTP, WebSocket e de navegador documentadas ajudam a entender e expandir o projeto.'],
      ['Documentação em dois idiomas', 'Primeiros passos, arquitetura, APIs, módulos e implantação em inglês e português brasileiro.']
    ],
    installLabel: 'Baixe o Gravewright', installTitle: 'Do download à sua primeira mesa.',
    installCopy: 'No Windows, comece pelo ZIP completo do projeto. O Runner cuida das ferramentas e dependências necessárias.',
    steps: [
      ['Baixe e extraia', 'Extraia todo o ZIP para uma pasta com permissão de escrita. Mantenha os arquivos do projeto juntos.'],
      ['Execute o Gravewright', 'Dê dois cliques em Gravewright Runner.bat. Ferramentas e pacotes ausentes precisam de internet.'],
      ['Faça a mesa ser sua', 'Aguarde o navegador abrir e crie o primeiro proprietário. Mantenha o console aberto durante o jogo.']
    ],
    requirement: 'Windows 10 (1803+) ou Windows 11 · x64 · Navegador com WebGL',
    localTitle: 'Vai reunir jogadores pela rede?',
    localCopy: 'O Runner para Windows atende somente ao computador em que está aberto, em 127.0.0.1:3000. Para receber jogadores em uma LAN ou pela internet, use a configuração de servidor com HTTPS e Redis.',
    deployment: 'Leia o guia de hospedagem', runnerGuide: 'Guia do Runner para Windows',
    sourceLabel: 'Para desenvolvedores', sourceTitle: 'Prefere executar pelo código?',
    sourceCopy: 'Use Python 3.14 ou superior e uv. Estes comandos usam um shell POSIX e preservam um arquivo .env existente.',
    sourceHeader: 'Terminal · instalação pelo código', copy: 'Copiar', copied: 'Copiado', selected: 'Selecionado',
    copiedMessage: 'Comandos copiados.', selectedMessage: 'Área de transferência indisponível. Comandos selecionados para copiar manualmente.',
    extensionsLabel: 'Deixe com a sua cara', extensionsTitle: 'Um núcleo aberto. Espaço para suas ideias.',
    extensionsCopy: 'Crie integrações, explore módulos de navegador ou contribua com a própria mesa. Siga as interfaces, contratos e o ciclo de vida de módulos documentados.',
    licenseTitle: 'Núcleo GPL-3.0-only. Módulos independentes, qualquer licença.',
    licenseCopy: 'A permissão para módulos independentes sob a seção 7 permite qualquer licença, inclusive proprietária, utilizando ou não as APIs fornecidas. Cópias e modificações da implementação do núcleo continuam sujeitas à licença dele.',
    api: 'Explore as APIs', modules: 'Crie um módulo', licensing: 'Leia a política de licenciamento',
    faqLabel: 'Algumas coisas úteis', faqTitle: 'Antes da primeira sessão.',
    faq: [
      ['Onde o Runner guarda minhas campanhas?', 'Em %LOCALAPPDATA%\\Gravewright\\data, incluindo configurações, banco, mídia e logs. Encerre o servidor e copie toda a pasta de dados antes de substituir o código ou aplicar atualizações.'],
      ['A aplicação está disponível em português?', 'A interface da aplicação suporta inglês atualmente. O site e a documentação do projeto estão disponíveis em inglês e português brasileiro.'],
      ['Posso instalar uma atualização automaticamente?', 'As atualizações são manuais. Baixe o novo código após fazer backup dos dados. A descoberta de releases não instala uma atualização automaticamente.'],
      ['O que preciso saber sobre a Alpha 0.1.0?', 'O projeto está em estágio alpha. Mantenha backups das campanhas importantes e consulte as limitações no guia de uso. O sistema PDF nativo não inclui um editor ou catálogo completo de itens.'],
      ['Os módulos do navegador são isolados?', 'Módulos de navegador executam na página principal. Instale código confiável; assinaturas de pacotes não fornecem isolamento.']
    ],
    contributeLabel: 'Ajude a construir o Gravewright', contributeTitle: 'Traga sua experiência para a mesa.',
    contributeCopy: 'Relate um bug reproduzível, compartilhe sua experiência em uma sessão, melhore a acessibilidade ou ajude no código e na documentação. Pequenas contribuições bem pensadas fazem diferença.',
    contribute: 'Guia de contribuição', issues: 'Relatar um problema', security: 'Política de segurança',
    finalLabel: 'Sua próxima história começa aqui', finalTitle: 'Prepare a cena. Reúna o grupo.',
    footer: 'Uma mesa virtual open source.', top: 'Voltar ao topo', mediaSoon: 'Prévia em breve', image: 'Imagem', video: 'Vídeo',
    videoFallback: 'Seu navegador não consegue reproduzir este vídeo.', videoDownload: 'Baixar o vídeo', transcript: 'Ler a transcrição', musicCredit: 'Música',
  }
};

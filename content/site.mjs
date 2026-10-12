// Product copy and public download identity shared by both pages.
// Update publicVersion only after the VTT release and its ZIP are published.
export const project = 'https://github.com/Gravewright/gravewright';
export const publicVersion = '0.1.3';
export const upcomingVersion = '0.2.0';
export const release = `${project}/releases/tag/v${publicVersion}`;
export const download = `${project}/releases/download/v${publicVersion}/Gravewright-${publicVersion}-django.zip`;
export const commands = "git clone https://github.com/Gravewright/gravewright.git\ncd gravewright\nuv sync --locked\ncp -n .env.example .env\nuv run --locked python manage.py migrate\nuv run --locked python main.py";

export const locales = {
  "en": {
    "lang": "en",
    "file": "index.html",
    "otherFile": "pt-br.html",
    "otherLabel": "Português",
    "docs": "en",
    "suffix": "",
    "title": "Gravewright — A Virtual Tabletop for Your RPG Campaign",
    "description": "Bring your RPG campaign together with maps, character sheets, dice and atmosphere. A free, open-source virtual tabletop you host and make your own.",
    "skip": "Skip to content",
    "home": "Gravewright home",
    "navigation": "Main navigation",
    "menu": "Toggle navigation",
    "nav": [
      "See it in action",
      "What’s next",
      "Get started",
      "Community"
    ],
    "eyebrow": "Your RPG table · Free and open source · Alpha",
    "lead": "Your world. Your players. Your next great session.",
    "intro": "Build the scene, gather your group and keep the adventure moving. Gravewright brings your maps, characters and campaign tools together in a tabletop you control.",
    "download": "Get Gravewright for Windows",
    "explore": "See Gravewright in action",
    "notes": "Available release",
    "documentation": "Documentation",
    "downloadHint": "Available now: 0.1.3 · Windows x64 installer included · 0.2.0 Alpha coming next",
    "panelLabel": "Everything starts at your table",
    "panelAria": "Your campaign with Gravewright",
    "pillars": [
      [
        "Bring the scene to life",
        "Set the mood with lighting, fog, audio and visual effects."
      ],
      [
        "Keep your characters close",
        "Open their sheets and move their tokens through the world."
      ],
      [
        "Keep the session flowing",
        "Maps, dice, notes and combat share the same table."
      ],
      [
        "Make the table yours",
        "Host your campaigns and add the systems and modules that fit your group."
      ]
    ],
    "aboutLabel": "Built around your campaign",
    "aboutTitle": "Less time between the tools and the story.",
    "aboutCopy": "Prepare the places your players will explore. Keep their characters and discoveries at hand. Return next session with your campaign ready to continue.",
    "features": [
      [
        "Reveal the world at your pace",
        "Build scenes with walls, lighting and fog, then choose what the party sees."
      ],
      [
        "Play with familiar sheets",
        "Bring PDF character sheets to your table and map their fields to your characters."
      ],
      [
        "Give discoveries a home",
        "Keep journals, quests and handouts alongside the places and people they belong to."
      ],
      [
        "Stay at the table",
        "Roll dice, play audio, draw cards and follow combat without changing apps."
      ]
    ],
    "experienceLabel": "Gravewright in action · 51 seconds",
    "experienceTitle": "Enter the dragon’s lair.",
    "experienceCopy": "Step into The Dragon’s Legacy: a lava-filled battlefield, a looming dragon and a party on the move. See lighting, fog and character movement in a real Gravewright session, with an orchestral battle soundtrack.",
    "roles": [
      [
        "For the GM",
        "Have the next scene ready",
        "Prepare encounters, organize campaign notes and reveal the right scene when the party arrives."
      ],
      [
        "For the players",
        "Take your place in the story",
        "Join your GM’s hosted table through the browser, open your sheet and play together."
      ],
      [
        "For the campaign",
        "Pick up where you left off",
        "Keep your characters, places and shared discoveries together between sessions."
      ]
    ],
    "sheetsLabel": "Your characters, at hand",
    "sheetsTitle": "Bring the sheet your group already knows.",
    "sheetsCopy": "Use PDF character sheets with the Gravewright PDF System, map the fields you need and connect each character to a token. Keep the details within reach when the next decision comes.",
    "releaseLabel": "Coming next",
    "releaseTitle": "More room to play. 0.2.0 Alpha.",
    "releaseCopy": "The next Alpha brings independent system sheets, PDF combat, faster access to campaign content and a more consistent interface. Version 0.2.0 is prepared but not yet published; downloads still provide 0.1.3.",
    "releaseFeatures": [
      [
        "Follow the next turn",
        "PDF System combat gains token portraits, current- and next-turn indicators, resource bars and condition descriptions."
      ],
      [
        "Find what you need",
        "Search your campaign from the toolbar, with results limited to content each player is allowed to read."
      ],
      [
        "A table that stays out of the way",
        "Compact windows, consistent controls and preferences inside the table keep the session close at hand."
      ],
      [
        "Your system, your sheet",
        "Third-party systems can present their own sheets. Module authors gain private translation catalogs through the host API."
      ]
    ],
    "installLabel": "Start your campaign",
    "installTitle": "Your first table is a few steps away.",
    "installCopy": "Download Gravewright, run the Windows installer and create your first table in the browser. Use the generated Runner whenever you are ready to play.",
    "steps": [
      [
        "Download Gravewright",
        "Extract the complete ZIP into a writable folder. Keep its files together."
      ],
      [
        "Set up your installation",
        "Open Install Windows.bat and choose your settings. The installer downloads the tools it needs."
      ],
      [
        "Create your first table",
        "Open Gravewright Runner.bat, create your administrator account and start preparing your campaign. Keep the Runner open while you play."
      ]
    ],
    "requirement": "Windows 10 (1803+) or Windows 11 · x64 · Browser with WebGL",
    "localTitle": "Ready to invite your group?",
    "localCopy": "The Windows Runner starts a table on your own computer. To let players join over your network or the internet, follow the hosting guide to set up a shared server.",
    "deployment": "Set up a shared table",
    "runnerGuide": "Windows Runner guide",
    "sourceLabel": "More ways to host",
    "sourceTitle": "Run Gravewright your way.",
    "sourceCopy": "Prefer a server or a source checkout? Use Python 3.14 or newer and uv. The commands below use a POSIX shell and keep your existing configuration.",
    "sourceHeader": "Terminal · source setup",
    "copy": "Copy",
    "copied": "Copied",
    "selected": "Selected",
    "copiedMessage": "Commands copied to the clipboard.",
    "selectedMessage": "Clipboard unavailable. Commands selected for manual copying.",
    "extensionsLabel": "A table that grows with you",
    "extensionsTitle": "Choose the tools that fit your game.",
    "extensionsCopy": "Add modules and systems from the Marketplace, or build your own. Explore 3D Dice for your rolls and Translator for Portuguese and Spanish interface catalogs.",
    "licenseTitle": "Open source, with room for independent creators.",
    "licenseCopy": "Gravewright’s core uses GPL-3.0-only with an Independent Module Permission. Independently written modules can use any license, including a proprietary one. See the licensing policy for the full terms.",
    "api": "Explore the integration API",
    "modules": "Create a module",
    "marketplace": "Explore the Marketplace",
    "licensing": "Read the licensing policy",
    "faqLabel": "Before you start",
    "faqTitle": "A few things about your new table.",
    "faq": [
      [
        "Is Gravewright free?",
        "Yes. Gravewright is free and open source. You host your installation and keep control of your campaign files. Third-party modules have their own licenses and terms."
      ],
      [
        "How do players join?",
        "Players join a shared server through their browser. The Windows Runner starts locally; use the hosting guide to make your installation available to your group."
      ],
      [
        "Can I use the interface in Portuguese or Spanish?",
        "Install Translator from the Marketplace and activate its languages. Each user can choose English, Brazilian Portuguese or Spanish. Documents and text written by your group keep their original language."
      ],
      [
        "Where are my campaigns stored?",
        "The Windows Runner keeps its data under %LOCALAPPDATA%\\Gravewright\\data. Stop the Runner and back up that folder before an upgrade. Server installations use the storage locations you configure."
      ],
      [
        "Is 0.2.0 available to download?",
        "Not yet. The 0.2.0 Alpha package has been prepared; the public download is still 0.1.3. Gravewright is in active Alpha development, so keep backups of important campaigns."
      ],
      [
        "Can I add my own systems and modules?",
        "Yes. Gravewright supports custom systems and modules with documented APIs. Install extensions from creators you trust; browser modules run inside the table page."
      ]
    ],
    "contributeLabel": "Built with the community",
    "contributeTitle": "Help shape the next session.",
    "contributeCopy": "Tell us how Gravewright works at your table. Share an idea, report a problem or help improve translations, accessibility and documentation. Developers can also contribute to the core or create their own modules.",
    "contribute": "Ways to contribute",
    "issues": "Share feedback",
    "security": "Security policy",
    "finalLabel": "Make room for your next adventure",
    "finalTitle": "Your campaign has a place here.",
    "footer": "Your RPG table. Your world to build.",
    "top": "Back to top",
    "mediaSoon": "Preview coming soon",
    "image": "Image",
    "video": "Video",
    "videoFallback": "Your browser cannot play this video.",
    "videoDownload": "Download the video",
    "transcript": "Read the transcript",
    "musicCredit": "Music"
  },
  "pt": {
    "lang": "pt-BR",
    "file": "pt-br.html",
    "otherFile": "index.html",
    "otherLabel": "English",
    "docs": "pt-BR",
    "suffix": ".pt-BR",
    "title": "Gravewright — Uma Mesa Virtual para Sua Campanha de RPG",
    "description": "Reúna sua campanha de RPG com mapas, fichas, dados e ambientação. Uma mesa virtual gratuita e open source, hospedada por você e feita para o seu grupo.",
    "skip": "Pular para o conteúdo",
    "home": "Página inicial do Gravewright",
    "navigation": "Navegação principal",
    "menu": "Abrir ou fechar navegação",
    "nav": [
      "Veja em ação",
      "Novidades",
      "Comece a jogar",
      "Comunidade"
    ],
    "eyebrow": "Sua mesa de RPG · Gratuita e open source · Alpha",
    "lead": "Seu mundo. Seu grupo. Sua próxima grande sessão.",
    "intro": "Prepare a cena, reúna os jogadores e deixe a aventura avançar. O Gravewright reúne mapas, personagens e ferramentas de campanha em uma mesa sob seu controle.",
    "download": "Baixar Gravewright para Windows",
    "explore": "Veja o Gravewright em ação",
    "notes": "Versão disponível",
    "documentation": "Documentação",
    "downloadHint": "Disponível: 0.1.3 · Instalador Windows x64 incluído · Próxima versão: 0.2.0 Alpha",
    "panelLabel": "Tudo começa na sua mesa",
    "panelAria": "Sua campanha com o Gravewright",
    "pillars": [
      [
        "Dê vida à cena",
        "Crie a atmosfera com iluminação, névoa, áudio e efeitos visuais."
      ],
      [
        "Tenha os personagens por perto",
        "Abra as fichas e mova os tokens pelo mundo que você preparou."
      ],
      [
        "Mantenha o ritmo da sessão",
        "Mapas, dados, anotações e combate dividem a mesma mesa."
      ],
      [
        "Deixe a mesa com a sua cara",
        "Hospede suas campanhas e escolha os sistemas e módulos que combinam com seu grupo."
      ]
    ],
    "aboutLabel": "Pensado para sua campanha",
    "aboutTitle": "Menos distância entre as ferramentas e a história.",
    "aboutCopy": "Prepare os lugares que os jogadores vão explorar. Tenha os personagens e suas descobertas à mão. Na próxima sessão, sua campanha estará pronta para continuar.",
    "features": [
      [
        "Revele o mundo no seu ritmo",
        "Prepare cenas com paredes, iluminação e névoa e escolha o que o grupo pode ver."
      ],
      [
        "Jogue com fichas conhecidas",
        "Traga as fichas PDF da sua mesa e mapeie os campos para seus personagens."
      ],
      [
        "Dê um lugar às descobertas",
        "Mantenha diários, missões e materiais junto dos lugares e pessoas da campanha."
      ],
      [
        "Continue na mesa",
        "Role dados, toque áudio, compre cartas e acompanhe o combate sem trocar de aplicativo."
      ]
    ],
    "experienceLabel": "Gravewright em ação · 51 segundos",
    "experienceTitle": "Entre no covil do dragão.",
    "experienceCopy": "Entre em The Dragon’s Legacy: um campo de batalha cercado por lava, um dragão à espreita e um grupo em movimento. Veja iluminação, névoa e personagens em uma captura real do Gravewright, com trilha orquestral de batalha.",
    "roles": [
      [
        "Para o mestre",
        "Tenha a próxima cena pronta",
        "Prepare encontros, organize as anotações da campanha e revele a cena certa quando o grupo chegar."
      ],
      [
        "Para os jogadores",
        "Ocupe seu lugar na história",
        "Entre na mesa hospedada pelo mestre usando o navegador, abra sua ficha e jogue com o grupo."
      ],
      [
        "Para a campanha",
        "Continue de onde parou",
        "Mantenha personagens, lugares e descobertas compartilhadas juntos entre as sessões."
      ]
    ],
    "sheetsLabel": "Seus personagens à mão",
    "sheetsTitle": "Traga a ficha que seu grupo já conhece.",
    "sheetsCopy": "Use fichas PDF com o Gravewright PDF System, mapeie os campos de que precisa e vincule cada personagem a um token. Deixe os detalhes por perto para a próxima decisão.",
    "releaseLabel": "Vem aí",
    "releaseTitle": "Mais espaço para jogar. 0.2.0 Alpha.",
    "releaseCopy": "A próxima Alpha traz fichas independentes por sistema, combate no PDF System, acesso mais rápido ao conteúdo da campanha e uma interface mais coesa. A 0.2.0 está preparada, mas ainda não foi publicada; o download continua na 0.1.3.",
    "releaseFeatures": [
      [
        "Acompanhe a próxima jogada",
        "O combate do PDF System ganha retratos dos tokens, indicadores de turno atual e próximo, barras de recursos e descrições de condições."
      ],
      [
        "Encontre o que precisa",
        "Busque o conteúdo da campanha pela barra, com resultados limitados ao que cada jogador tem permissão de ler."
      ],
      [
        "Uma mesa que deixa a sessão fluir",
        "Janelas compactas, controles consistentes e preferências dentro da mesa mantêm tudo por perto."
      ],
      [
        "Seu sistema, sua ficha",
        "Sistemas de terceiros podem apresentar suas próprias fichas. Autores de módulos ganham catálogos privados de tradução pela API do VTT."
      ]
    ],
    "installLabel": "Comece sua campanha",
    "installTitle": "Sua primeira mesa está a poucos passos.",
    "installCopy": "Baixe o Gravewright, execute o instalador Windows e crie sua primeira mesa no navegador. Use o Runner gerado sempre que estiver pronto para jogar.",
    "steps": [
      [
        "Baixe o Gravewright",
        "Extraia o ZIP completo para uma pasta com permissão de escrita. Mantenha os arquivos juntos."
      ],
      [
        "Prepare sua instalação",
        "Abra Install Windows.bat e escolha suas configurações. O instalador baixa as ferramentas necessárias."
      ],
      [
        "Crie sua primeira mesa",
        "Abra Gravewright Runner.bat, crie sua conta de administrador e comece a preparar a campanha. Mantenha o Runner aberto enquanto joga."
      ]
    ],
    "requirement": "Windows 10 (1803+) ou Windows 11 · x64 · Navegador com WebGL",
    "localTitle": "Pronto para convidar o grupo?",
    "localCopy": "O Runner Windows inicia uma mesa no seu computador. Para receber jogadores pela rede ou pela internet, siga o guia de hospedagem e configure um servidor compartilhado.",
    "deployment": "Prepare uma mesa compartilhada",
    "runnerGuide": "Guia do Runner para Windows",
    "sourceLabel": "Outras formas de hospedar",
    "sourceTitle": "Execute do seu jeito.",
    "sourceCopy": "Prefere um servidor ou uma cópia do código? Use Python 3.14 ou superior e uv. Os comandos abaixo usam um shell POSIX e preservam sua configuração existente.",
    "sourceHeader": "Terminal · instalação pelo código",
    "copy": "Copiar",
    "copied": "Copiado",
    "selected": "Selecionado",
    "copiedMessage": "Comandos copiados.",
    "selectedMessage": "Área de transferência indisponível. Comandos selecionados para copiar manualmente.",
    "extensionsLabel": "Uma mesa que cresce com você",
    "extensionsTitle": "Escolha as ferramentas do seu jogo.",
    "extensionsCopy": "Adicione módulos e sistemas pelo Marketplace ou crie os seus. Conheça o 3D Dice para suas rolagens e o Translator para os catálogos de interface em português e espanhol.",
    "licenseTitle": "Open source, com espaço para criadores independentes.",
    "licenseCopy": "O núcleo do Gravewright usa GPL-3.0-only com uma permissão para módulos independentes. Módulos escritos de forma independente podem usar qualquer licença, inclusive proprietária. Consulte os termos completos na política de licenciamento.",
    "api": "Conheça a API de integração",
    "modules": "Crie um módulo",
    "marketplace": "Conheça o Marketplace",
    "licensing": "Leia a política de licenciamento",
    "faqLabel": "Antes de começar",
    "faqTitle": "Conheça sua nova mesa.",
    "faq": [
      [
        "O Gravewright é gratuito?",
        "Sim. O Gravewright é gratuito e open source. Você hospeda sua instalação e mantém o controle dos arquivos da campanha. Módulos de terceiros têm suas próprias licenças e condições."
      ],
      [
        "Como os jogadores entram?",
        "Os jogadores acessam um servidor compartilhado pelo navegador. O Runner Windows inicia localmente; siga o guia de hospedagem para disponibilizar sua instalação ao grupo."
      ],
      [
        "Posso usar a interface em português ou espanhol?",
        "Instale o Translator pelo Marketplace e ative seus idiomas. Cada usuário pode escolher inglês, português brasileiro ou espanhol. Documentos e textos escritos pelo grupo mantêm o idioma original."
      ],
      [
        "Onde ficam minhas campanhas?",
        "O Runner Windows guarda os dados em %LOCALAPPDATA%\\Gravewright\\data. Encerre o Runner e faça backup dessa pasta antes de atualizar. Instalações em servidor usam os locais que você configurar."
      ],
      [
        "A 0.2.0 já está disponível para baixar?",
        "Ainda não. O pacote 0.2.0 Alpha está preparado; o download público continua na 0.1.3. O Gravewright está em desenvolvimento Alpha, então mantenha backups das campanhas importantes."
      ],
      [
        "Posso adicionar meus próprios sistemas e módulos?",
        "Sim. O Gravewright aceita sistemas e módulos personalizados com APIs documentadas. Instale extensões de criadores em quem confia; módulos de navegador executam dentro da página da mesa."
      ]
    ],
    "contributeLabel": "Feito com a comunidade",
    "contributeTitle": "Ajude a preparar a próxima sessão.",
    "contributeCopy": "Conte como o Gravewright funciona na sua mesa. Compartilhe uma ideia, relate um problema ou ajude com traduções, acessibilidade e documentação. Desenvolvedores também podem contribuir com o núcleo ou criar seus próprios módulos.",
    "contribute": "Como participar",
    "issues": "Enviar feedback",
    "security": "Política de segurança",
    "finalLabel": "Abra espaço para sua próxima aventura",
    "finalTitle": "Sua campanha tem lugar aqui.",
    "footer": "Sua mesa de RPG. Seu mundo para criar.",
    "top": "Voltar ao topo",
    "mediaSoon": "Prévia em breve",
    "image": "Imagem",
    "video": "Vídeo",
    "videoFallback": "Seu navegador não consegue reproduzir este vídeo.",
    "videoDownload": "Baixar o vídeo",
    "transcript": "Ler a transcrição",
    "musicCredit": "Música"
  }
};

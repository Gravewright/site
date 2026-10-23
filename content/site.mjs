// Product copy and public download identity shared by both pages.
// Update publicVersion only after the VTT release and its ZIP are published.
export const project = 'https://github.com/Gravewright/gravewright';
export const publicVersion = '0.3.2';
export const release = `${project}/releases/tag/v${publicVersion}`;
export const download = `${project}/releases/download/v${publicVersion}/Gravewright-${publicVersion}-django.zip`;
export const dndProject = 'https://github.com/Gravewright/dnd-srd-5e';
export const dndRelease = `${dndProject}/releases/tag/v0.1.2`;
export const swadeProject = 'https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright';
export const swadeName = 'Savage Worlds Compatibility Package for Gravewright';
export const swadeVersion = '0.1.2';
export const swadeRelease = `${swadeProject}/releases/tag/v${swadeVersion}`;
export const commands = "git clone https://github.com/Gravewright/gravewright.git\ncd gravewright\nuv sync --locked\ncp -n .env.example .env\nuv run --locked python manage.py migrate\nuv run --locked python main.py";

export const locales = {
  "en": {
    "lang": "en",
    "file": "index.html",
    "otherFile": "pt-br.html",
    "otherLabel": "Português",
    "docs": "en",
    "suffix": "",
    "title": "Gravewright 0.3.2 — Universal VTT and campaign tools",
    "description": "Prepare campaigns, connect mind maps, map PDF sheets and build interactive scenes in a free, open-source universal VTT. Gravewright 0.3.2 for Windows, Linux and macOS.",
    "skip": "Skip to content",
    "home": "Gravewright home",
    "navigation": "Main navigation",
    "menu": "Toggle navigation",
    "nav": [
      "Map Builder",
      "What’s new",
      "Get started",
      "Community"
    ],
    "eyebrow": "Universal VTT · Free and open source · Alpha",
    "lead": "Your world. Your players. Your next great session.",
    "intro": "A universal virtual tabletop for the worlds you create. Prepare your campaign between sessions, connect its people and discoveries, then bring maps, tokens, dice and notes to your own hosted table.",
    "download": "Get Gravewright",
    "explore": "Explore Map Builder",
    "notes": "Available release",
    "documentation": "Documentation",
    "downloadHint": "Available now: 0.3.2 Alpha · Windows, Linux and macOS installers included",
    "systemHint": "Your game, your tools · Independent systems, modules and PDF sheets",
    "panelLabel": "Everything starts at your table",
    "panelAria": "Your campaign with Gravewright",
    "pillars": [
      [
        "Bring the scene to life",
        "Set the mood with lighting, fog, audio and visual effects."
      ],
      [
        "Keep your characters close",
        "Use your game’s own sheets or bring a familiar PDF."
      ],
      [
        "Prepare the next session",
        "Manage quests, journals and campaign plans before entering the table."
      ],
      [
        "Make the table yours",
        "Host your campaigns and add the systems and modules that fit your group."
      ]
    ],
    "aboutLabel": "One table, many ways to play",
    "aboutTitle": "Make room for your worlds.",
    "aboutCopy": "Prepare the places your group will explore, organize its discoveries and set the mood for the next scene. Gravewright brings the shared tools of an RPG session together; installed systems provide their own sheets and rules.",
    "features": [
      [
        "Reveal the world at your pace",
        "Build scenes with walls, lighting and fog, then choose what the party sees."
      ],
      [
        "Give characters their own space",
        "Open dedicated system sheets, keep a character’s resources close and send rolls straight to chat."
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
    "experienceLabel": "Gravewright in action · Real application footage",
    "experienceTitle": "From the scene to the next decision.",
    "experienceCopy": "See the real 0.3.2 application at work: prepare a campaign, connect a mind map, organize journals and follow clocks and clues. The walkthrough also shows the tabletop and a mapped PDF sheet, using fictional campaign data.",
    "galleryTitle": "Another world to explore",
    "galleryCopy": "Expand the preserved Dragon’s Legacy battle scene.",
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
    "sheetsTitle": "A sheet that fits your game.",
    "sheetsCopy": "Bring a familiar PDF with the Gravewright PDF System, even without editable form fields, or choose a compatible system with its own sheets. Connect values to token bars and saved dice actions, then use the same sheets at the table or in campaign management.",
    "sheetOptions": [
      [
        "Your own PDF",
        "Draw text, number, checkbox and multiline fields over a PDF. Double-click a field to configure token bars or a dice formula with ready-made presets."
      ],
      [
        "System sheets",
        "Installed systems can provide their own character, creature and item sheets, with the rules and automations they support."
      ]
    ],
    "releaseLabel": "The latest Alpha",
    "releaseTitle": "Prepare more. Connect the whole campaign.",
    "releaseCopy": "Gravewright 0.3.2 Alpha brings a GM campaign manager, collaborative mind maps, shared discoveries and deeper PDF and map authoring. Preparation and play use the same campaign records, with each resource’s existing permissions.",
    "releaseFeatures": [
      [
        "Prepare without entering the table",
        "Open Manage campaign for your journals, quests, characters, scenes and other native tools. Seven preparation areas add a personal dashboard, session planner, timeline/calendar, quest columns, connections, player preview, and history/trash."
      ],
      [
        "Connect your ideas with mind maps",
        "Arrange topics, notes and connections, and link 37 types of campaign resources. GMs choose the audience and authorized player editors. The same saved graphs open on the table and in the manager; linked resources keep their own access rules."
      ],
      [
        "Track progress and reveal discoveries",
        "Open clocks and clues from the lower dock. Their transparent pinned indicators move independently in each browser. Left-click editable progress to advance; right-click to reduce it. Double-click a name to edit as GM or read its description as a player. Clues reveal their content when complete."
      ],
      [
        "Give your journals a structure",
        "Create empty chapters and nested subchapters, move pages or leave them outside a chapter, and reorganize without losing their text. Type @ to link sheets, quests and other campaign resources, or / to insert blocks. Readers only receive the content they can access."
      ],
      [
        "Turn your PDF into a working sheet",
        "Map fields and dice actions, then use seven authoring improvements: reusable mapping templates, batch application, calculated fields, selection and alignment tools, layout undo/redo, filled PDF export, and mapping diagnostics. Your original PDF stays intact."
      ],
      [
        "Build on the maps you already have",
        "Use Edit Scene to reopen or adopt a compatible scene in Map Builder. Import Universal VTT into a linked scene and editable project, with supported walls, doors, lights and grid. Connect Smart Object nodes to clocks, clues and mind-map topics, then generate or update the scene explicitly."
      ]
    ],
    "installLabel": "Start your campaign",
    "installTitle": "Your first table is a few steps away.",
    "installCopy": "Download the ZIP for Windows, Linux or macOS, run your platform’s installer and create your first table in the browser. Use the generated Runner whenever you are ready to play.",
    "steps": [
      [
        "Download Gravewright",
        "Extract the complete ZIP into a writable folder. The same download includes installers for Windows, Linux and macOS; keep its files together."
      ],
      [
        "Set up your installation",
        "Run Install Windows.bat, Install Linux.sh or Install macOS.command for your platform. The installer downloads the tools it needs and prepares your local installation."
      ],
      [
        "Create your first table",
        "Start the generated Gravewright Runner for your platform, create your administrator account and prepare your campaign. Keep the Runner open while you play."
      ]
    ],
    "requirement": "Windows x64 · Linux · macOS · Browser with WebGL",
    "localTitle": "Ready to invite your group?",
    "localCopy": "The Runner starts a table on your own computer. To let players join over your network or the internet, follow the hosting guide to set up a shared server.",
    "deployment": "Set up a shared table",
    "runnerGuide": "Installation and Runner guides",
    "sourceLabel": "More ways to host",
    "sourceTitle": "Run Gravewright your way.",
    "sourceCopy": "Prefer a server or a source checkout? Use Python 3.14 or newer and uv. The commands below use a POSIX shell and keep your existing configuration.",
    "sourceHeader": "Terminal · source setup",
    "copy": "Copy",
    "copied": "Copied",
    "selected": "Selected",
    "copiedMessage": "Commands copied to the clipboard.",
    "selectedMessage": "Clipboard unavailable. Commands selected for manual copying.",
    "extensionsLabel": "A universal table, shaped by you",
    "extensionsTitle": "Your system. Your tools. Your way to play.",
    "extensionsCopy": "Gravewright provides the tabletop. Independent systems bring game-specific sheets and rules; modules add tools such as translations and 3D dice. Use a compatible system or mapped PDFs for your group’s game, and build your own extensions through the documented API.",
    "systemLabel": "Optional system example · Available in the Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.2",
    "systemCopy": "DnD 5e SRD is one independent system you can install in Gravewright. It adds dedicated sheets, licensed compendiums and supported automations for the 2014 and 2024 rules.",
    "systemFacts": [
      [
        "2,535",
        "SRD entries"
      ],
      [
        "20",
        "Compendium packs"
      ],
      [
        "2014 / 2024",
        "Selectable rules"
      ]
    ],
    "systemNote": "Partial SRD collections; compendium content is in English. Install DnD 5e SRD 0.1.2 as one package from Systems: sheets, compendiums and combat automation stay together. The GM advances combat from the table. Check the system’s installation guide for host requirements; its setup currently documents VTT 0.2.3.",
    "systemAction": "Explore DnD 5e SRD",
    "systemDownload": "Get version 0.1.2",
    "swadeLabel": "Optional compatibility package · Available in the Marketplace",
    "swadeDetails": "Explore sheets, item templates and automation",
    "swadeCopy": "One system package brings free character and NPC sheets, 13 empty item templates and SWADE automation. Create your own campaign content and customize action decks and table settings.",
    "swadeFacts": [
      [
        "13",
        "Empty item templates"
      ],
      [
        "3",
        "Action-deck styles"
      ],
      [
        "en / pt-BR / es",
        "Interface languages"
      ]
    ],
    "swadeNote": "No compendiums or rulebook text are included. Install version 0.1.2 as one package from Systems and select it for your table. The GM runs its combat automation from the table. English is built in; Portuguese and Spanish use Translator. Check the package’s installation guide for host requirements; its setup currently documents VTT 0.2.3.",
    "swadeAction": "Explore the SWADE package",
    "swadeDownload": "Get version 0.1.2",
    "extensionCards": [
      [
        "Translator",
        "0.1.2",
        "Choose English, Brazilian Portuguese or Spanish for your interface. The official translation API also serves compatible systems and modules.",
        "https://github.com/Gravewright/translator"
      ],
      [
        "Gravewright 3D Dice",
        "0.1.1",
        "See supported rolls as 3D dice and customize their colors, text and appearance.",
        "https://github.com/Gravewright/Gravewright-3D-Dice"
      ]
    ],
    "extensionAction": "Explore the module",
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
        "Which RPG systems can I use?",
        "Gravewright is a universal VTT. Use a compatible system extension for dedicated sheets and automations, or map PDF sheets for your group’s game. Available rules support depends on the system you install."
      ],
      [
        "Is Gravewright free?",
        "Yes. Gravewright is free and open source. You host your installation and keep control of your campaign files. Third-party modules have their own licenses and terms."
      ],
      [
        "How do players join?",
        "Players join a shared server through their browser. The Runner starts locally on Windows, Linux or macOS; use the hosting guide to make your installation available to your group."
      ],
      [
        "Can I use the interface in Portuguese or Spanish?",
        "Install Translator from the Marketplace and activate its languages. Each user can choose English, Brazilian Portuguese or Spanish; Marketplace categories, tags and tag searches follow that choice. Documents and text written by your group keep their original language."
      ],
      [
        "Where are my campaigns stored?",
        "Your campaigns stay on your host. The default portable installation stores the database and uploaded media in the application folder; you can configure other locations. Stop the Runner and back up the database, media, configuration and installed extensions before an upgrade."
      ],
      [
        "Is 0.3.2 available to download?",
        "Yes. Gravewright 0.3.2 Alpha is available now. The ZIP includes installers for Windows, Linux and macOS. Systems and modules are installed separately. Back up your installation and read the release notes before upgrading, especially if your installation reports the older, incorrectly numbered 3.0.1 version."
      ],
      [
        "What can I build with Map Builder?",
        "Paint maps, organize layers and add walls, doors, objects, lights and effects. Use object menus, choose from 14 editable behavior models or connect your own Smart Object nodes. Generate a GM-only scene, bring compatible scene edits back into the project and update its linked scene. Activating it for players is a separate action."
      ],
      [
        "Can I import a map I already have?",
        "Yes. Import a finished image as a Builder background, then add your own objects and behaviors. Import Universal VTT in Builder to create a linked native scene and editable project, or import through Scenes and adopt it later. Supported geometry stays editable; the flattened artwork remains one background. Export uses the saved native scene, not an unpublished project draft."
      ],
      [
        "Can I play with DnD 5e SRD?",
        "DnD 5e SRD 0.1.2 is available as one package from Systems. It includes dedicated sheets, combat automation and partial licensed SRD collections for the 2014 and 2024 profiles. Check its installation guide for host requirements; the guide currently documents VTT 0.2.3. Other D&D books and official artwork are not included."
      ],
      [
        "How do I install the Savage Worlds compatibility package?",
        "Get version 0.1.2 from Systems and select it for your table, following the package’s installation guide and host requirements. That guide currently documents VTT 0.2.3. Sheets, item templates, assets and automation belong to the same system package; no separate rules module is required."
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
    "footer": "A universal tabletop for the worlds you create.",
    "top": "Back to top",
    "mediaSoon": "Preview coming soon",
    "image": "Image",
    "video": "Video",
    "videoFallback": "Your browser cannot play this video.",
    "videoDownload": "Download the video",
    "transcript": "Read the transcript",
    "musicCredit": "Music",
    "systemDetails": "See this optional system in action",
    "builderLabel": "Map Builder · Updated in 0.3.2",
    "builderTitle": "Build the map. Connect what happens next.",
    "builderCopy": "Paint a map, import finished artwork or bring in Universal VTT geometry. Adopt compatible existing scenes with Edit Scene, connect Smart Object behaviors and bring supported scene edits back into the project. Your work saves automatically while you prepare; generating or updating the scene remains your choice.",
    "builderSteps": [
      [
        "Build your map",
        "Paint floors, draw walls and place doors, objects, lights and effects. Use your own layers or import a finished map as the background."
      ],
      [
        "Choose a model or connect the nodes",
        "Start with editable behavior models, then connect doors, dice prompts, quests, clocks, clues and mind-map topics. Customize the nodes and optional sound or artwork, and test the behavior before play."
      ],
      [
        "Bring it to the table",
        "Generate a GM-only scene or update its linked scene. Reopen the Builder or return to its tab to import compatible scene edits; activate the scene for players separately when ready."
      ]
    ],
    "builderGuide": "Open the Map Builder guide",
    "builderImportGuide": "Import and export Universal VTT",
    "builderViewFull": "View full screenshot",
    "runnerGuides": [
      [
        "Windows",
        "windows-runner.md"
      ],
      [
        "Linux",
        "linux-runner.md"
      ],
      [
        "macOS",
        "macos-runner.md"
      ]
    ],
    "releaseGuides": [
      [
        "Campaign manager",
        "campaign-management"
      ],
      [
        "Mind maps",
        "mindmaps"
      ],
      [
        "Clocks",
        "clocks"
      ],
      [
        "Clues",
        "clues"
      ],
      [
        "Journals and references",
        "journals"
      ],
      [
        "PDF System",
        "pdf-system"
      ],
      [
        "Map Builder",
        "map-builder"
      ]
    ],
    "releaseMediaTitle": "Inside Gravewright 0.3.2"
  },
  "pt": {
    "lang": "pt-BR",
    "file": "pt-br.html",
    "otherFile": "index.html",
    "otherLabel": "English",
    "docs": "pt-BR",
    "suffix": ".pt-BR",
    "title": "Gravewright 0.3.2 — VTT universal e ferramentas de campanha",
    "description": "Prepare campanhas, conecte mapas mentais, mapeie fichas PDF e crie cenas interativas em um VTT universal gratuito e open source. Gravewright 0.3.2 para Windows, Linux e macOS.",
    "skip": "Pular para o conteúdo",
    "home": "Página inicial do Gravewright",
    "navigation": "Navegação principal",
    "menu": "Abrir ou fechar navegação",
    "nav": [
      "Map Builder",
      "Novidades",
      "Comece a jogar",
      "Comunidade"
    ],
    "eyebrow": "VTT universal · Gratuito e open source · Alpha",
    "lead": "Seu mundo. Seu grupo. Sua próxima grande sessão.",
    "intro": "Uma mesa virtual universal para os mundos que você cria. Prepare a campanha entre sessões, conecte seus personagens e descobertas e reúna mapas, tokens, dados e anotações na sua própria mesa.",
    "download": "Baixar Gravewright",
    "explore": "Explore o Map Builder",
    "notes": "Versão disponível",
    "documentation": "Documentação",
    "downloadHint": "Disponível agora: 0.3.2 Alpha · Instaladores Windows, Linux e macOS incluídos",
    "systemHint": "Seu jogo, suas ferramentas · Sistemas independentes, módulos e fichas PDF",
    "panelLabel": "Tudo começa na sua mesa",
    "panelAria": "Sua campanha com o Gravewright",
    "pillars": [
      [
        "Dê vida à cena",
        "Crie a atmosfera com iluminação, névoa, áudio e efeitos visuais."
      ],
      [
        "Tenha os personagens por perto",
        "Use as fichas próprias do seu sistema ou traga um PDF conhecido."
      ],
      [
        "Prepare a próxima sessão",
        "Organize missões, diários e planos da campanha antes de entrar na mesa."
      ],
      [
        "Deixe a mesa com a sua cara",
        "Hospede suas campanhas e escolha os sistemas e módulos que combinam com seu grupo."
      ]
    ],
    "aboutLabel": "Uma mesa, muitas formas de jogar",
    "aboutTitle": "Dê espaço aos seus mundos.",
    "aboutCopy": "Prepare os lugares que o grupo vai explorar, organize suas descobertas e crie a atmosfera da próxima cena. O Gravewright reúne as ferramentas compartilhadas de uma sessão de RPG; os sistemas instalados trazem suas próprias fichas e regras.",
    "features": [
      [
        "Revele o mundo no seu ritmo",
        "Prepare cenas com paredes, iluminação e névoa e escolha o que o grupo pode ver."
      ],
      [
        "Dê espaço aos personagens",
        "Abra as fichas do sistema, tenha os recursos por perto e envie as rolagens direto para o chat."
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
    "experienceLabel": "Gravewright em ação · Capturas reais do aplicativo",
    "experienceTitle": "Da cena à próxima decisão.",
    "experienceCopy": "Veja a aplicação 0.3.2 real em uso: prepare uma campanha, conecte um mapa mental, organize diários e acompanhe relógios e pistas. A demonstração também mostra a mesa e uma ficha PDF mapeada, com dados fictícios de campanha.",
    "galleryTitle": "Outro mundo para explorar",
    "galleryCopy": "Amplie a cena de batalha preservada de The Dragon’s Legacy.",
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
    "sheetsTitle": "A ficha que combina com seu jogo.",
    "sheetsCopy": "Traga um PDF conhecido com o Gravewright PDF System, mesmo sem campos editáveis, ou escolha um sistema compatível com fichas próprias. Vincule valores às barras dos tokens e a rolagens salvas e use as mesmas fichas na mesa ou no gestor da campanha.",
    "sheetOptions": [
      [
        "Seu próprio PDF",
        "Desenhe campos de texto, número, checkbox e texto multilinha sobre o PDF. Dê dois cliques em um campo para configurar barras de token ou uma fórmula de dados com exemplos prontos."
      ],
      [
        "Fichas do sistema",
        "Os sistemas instalados podem oferecer fichas próprias de personagens, criaturas e itens, com as regras e automações compatíveis."
      ]
    ],
    "releaseLabel": "A nova Alpha",
    "releaseTitle": "Prepare mais. Conecte a campanha inteira.",
    "releaseCopy": "O Gravewright 0.3.2 Alpha traz gestor de campanhas para mestres, mapas mentais colaborativos, descobertas compartilhadas e mais recursos para fichas PDF e mapas. Preparação e jogo usam os mesmos registros da campanha, com as permissões de cada recurso.",
    "releaseFeatures": [
      [
        "Prepare sem entrar na mesa",
        "Abra Gerenciar campanha para acessar diários, missões, personagens, cenas e outras ferramentas nativas. Sete áreas de preparação acrescentam painel pessoal, planejador de sessões, linha do tempo/calendário, colunas de missões, conexões, prévia de jogador e histórico/lixeira."
      ],
      [
        "Conecte ideias com mapas mentais",
        "Organize tópicos, notas e conexões e vincule 37 tipos de recursos da campanha. Os mestres escolhem quem pode ler e quais jogadores podem editar. Os mesmos mapas salvos abrem na mesa e no gestor; os recursos vinculados mantêm suas próprias permissões."
      ],
      [
        "Acompanhe o progresso e revele descobertas",
        "Abra relógios e pistas pelo dock inferior. Os indicadores fixados são transparentes e cada pessoa os posiciona no próprio navegador. Clique esquerdo avança o progresso editável; direito reduz. Dois cliques no nome abrem a edição para mestres ou a descrição para jogadores. Pistas revelam o conteúdo ao serem concluídas."
      ],
      [
        "Organize seus diários",
        "Crie capítulos vazios e subcapítulos, mova páginas ou deixe-as sem capítulo e reorganize sem perder o texto. Digite @ para vincular fichas, missões e outros recursos da campanha, ou / para inserir blocos. Cada leitor recebe apenas o conteúdo autorizado."
      ],
      [
        "Transforme seu PDF em uma ficha funcional",
        "Mapeie campos e rolagens e use sete melhorias de edição: modelos reutilizáveis de mapeamento, aplicação em lote, campos calculados, seleção e alinhamento, desfazer/refazer do layout, exportação do PDF preenchido e diagnósticos de mapeamento. O PDF original é preservado."
      ],
      [
        "Aproveite os mapas que você já tem",
        "Use Editar Cena para reabrir ou adotar uma cena compatível no Map Builder. Importe Universal VTT para uma cena vinculada e um projeto editável, com paredes, portas, luzes e grade compatíveis. Conecte nodes de Objetos Inteligentes a relógios, pistas e tópicos de mapas mentais e gere ou atualize a cena explicitamente."
      ]
    ],
    "installLabel": "Comece sua campanha",
    "installTitle": "Sua primeira mesa está a poucos passos.",
    "installCopy": "Baixe o ZIP para Windows, Linux ou macOS, execute o instalador da sua plataforma e crie a primeira mesa pelo navegador. Use o Runner gerado sempre que estiver pronto para jogar.",
    "steps": [
      [
        "Baixe o Gravewright",
        "Extraia o ZIP completo para uma pasta com permissão de escrita. O mesmo download inclui instaladores para Windows, Linux e macOS; mantenha os arquivos juntos."
      ],
      [
        "Prepare sua instalação",
        "Execute Install Windows.bat, Install Linux.sh ou Install macOS.command conforme a plataforma. O instalador baixa as ferramentas necessárias e prepara a instalação local."
      ],
      [
        "Crie sua primeira mesa",
        "Inicie o Gravewright Runner gerado para sua plataforma, crie a conta de administrador e prepare a campanha. Mantenha o Runner aberto enquanto joga."
      ]
    ],
    "requirement": "Windows x64 · Linux · macOS · Navegador com WebGL",
    "localTitle": "Pronto para convidar o grupo?",
    "localCopy": "O Runner inicia uma mesa no seu computador. Para receber jogadores pela rede ou pela internet, siga o guia de hospedagem e configure um servidor compartilhado.",
    "deployment": "Prepare uma mesa compartilhada",
    "runnerGuide": "Guias de instalação e Runner",
    "sourceLabel": "Outras formas de hospedar",
    "sourceTitle": "Execute do seu jeito.",
    "sourceCopy": "Prefere um servidor ou uma cópia do código? Use Python 3.14 ou superior e uv. Os comandos abaixo usam um shell POSIX e preservam sua configuração existente.",
    "sourceHeader": "Terminal · instalação pelo código",
    "copy": "Copiar",
    "copied": "Copiado",
    "selected": "Selecionado",
    "copiedMessage": "Comandos copiados.",
    "selectedMessage": "Área de transferência indisponível. Comandos selecionados para copiar manualmente.",
    "extensionsLabel": "Uma mesa universal, feita por você",
    "extensionsTitle": "Seu sistema. Suas ferramentas. Sua forma de jogar.",
    "extensionsCopy": "O Gravewright oferece a mesa virtual. Sistemas independentes trazem fichas e regras de cada jogo; módulos acrescentam ferramentas como traduções e dados 3D. Use um sistema compatível ou PDFs mapeados para o jogo do grupo e crie suas extensões com a API documentada.",
    "systemLabel": "Exemplo de sistema opcional · Disponível no Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.2",
    "systemCopy": "DnD 5e SRD é um dos sistemas independentes que você pode instalar no Gravewright. Ele acrescenta fichas próprias, compêndios licenciados e automações compatíveis com as regras de 2014 e 2024.",
    "systemFacts": [
      [
        "2.535",
        "Entradas do SRD"
      ],
      [
        "20",
        "Compêndios"
      ],
      [
        "2014 / 2024",
        "Regras à escolha"
      ]
    ],
    "systemNote": "Coleções parciais do SRD; os compêndios estão em inglês. Instale DnD 5e SRD 0.1.2 como um único pacote em Sistemas: fichas, compêndios e automações de combate ficam juntos. O mestre avança o combate pela mesa. Confira os requisitos do host no guia de instalação do sistema; sua configuração ainda documenta o VTT 0.2.3.",
    "systemAction": "Conheça o DnD 5e SRD",
    "systemDownload": "Baixar a versão 0.1.2",
    "swadeLabel": "Pacote de compatibilidade opcional · Disponível no Marketplace",
    "swadeDetails": "Conheça as fichas, os modelos de itens e as automações",
    "swadeCopy": "Um único pacote de sistema reúne fichas gratuitas de personagens e NPCs, 13 modelos vazios de itens e automações de SWADE. Crie o conteúdo da sua campanha e personalize os baralhos de ação e as opções da mesa.",
    "swadeFacts": [
      [
        "13",
        "Modelos vazios de itens"
      ],
      [
        "3",
        "Estilos de baralho de ação"
      ],
      [
        "en / pt-BR / es",
        "Idiomas da interface"
      ]
    ],
    "swadeNote": "O pacote não inclui compêndios nem textos do livro. Instale a versão 0.1.2 como um único pacote em Sistemas e selecione-o para a mesa. O mestre conduz as automações de combate pela mesa. Inglês está disponível por padrão; português e espanhol usam o Translator. Confira os requisitos do host no guia de instalação do pacote; sua configuração ainda documenta o VTT 0.2.3.",
    "swadeAction": "Conheça o pacote SWADE",
    "swadeDownload": "Baixar a versão 0.1.2",
    "extensionCards": [
      [
        "Translator",
        "0.1.2",
        "Escolha inglês, português brasileiro ou espanhol para sua interface. A API oficial de tradução também atende sistemas e módulos compatíveis.",
        "https://github.com/Gravewright/translator"
      ],
      [
        "Gravewright 3D Dice",
        "0.1.1",
        "Veja as rolagens compatíveis em dados 3D e personalize suas cores, textos e aparência.",
        "https://github.com/Gravewright/Gravewright-3D-Dice"
      ]
    ],
    "extensionAction": "Conheça o módulo",
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
        "Quais sistemas de RPG posso usar?",
        "O Gravewright é um VTT universal. Use uma extensão de sistema compatível para ter fichas e automações próprias ou mapeie fichas PDF para o jogo do grupo. O suporte às regras depende do sistema instalado."
      ],
      [
        "O Gravewright é gratuito?",
        "Sim. O Gravewright é gratuito e open source. Você hospeda sua instalação e mantém o controle dos arquivos da campanha. Módulos de terceiros têm suas próprias licenças e condições."
      ],
      [
        "Como os jogadores entram?",
        "Os jogadores acessam um servidor compartilhado pelo navegador. O Runner inicia localmente no Windows, Linux ou macOS; siga o guia de hospedagem para disponibilizar sua instalação ao grupo."
      ],
      [
        "Posso usar a interface em português ou espanhol?",
        "Instale o Translator pelo Marketplace e ative seus idiomas. Cada usuário pode escolher inglês, português brasileiro ou espanhol; categorias, tags e busca por tags do Marketplace seguem essa escolha. Documentos e textos escritos pelo grupo mantêm o idioma original."
      ],
      [
        "Onde ficam minhas campanhas?",
        "As campanhas ficam no seu host. A instalação portátil padrão guarda o banco de dados e a mídia enviada na pasta do aplicativo; você pode configurar outros locais. Encerre o Runner e faça backup do banco, da mídia, das configurações e das extensões instaladas antes de atualizar."
      ],
      [
        "A 0.3.2 já está disponível para baixar?",
        "Sim. O Gravewright 0.3.2 Alpha já está disponível. O ZIP inclui instaladores para Windows, Linux e macOS. Sistemas e módulos são instalados separadamente. Faça backup da instalação e leia as notas antes de atualizar, especialmente se sua instalação informa a antiga numeração incorreta 3.0.1."
      ],
      [
        "O que posso criar com o Map Builder?",
        "Pinte mapas, organize camadas e adicione paredes, portas, objetos, luzes e efeitos. Use os menus de objetos, escolha entre 14 modelos editáveis de comportamento ou conecte seus próprios nós de Objetos Inteligentes. Gere uma cena exclusiva do mestre, traga edições compatíveis da cena de volta ao projeto e atualize a cena vinculada. Ativá-la para os jogadores é uma ação separada."
      ],
      [
        "Posso importar um mapa que já tenho?",
        "Sim. Importe uma imagem pronta como fundo do Builder e adicione seus objetos e comportamentos. Importe Universal VTT no Builder para criar uma cena nativa vinculada e um projeto editável ou importe por Cenas e adote depois. A geometria compatível continua editável; a arte achatada permanece um único fundo. A exportação usa a cena nativa salva, não um rascunho não publicado do projeto."
      ],
      [
        "Posso jogar com o DnD 5e SRD?",
        "DnD 5e SRD 0.1.2 está disponível como um único pacote em Sistemas. Ele reúne fichas próprias, automações de combate e coleções parciais licenciadas do SRD para os perfis de 2014 e 2024. Confira os requisitos do host no guia de instalação; o guia ainda documenta o VTT 0.2.3. Outros livros de D&D e artes oficiais não estão incluídos."
      ],
      [
        "Como instalo o pacote de compatibilidade Savage Worlds?",
        "Obtenha a versão 0.1.2 em Sistemas e selecione-a para sua mesa, seguindo o guia de instalação e os requisitos do host do pacote. Esse guia ainda documenta o VTT 0.2.3. Fichas, modelos de itens, arquivos e automações pertencem ao mesmo pacote de sistema; não há módulo separado de regras."
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
    "footer": "Uma mesa virtual universal para os mundos que você cria.",
    "top": "Voltar ao topo",
    "mediaSoon": "Prévia em breve",
    "image": "Imagem",
    "video": "Vídeo",
    "videoFallback": "Seu navegador não consegue reproduzir este vídeo.",
    "videoDownload": "Baixar o vídeo",
    "transcript": "Ler a transcrição",
    "musicCredit": "Música",
    "systemDetails": "Veja este sistema opcional em uso",
    "builderLabel": "Map Builder · Novidades da 0.3.2",
    "builderTitle": "Crie o mapa. Conecte o que acontece depois.",
    "builderCopy": "Pinte um mapa, importe uma imagem pronta ou traga a geometria de um Universal VTT. Adote cenas existentes compatíveis com Editar Cena, conecte comportamentos de Objetos Inteligentes e traga edições compatíveis da cena de volta ao projeto. Seu trabalho é salvo automaticamente durante a preparação; você escolhe quando gerar ou atualizar a cena.",
    "builderSteps": [
      [
        "Construa seu mapa",
        "Pinte pisos, desenhe paredes e adicione portas, objetos, luzes e efeitos. Use suas próprias camadas ou importe um mapa pronto como fundo."
      ],
      [
        "Escolha um modelo ou conecte os nós",
        "Comece com modelos editáveis e conecte portas, pedidos de rolagem, missões, relógios, pistas e tópicos de mapas mentais. Personalize os nodes e o som ou a imagem opcional e teste o comportamento antes de jogar."
      ],
      [
        "Leve para a mesa",
        "Gere uma cena exclusiva do mestre ou atualize a cena vinculada. Reabra o Builder ou volte à sua aba para importar edições compatíveis da cena; ative-a para os jogadores separadamente quando estiver pronto."
      ]
    ],
    "builderGuide": "Abra o guia do Map Builder",
    "builderImportGuide": "Importe e exporte Universal VTT",
    "builderViewFull": "Ver captura completa",
    "runnerGuides": [
      [
        "Windows",
        "windows-runner.md"
      ],
      [
        "Linux",
        "linux-runner.md"
      ],
      [
        "macOS",
        "macos-runner.md"
      ]
    ],
    "releaseGuides": [
      [
        "Gestor de campanhas",
        "campaign-management"
      ],
      [
        "Mapas mentais",
        "mindmaps"
      ],
      [
        "Relógios",
        "clocks"
      ],
      [
        "Pistas",
        "clues"
      ],
      [
        "Diários e referências",
        "journals"
      ],
      [
        "PDF System",
        "pdf-system"
      ],
      [
        "Map Builder",
        "map-builder"
      ]
    ],
    "releaseMediaTitle": "Por dentro do Gravewright 0.3.2"
  }
};

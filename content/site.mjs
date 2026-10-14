// Product copy and public download identity shared by both pages.
// Update publicVersion only after the VTT release and its ZIP are published.
export const project = 'https://github.com/Gravewright/gravewright';
export const publicVersion = '0.2.3';
export const release = `${project}/releases/tag/v${publicVersion}`;
export const download = `${project}/releases/download/v${publicVersion}/Gravewright-${publicVersion}-django.zip`;
export const dndProject = 'https://github.com/Gravewright/dnd-srd-5e';
export const dndRelease = `${dndProject}/releases/tag/v0.1.1`;
export const swadeProject = 'https://github.com/Gravewright/Savage-Worlds-Compatibility-Package-for-Gravewright';
export const swadeName = 'Savage Worlds Compatibility Package for Gravewright';
export const swadeVersion = '0.1.1';
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
    "title": "Gravewright — A Universal Virtual Tabletop for RPGs",
    "description": "A free, open-source universal VTT for your RPG campaigns. Bring maps, tokens, dice, journals and atmosphere together, then choose your systems and modules.",
    "skip": "Skip to content",
    "home": "Gravewright home",
    "navigation": "Main navigation",
    "menu": "Toggle navigation",
    "nav": [
      "See it in action",
      "What’s new",
      "Get started",
      "Community"
    ],
    "eyebrow": "Universal VTT · Free and open source · Alpha",
    "lead": "Your world. Your players. Your next great session.",
    "intro": "A universal virtual tabletop for the worlds you create. Bring maps, tokens, dice and campaign notes together, host your own table and choose the systems and tools that fit your group.",
    "download": "Get Gravewright for Windows",
    "explore": "See Gravewright in action",
    "notes": "Available release",
    "documentation": "Documentation",
    "downloadHint": "Available now: 0.2.3 Alpha · Windows x64 installer included",
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
        "Keep the session flowing",
        "Maps, dice, notes and combat share the same table."
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
    "experienceCopy": "Explore Moonfall Abbey, move tokens, measure distances, open campaign notes and follow the next turn. The recording shows the real VTT in use, with a brief example of an optional system sheet.",
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
    "sheetsCopy": "Bring a familiar PDF with the Gravewright PDF System, or choose a compatible system with its own sheets. Connect characters to tokens and keep their details within reach while you play.",
    "sheetOptions": [
      [
        "Your own PDF",
        "Bring a character sheet your group already uses, map its fields and connect the character to a token."
      ],
      [
        "System sheets",
        "Installed systems can provide their own character, creature and item sheets, with the rules and automations they support."
      ]
    ],
    "releaseLabel": "The latest Alpha",
    "releaseTitle": "Your next session starts with 0.2.3 Alpha.",
    "releaseCopy": "Gravewright 0.2.3 Alpha improves native card decks, extension customization and window translations. Prepare your campaign and choose independent systems with their own sheets and automation.",
    "releaseFeatures": [
      [
        "Find what the session needs",
        "Keep characters, items, journals and compendiums close to the table. Search campaign content and drag supported documents where you need them."
      ],
      [
        "Keep your preferred sheet",
        "Use mapped PDFs or dedicated system sheets. Installed systems define their own fields, calculations and saving behavior."
      ],
      [
        "Follow the next turn",
        "Track initiative and turns beside the scene. Installed systems can add their own resources, effects and combat rules."
      ],
      [
        "Choose your table’s language",
        "Translator 0.1.2 offers Portuguese and Spanish interface catalogs. Each player keeps their own language preference."
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
    "extensionsLabel": "A universal table, shaped by you",
    "extensionsTitle": "Your system. Your tools. Your way to play.",
    "extensionsCopy": "Gravewright provides the tabletop. Independent systems bring game-specific sheets and rules; modules add tools such as translations and 3D dice. Use a compatible system or mapped PDFs for your group’s game, and build your own extensions through the documented API.",
    "systemLabel": "Optional system example · Available in the Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.1",
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
    "systemNote": "Partial SRD collections; compendium content is in English. Version 0.1.1 works on VTT 0.2.3. Install one package from Systems: sheets, compendiums and combat automation stay together. The GM advances combat from the table.",
    "systemAction": "Explore DnD 5e SRD",
    "systemDownload": "Get version 0.1.1",
    "swadeLabel": "Optional compatibility package · Available in the Marketplace",
    "swadeDetails": "Explore sheets, item templates and automation",
    "swadeCopy": "One system package brings free character and NPC sheets, 13 empty item templates and SWADE automation. Create your own campaign content and customize action decks and table settings.",
    "swadeFacts": [
      ["13", "Empty item templates"],
      ["3", "Action-deck styles"],
      ["en / pt-BR / es", "Interface languages"]
    ],
    "swadeNote": "No compendiums or rulebook text are included. Version 0.1.1 works on Gravewright 0.2.3. Install the single package from Systems and select it for your table. The GM runs its combat automation from the table. English is built in; Portuguese and Spanish use the official Translator module.",
    "swadeAction": "Explore the SWADE package",
    "swadeDownload": "Get version 0.1.1",
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
        "Players join a shared server through their browser. The Windows Runner starts locally; use the hosting guide to make your installation available to your group."
      ],
      [
        "Can I use the interface in Portuguese or Spanish?",
        "Install Translator from the Marketplace and activate its languages. Each user can choose English, Brazilian Portuguese or Spanish. Documents and text written by your group keep their original language."
      ],
      [
        "Where are my campaigns stored?",
        "Your campaigns stay on your host. The default Windows installation stores the database and uploaded media in the application folder; you can configure other locations. Stop the Runner and back up the database, media, configuration and installed extensions before an upgrade."
      ],
      [
        "Is 0.2.3 available to download?",
        "Yes. Gravewright 0.2.3 Alpha is available now with the Windows installer. Systems and modules are installed separately. Keep backups of important campaigns and read the release notes before upgrading."
      ],
      [
        "Can I play with DnD 5e SRD?",
        "Yes. On VTT 0.2.3, install DnD 5e SRD 0.1.1 from Systems and select it for your table. One package includes dedicated sheets, combat automation and partial licensed SRD collections. Choose the 2014 or 2024 rules profile. The GM advances combat from the table. Other D&D books and official artwork are not included."
      ],
      [
        "How do I install the Savage Worlds compatibility package?",
        "On VTT 0.2.3, install version 0.1.1 from Systems and select it when creating your table. Sheets, item templates, assets and automation belong to that one system package. The GM advances combat from the table; no separate rules module is required."
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
    "systemDetails": "See this optional system in action"
  },
  "pt": {
    "lang": "pt-BR",
    "file": "pt-br.html",
    "otherFile": "index.html",
    "otherLabel": "English",
    "docs": "pt-BR",
    "suffix": ".pt-BR",
    "title": "Gravewright — Um VTT Universal para RPGs",
    "description": "Um VTT universal, gratuito e open source para suas campanhas de RPG. Reúna mapas, tokens, dados, diários e ambientação e escolha seus sistemas e módulos.",
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
    "eyebrow": "VTT universal · Gratuito e open source · Alpha",
    "lead": "Seu mundo. Seu grupo. Sua próxima grande sessão.",
    "intro": "Uma mesa virtual universal para os mundos que você cria. Reúna mapas, tokens, dados e anotações, hospede sua mesa e escolha os sistemas e ferramentas que combinam com o grupo.",
    "download": "Baixar Gravewright para Windows",
    "explore": "Veja o Gravewright em ação",
    "notes": "Versão disponível",
    "documentation": "Documentação",
    "downloadHint": "Disponível agora: 0.2.3 Alpha · Instalador Windows x64 incluído",
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
        "Mantenha o ritmo da sessão",
        "Mapas, dados, anotações e combate dividem a mesma mesa."
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
    "experienceCopy": "Explore Moonfall Abbey, mova tokens, meça distâncias, abra anotações da campanha e acompanhe o próximo turno. A gravação mostra o VTT real em uso, com um breve exemplo de ficha de um sistema opcional.",
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
    "sheetsCopy": "Traga um PDF conhecido com o Gravewright PDF System ou escolha um sistema compatível com fichas próprias. Vincule os personagens aos tokens e tenha seus detalhes à mão durante a sessão.",
    "sheetOptions": [
      [
        "Seu próprio PDF",
        "Traga a ficha que o grupo já usa, mapeie os campos e vincule o personagem a um token."
      ],
      [
        "Fichas do sistema",
        "Os sistemas instalados podem oferecer fichas próprias de personagens, criaturas e itens, com as regras e automações compatíveis."
      ]
    ],
    "releaseLabel": "A nova Alpha",
    "releaseTitle": "Sua próxima sessão começa com a 0.2.3 Alpha.",
    "releaseCopy": "O Gravewright 0.2.3 Alpha aprimora os baralhos nativos, a personalização de extensões e a tradução das janelas. Prepare sua campanha e escolha sistemas independentes com suas próprias fichas e automações.",
    "releaseFeatures": [
      [
        "Encontre o que a sessão precisa",
        "Tenha personagens, itens, diários e compêndios por perto. Pesquise o conteúdo da campanha e arraste documentos compatíveis para onde precisar."
      ],
      [
        "Use sua ficha preferida",
        "Escolha PDFs mapeados ou fichas próprias de um sistema. Os sistemas instalados definem seus campos, cálculos e comportamento de salvamento."
      ],
      [
        "Acompanhe o próximo turno",
        "Controle iniciativa e turnos ao lado da cena. Os sistemas instalados podem acrescentar recursos, efeitos e regras próprias de combate."
      ],
      [
        "Escolha o idioma da mesa",
        "O Translator 0.1.2 oferece catálogos da interface em português e espanhol. Cada jogador mantém sua preferência de idioma."
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
    "extensionsLabel": "Uma mesa universal, feita por você",
    "extensionsTitle": "Seu sistema. Suas ferramentas. Sua forma de jogar.",
    "extensionsCopy": "O Gravewright oferece a mesa virtual. Sistemas independentes trazem fichas e regras de cada jogo; módulos acrescentam ferramentas como traduções e dados 3D. Use um sistema compatível ou PDFs mapeados para o jogo do grupo e crie suas extensões com a API documentada.",
    "systemLabel": "Exemplo de sistema opcional · Disponível no Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.1",
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
    "systemNote": "Coleções parciais do SRD; o conteúdo dos compêndios está em inglês. A versão 0.1.1 funciona no VTT 0.2.3. Instale um único pacote em Sistemas: fichas, compêndios e automações de combate ficam juntos. O mestre avança o combate pela mesa.",
    "systemAction": "Conheça o DnD 5e SRD",
    "systemDownload": "Baixar a versão 0.1.1",
    "swadeLabel": "Pacote de compatibilidade opcional · Disponível no Marketplace",
    "swadeDetails": "Conheça as fichas, os modelos de itens e as automações",
    "swadeCopy": "Um único pacote de sistema reúne fichas gratuitas de personagens e NPCs, 13 modelos vazios de itens e automações de SWADE. Crie o conteúdo da sua campanha e personalize os baralhos de ação e as opções da mesa.",
    "swadeFacts": [
      ["13", "Modelos vazios de itens"],
      ["3", "Estilos de baralho de ação"],
      ["en / pt-BR / es", "Idiomas da interface"]
    ],
    "swadeNote": "O pacote não inclui compêndios nem textos do livro. A versão 0.1.1 funciona no Gravewright 0.2.3. Instale o pacote único em Sistemas e selecione-o para a mesa. O mestre conduz as automações de combate pela mesa. Inglês está disponível por padrão; português e espanhol usam o módulo oficial Translator.",
    "swadeAction": "Conheça o pacote SWADE",
    "swadeDownload": "Baixar a versão 0.1.1",
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
        "Os jogadores acessam um servidor compartilhado pelo navegador. O Runner Windows inicia localmente; siga o guia de hospedagem para disponibilizar sua instalação ao grupo."
      ],
      [
        "Posso usar a interface em português ou espanhol?",
        "Instale o Translator pelo Marketplace e ative seus idiomas. Cada usuário pode escolher inglês, português brasileiro ou espanhol. Documentos e textos escritos pelo grupo mantêm o idioma original."
      ],
      [
        "Onde ficam minhas campanhas?",
        "As campanhas ficam no seu host. A instalação Windows padrão guarda o banco de dados e a mídia enviada na pasta do aplicativo; você pode configurar outros locais. Encerre o Runner e faça backup do banco, da mídia, das configurações e das extensões instaladas antes de atualizar."
      ],
      [
        "A 0.2.3 já está disponível para baixar?",
        "Sim. O Gravewright 0.2.3 Alpha já está disponível com o instalador Windows. Sistemas e módulos são instalados separadamente. Mantenha backups das campanhas importantes e leia as notas antes de atualizar."
      ],
      [
        "Posso jogar com o DnD 5e SRD?",
        "Sim. No VTT 0.2.3, instale DnD 5e SRD 0.1.1 em Sistemas e selecione-o para sua mesa. Um único pacote reúne fichas próprias, automações de combate e coleções parciais licenciadas do SRD. Escolha as regras de 2014 ou 2024. O mestre avança o combate pela mesa. Outros livros de D&D e artes oficiais não estão incluídos."
      ],
      [
        "Como instalo o pacote de compatibilidade Savage Worlds?",
        "No VTT 0.2.3, instale a versão 0.1.1 em Sistemas e selecione-a ao criar sua mesa. Fichas, modelos de itens, arquivos e automações pertencem a esse único pacote de sistema. O mestre avança o combate pela mesa; não há módulo separado de regras."
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
    "systemDetails": "Veja este sistema opcional em uso"
  }
};

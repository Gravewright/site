// Product copy and public download identity shared by both pages.
// Update publicVersion only after the VTT release and its ZIP are published.
export const project = 'https://github.com/Gravewright/gravewright';
export const publicVersion = '0.2.1';
export const release = `${project}/releases/tag/v${publicVersion}`;
export const download = `${project}/releases/download/v${publicVersion}/Gravewright-${publicVersion}-django.zip`;
export const dndProject = 'https://github.com/Gravewright/dnd-srd-5e';
export const dndRelease = `${dndProject}/releases/tag/v0.1.0`;
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
      "What’s new",
      "Get started",
      "Community"
    ],
    "eyebrow": "Your RPG table · Free and open source · Alpha",
    "lead": "Your world. Your players. Your next great session.",
    "intro": "Bring your maps, character sheets, dice and campaign notes to one table. Host Gravewright yourself, invite your group through the browser and keep the adventure moving.",
    "download": "Get Gravewright for Windows",
    "explore": "See Gravewright in action",
    "notes": "Available release",
    "documentation": "Documentation",
    "downloadHint": "Available now: 0.2.1 Alpha · Windows x64 installer included",
    "systemHint": "Also available: DnD 5e SRD 0.1.0 Alpha · 2014 and 2024 rules",
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
    "aboutLabel": "Built around your campaign",
    "aboutTitle": "Less time between the tools and the story.",
    "aboutCopy": "Prepare the places your players will explore. Keep their characters and discoveries at hand. Return next session with your campaign ready to continue.",
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
    "experienceCopy": "See the current Alpha at work: a map and its tokens, a DnD 5e SRD sheet, an item dragged from the compendium, combat and campaign notes. These are real screens from Gravewright 0.2.1.",
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
    "sheetsCopy": "Play with the dedicated sheets of DnD 5e SRD, or bring your own PDF with the Gravewright PDF System. Connect characters to tokens and keep the details you need within reach.",
    "sheetOptions": [
      ["DnD 5e SRD", "Character, monster and item sheets with attributes, spells, equipment and resources. Changes save automatically; rolls go directly to chat."],
      ["Your own PDF", "Bring a character sheet your group already uses, map its fields and connect the character to a token. Keep your preferred sheet at the table."]
    ],
    "releaseLabel": "The latest Alpha",
    "releaseTitle": "Your next session starts with 0.2.1 Alpha.",
    "releaseCopy": "The new VTT release brings native item windows, compendium access and the foundations for system-owned combat. DnD 5e SRD 0.1.0 Alpha is now available separately in the Marketplace, with its own sheets and rules.",
    "releaseFeatures": [
      [
        "Bring the right item to the sheet",
        "Supported systems can place dragged compendium entries in the right collection. DnD 5e SRD handles weapons, spells, origins and more."
      ],
      [
        "Keep your changes",
        "DnD 5e SRD sheets save as you edit. Pending changes finish saving before the sheet closes, with visible errors when something needs attention."
      ],
      [
        "Stay with the encounter",
        "Follow turns, resources and supported effects in the combat tracker. Each installed system provides its own rules."
      ],
      [
        "Choose your table’s language",
        "Translator 0.1.2 offers reviewed Portuguese and Spanish interface catalogs. Each player keeps their own language preference."
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
    "extensionsCopy": "Choose your game system and add the modules that suit your group. Extensions bring their own sheets, content and tools to your Gravewright table.",
    "systemLabel": "Available in the Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.0 Alpha",
    "systemCopy": "Choose 2014 or 2024 rules. Drag licensed SRD equipment, spells, origins and classes into a dedicated character sheet. Review required choices, then keep playing with automatic saving and supported resource calculations.",
    "systemFacts": [["2,535", "SRD entries"], ["20", "Compendium packs"], ["2014 / 2024", "Selectable rules"]],
    "systemNote": "Partial SRD collections; compendium content is in English. Requires VTT 0.2.1+ and DnD 5e SRD Server Rules 0.1.0 for combat automation. Install both system packages from the Marketplace.",
    "systemAction": "Explore DnD 5e SRD",
    "systemDownload": "Get version 0.1.0",
    "extensionCards": [
      ["Translator", "0.1.2", "Choose English, Brazilian Portuguese or Spanish for your interface. The official translation API also serves compatible systems and modules.", "https://github.com/Gravewright/translator"],
      ["Gravewright 3D Dice", "0.1.1", "Bring physical 3D dice to supported rolls and choose your own dice colors, text and appearance.", "https://github.com/Gravewright/Gravewright-3D-Dice"]
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
        "Is 0.2.1 available to download?",
        "Yes. Gravewright 0.2.1 Alpha is available now with the Windows installer. DnD 5e SRD 0.1.0 Alpha is a separate Marketplace system. Keep backups of important campaigns and read the release notes before upgrading."
      ],
      [
        "Can I play with DnD 5e SRD?",
        "Yes. Install the system and its Server Rules companion from the Marketplace on VTT 0.2.1 or newer. Choose the 2014 or 2024 rules profile. It includes dedicated sheets and partial licensed SRD collections; it does not include every D&D book or official artwork."
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
    "intro": "Reúna mapas, fichas, dados e anotações da campanha em uma mesa. Hospede o Gravewright, convide o grupo pelo navegador e mantenha a aventura em movimento.",
    "download": "Baixar Gravewright para Windows",
    "explore": "Veja o Gravewright em ação",
    "notes": "Versão disponível",
    "documentation": "Documentação",
    "downloadHint": "Disponível agora: 0.2.1 Alpha · Instalador Windows x64 incluído",
    "systemHint": "Também disponível: DnD 5e SRD 0.1.0 Alpha · Regras de 2014 e 2024",
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
    "aboutLabel": "Pensado para sua campanha",
    "aboutTitle": "Menos distância entre as ferramentas e a história.",
    "aboutCopy": "Prepare os lugares que os jogadores vão explorar. Tenha os personagens e suas descobertas à mão. Na próxima sessão, sua campanha estará pronta para continuar.",
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
    "experienceCopy": "Veja a Alpha atual em uso: mapa e tokens, ficha do DnD 5e SRD, um item arrastado do compêndio, combate e anotações da campanha. São telas reais do Gravewright 0.2.1.",
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
    "sheetsCopy": "Jogue com as fichas próprias do DnD 5e SRD ou traga seu PDF com o Gravewright PDF System. Vincule os personagens aos tokens e tenha os detalhes da próxima decisão sempre à mão.",
    "sheetOptions": [
      ["DnD 5e SRD", "Fichas de personagens, monstros e itens com atributos, magias, equipamentos e recursos. As alterações são salvas automaticamente; as rolagens vão direto para o chat."],
      ["Seu próprio PDF", "Traga a ficha que seu grupo já usa, mapeie os campos e vincule o personagem a um token. Continue com sua ficha preferida dentro da mesa."]
    ],
    "releaseLabel": "A nova Alpha",
    "releaseTitle": "Sua próxima sessão começa com a 0.2.1 Alpha.",
    "releaseCopy": "A nova versão do VTT traz janelas nativas de itens, acesso a compêndios e a base para o combate de cada sistema. O DnD 5e SRD 0.1.0 Alpha já está disponível separadamente no Marketplace, com suas próprias fichas e regras.",
    "releaseFeatures": [
      [
        "Leve o item para a ficha",
        "Sistemas compatíveis colocam as entradas arrastadas dos compêndios no lugar certo. O DnD 5e SRD recebe armas, magias, origens e muito mais."
      ],
      [
        "Mantenha suas alterações",
        "As fichas do DnD 5e SRD salvam enquanto você edita. Alterações pendentes terminam de salvar antes de fechar a ficha, com erros visíveis quando algo precisa de atenção."
      ],
      [
        "Acompanhe o encontro",
        "Veja turnos, recursos e efeitos compatíveis no rastreador de combate. Cada sistema instalado fornece suas próprias regras."
      ],
      [
        "Escolha o idioma da mesa",
        "O Translator 0.1.2 oferece catálogos revisados de interface em português e espanhol. Cada jogador mantém sua própria preferência de idioma."
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
    "extensionsCopy": "Escolha o sistema do seu jogo e adicione os módulos que combinam com o grupo. As extensões trazem fichas, conteúdo e ferramentas próprias para sua mesa Gravewright.",
    "systemLabel": "Disponível no Marketplace",
    "systemTitle": "DnD 5e SRD",
    "systemVersion": "0.1.0 Alpha",
    "systemCopy": "Escolha as regras de 2014 ou 2024. Arraste equipamentos, magias, origens e classes do SRD licenciado para a ficha do personagem. Confira as escolhas necessárias e continue jogando com salvamento automático e os cálculos de recursos compatíveis.",
    "systemFacts": [["2.535", "Entradas do SRD"], ["20", "Compêndios"], ["2014 / 2024", "Regras à escolha"]],
    "systemNote": "Coleções parciais do SRD; o conteúdo dos compêndios está em inglês. Requer VTT 0.2.1+ e DnD 5e SRD Server Rules 0.1.0 para as automações de combate. Instale os dois pacotes do sistema pelo Marketplace.",
    "systemAction": "Conheça o DnD 5e SRD",
    "systemDownload": "Baixar a versão 0.1.0",
    "extensionCards": [
      ["Translator", "0.1.2", "Escolha inglês, português brasileiro ou espanhol para sua interface. A API oficial de tradução também atende sistemas e módulos compatíveis.", "https://github.com/Gravewright/translator"],
      ["Gravewright 3D Dice", "0.1.1", "Use dados físicos em 3D nas rolagens compatíveis e escolha as cores, os textos e a aparência dos seus dados.", "https://github.com/Gravewright/Gravewright-3D-Dice"]
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
        "A 0.2.1 já está disponível para baixar?",
        "Sim. O Gravewright 0.2.1 Alpha já está disponível com o instalador Windows. O DnD 5e SRD 0.1.0 Alpha é um sistema separado no Marketplace. Mantenha backups das campanhas importantes e leia as notas da versão antes de atualizar."
      ],
      [
        "Posso jogar com o DnD 5e SRD?",
        "Sim. Instale o sistema e o complemento Server Rules pelo Marketplace no VTT 0.2.1 ou mais recente. Escolha as regras de 2014 ou 2024. O pacote inclui fichas próprias e coleções parciais licenciadas do SRD; não inclui todos os livros de D&D nem artes oficiais."
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

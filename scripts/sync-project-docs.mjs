// Import a byte-for-byte public documentation snapshot. This explicit allowlist
// intentionally excludes proposal documents, release history and operator data.
// Re-run with: node scripts/sync-project-docs.mjs --source /path/to/gravewright
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const guides = [
  ['getting-started', 'Getting started', 'Primeiros passos', 'Installation, prerequisites, first launch and source checkout setup.', 'Instalação, pré-requisitos, primeira execução e preparação do código-fonte.'],
  ['architecture', 'Architecture', 'Arquitetura', 'Runtime boundaries, domain services, permissions and persistence.', 'Camadas de execução, serviços de domínio, permissões e persistência.'],
  ['code-map', 'Code map', 'Mapa do código', 'Find the files and domain responsible for each application workflow.', 'Encontre os arquivos e o domínio responsáveis por cada fluxo da aplicação.'],
  ['development', 'Development', 'Desenvolvimento', 'Development workflow, migrations, generated contracts and release preparation.', 'Fluxo de desenvolvimento, migrações, contratos gerados e preparação de releases.'],
  ['api', 'Public API reference', 'Referência da API pública', 'Python API, browser domain API, SDK operations, payloads and error contracts.', 'API Python, API de domínio do navegador, operações do SDK, payloads e erros.'],
  ['modules', 'Systems and modules', 'Sistemas e módulos', 'Installable packages, system declarations, browser lifecycle, signing and SDK contracts.', 'Pacotes instaláveis, declaração de sistemas, ciclo do navegador, assinatura e contratos do SDK.'],
  ['frontend', 'Frontend architecture', 'Arquitetura do frontend', 'Jinja2, Datastar, native JavaScript, PixiJS, styles and asset preparation.', 'Jinja2, Datastar, JavaScript nativo, PixiJS, estilos e preparação de assets.'],
  ['testing', 'Testing', 'Testes', 'Django, node:test, Playwright and native validation with disposable data.', 'Django, node:test, Playwright e validação nativa com dados descartáveis.'],
  ['configuration', 'Configuration', 'Configuração', 'Installation-local configuration, execution profiles and environment settings.', 'Configuração local à instalação, perfis de execução e variáveis de ambiente.'],
  ['deployment', 'Deployment', 'Implantação', 'Hosting, security, reverse proxies, backups and operational recovery.', 'Hospedagem, segurança, proxies reversos, backups e recuperação operacional.'],
  ['windows-runner', 'Windows installer and Runner', 'Instalador e Runner no Windows', 'Native Windows preparation, portable tools, startup and recovery.', 'Preparação nativa no Windows, ferramentas portáteis, execução e recuperação.'],
  ['linux-runner', 'Linux installer and Runner', 'Instalador e Runner no Linux', 'Native Linux preparation, portable tools, dependencies and platform limits.', 'Preparação nativa no Linux, ferramentas portáteis, dependências e limites da plataforma.'],
  ['macos-runner', 'macOS installer and Runner', 'Instalador e Runner no macOS', 'Native macOS preparation, portable tools, startup and platform support.', 'Preparação nativa no macOS, ferramentas portáteis, execução e plataformas suportadas.'],
  ['map-builder', 'Map Builder reference', 'Referência do Map Builder', 'Builder workflows, Smart Objects, automation, supported limits and developer contracts.', 'Fluxos do Builder, Smart Objects, automação, limites suportados e contratos de desenvolvimento.'],
  ['universal-vtt', 'Universal VTT import and export', 'Importação e exportação Universal VTT', 'Import/export workflows, coordinates, limits and authorization.', 'Fluxos de importação e exportação, coordenadas, limites e autorização.'],
  ['user-guide', 'Application workflow reference', 'Referência dos fluxos da aplicação', 'Complete project guide to campaign preparation and tabletop tools.', 'Guia completo do projeto para preparar campanhas e usar as ferramentas da mesa.'],
  ['campaign-management', 'Campaign management', 'Gestão de campanha', 'Native GM preparation, seven planning tools, archives and history outside the table.', 'Preparação nativa do mestre, sete ferramentas de planejamento, arquivos e histórico fora da mesa.'],
  ['journals', 'Journals and resource links', 'Diários e vínculos de recursos', 'Independent chapters, page access, campaign references and portable journal content.', 'Capítulos independentes, acesso às páginas, referências de campanha e conteúdo portátil dos diários.'],
  ['clocks', 'Progress clocks', 'Relógios de progresso', 'Shared segmented goals, permissions, pinned indicators and MapBuilder controls.', 'Objetivos compartilhados por segmentos, permissões, indicadores fixados e controles do MapBuilder.'],
  ['clues', 'Staged clues', 'Pistas por etapas', 'GM-authored discoveries, completed revelation and protected notes.', 'Descobertas preparadas pelo mestre, revelação concluída e notas protegidas.'],
  ['mindmaps', 'Mind maps', 'Mapas mentais', 'Collaborative topic graphs, authorized player editors and 37 typed resource links.', 'Grafos colaborativos, jogadores autorizados a editar e 37 tipos de vínculos de recursos.'],
  ['pdf-system', 'PDF System', 'PDF System', 'Manual PDF fields, token bars, roll actions, calculations, mapping libraries and export.', 'Campos manuais no PDF, barras do token, ações de rolagem, cálculos, biblioteca de modelos e exportação.'],
  ['upgrading', 'Upgrade and recovery', 'Atualização e recuperação', 'Three migrations for 0.3.3, compatible backups, manual replacement and recovery.', 'Três migrações para a 0.3.3, backups compatíveis, substituição manual e recuperação.'],
  ['ethical-module-porting', 'Ethical module porting', 'Portabilidade ética de módulos', 'Licenses, content rights and mapping an integration to the owning domains.', 'Licenças, direitos sobre conteúdo e integração com os domínios responsáveis.'],
];
const legal = [
  ['contributing', 'CONTRIBUTING.md', 'CONTRIBUTING.pt-BR.md', 'Contributing', 'Contribuição', 'Contribution conventions, licensing, review and validation requirements.', 'Convenções de contribuição, licenciamento, revisão e validação.'],
  ['licensing', 'LICENSING.md', 'LICENSING.pt-BR.md', 'Licensing', 'Licenciamento', 'Project licensing, independent module permission and third-party obligations.', 'Licenciamento do projeto, permissão para módulos independentes e obrigações de terceiros.'],
];

export async function syncProjectDocs(source) {
  const sourceRoot = resolve(source);
  await readFile(resolve(sourceRoot, 'manage.py'));
  // Trust only this explicitly selected checkout for these read-only commands;
  // do not write a global Git safe.directory entry on managed Windows hosts.
  const gitArgs = ['-c', `safe.directory=${sourceRoot.replaceAll('\\', '/')}`, '-C', sourceRoot];
  const sourceRevision = execFileSync('git', [...gitArgs, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const committed = path => execFileSync('git', [...gitArgs, 'show', `${sourceRevision}:${path}`], { maxBuffer: 8 * 1024 * 1024 });
  const project = committed('pyproject.toml').toString('utf8');
  const version = project.match(/^version\s*=\s*"([^"]+)"/m)?.[1];
  if (!version) throw new Error('The committed pyproject.toml has no project version.');
  const definitions = [
    ...guides.map(([slug, enTitle, ptTitle, enSummary, ptSummary]) => ({ slug, paths: [`docs/en/${slug}.md`, `docs/pt-BR/${slug}.md`], enTitle, ptTitle, enSummary, ptSummary })),
    ...legal.map(([slug, en, pt, enTitle, ptTitle, enSummary, ptSummary]) => ({ slug, paths: [en, pt], enTitle, ptTitle, enSummary, ptSummary })),
  ];
  // A missing/untracked document is an error, never permission to search data/.
  execFileSync('git', [...gitArgs, 'ls-files', '--error-unmatch', '--', ...definitions.flatMap(item => item.paths)], { stdio: 'pipe' });
  // Read the entire immutable revision before touching the destination. Pending
  // source edits cannot silently acquire the pinned commit's provenance.
  const snapshots = new Map(definitions.flatMap(item=>item.paths).map(path=>[path,committed(path)]));
  const articles = [];
  for (const item of definitions) {
    const translations = {};
    for (const [index, locale] of ['en', 'pt'].entries()) {
      const file = `content/reference/${locale}/${item.slug}.md`;
      const bytes = snapshots.get(item.paths[index]);
      await mkdir(dirname(resolve(root, file)), { recursive: true });
      await writeFile(resolve(root, file), bytes);
      translations[locale] = { title: item[`${locale}Title`], summary: item[`${locale}Summary`], file };
    }
    articles.push({ slug: item.slug, group: 'reference', sourcePaths: item.paths, ...translations });
  }
  const catalog = { sourceRevision, version, articles };
  await writeFile(resolve(root, 'content/reference/catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Synchronized ${articles.length} bilingual references from Gravewright ${version} (${sourceRevision.slice(0, 7)}).`);
  return catalog;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--source' || !args[1]) {
    console.error('Usage: node scripts/sync-project-docs.mjs --source /path/to/gravewright');
    process.exitCode = 1;
  } else {
    try { await syncProjectDocs(args[1]); }
    catch (error) { console.error(`Documentation sync failed: ${error.message}`); process.exitCode = 1; }
  }
}

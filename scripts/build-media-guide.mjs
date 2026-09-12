import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Keep the author-facing filenames and alt descriptions synchronized with the HTML.
export async function buildMediaGuide(root, media) {
  const briefs = {
    table: 'Capture a mesa da Alpha 0.1.0 com uma cena preparada, tokens e iluminação visível. Use conteúdo que possa compartilhar.',
    session: 'Edição de batalha de 51,1 segundos da gravação fornecida. A capa foi capturada em 00:05. Créditos da música estão no encerramento, na transcrição e nos avisos de terceiros.',
    sheet: 'Mostre uma ficha PDF que tenha permissão para redistribuir, com campos mapeados e o token correspondente visível.',
    campaign: 'Capture o painel da Alpha com campanhas fictícias, sem dados pessoais ou códigos de convite ativos.',
    runner: 'Grave de 45 a 90 segundos, do ZIP extraído à primeira tela de configuração. Acelere downloads, sinalize cortes e evite mostrar caminhos privados ou credenciais.'
  };
  for (const language of ['en', 'pt']) {
    const pt = language === 'pt';
    const lines = [
      '<!-- Generated from content/media.json by scripts/build-media-guide.mjs. -->',
      `# ${pt ? 'Imagens e vídeos do site' : 'Website images and videos'}`,
      '[English](MEDIA.md) · [Português (Brasil)](MEDIA.pt-BR.md)',
      pt ? 'Todos os caminhos abaixo são relativos a `/mnt/dados/grave-site`. As pastas `assets/images/` e `assets/videos/` já existem. Você fornecerá **3 imagens, 1 vídeo, 1 capa, 2 legendas e 2 transcrições**.' : 'All paths below are relative to the site directory. The `assets/images/` and `assets/videos/` folders already exist. Supply **3 images, 1 video, 1 poster, 2 caption files and 2 transcripts**.',
      pt ? '**Para substituir:** copie os arquivos com os nomes exatos, execute `npm run build` e atualize a página. Não é necessário editar HTML. O build mostra a mídia quando o arquivo existe e mantém o placeholder enquanto estiver ausente. Para trocar nomes ou textos alternativos, edite `content/media.json` e gere novamente.' : '**To replace:** copy files using the exact names, run `npm run build` and refresh. No HTML changes are needed. The build renders existing media and retains placeholders for missing files. To change filenames or alternative text, edit `content/media.json` and rebuild.',
      pt ? '**Importante:** os textos alternativos abaixo já estão preparados, mas precisam corresponder à mídia final. Revise-os se mudar o enquadramento ou a demonstração. Use capturas da versão atual, não da interface legacy.' : '**Important:** the alternative text below is prepared in advance and must match the final media. Revise it if the framing or demonstration changes. Capture the current version, not the legacy interface.'
    ];
    for (const item of media) {
      lines.push(`## ${item.title[language]}`,
        `- ${pt ? 'Arquivo' : 'File'}: \`${item.file}\``,
        `- ${pt ? 'Dimensões sugeridas' : 'Suggested dimensions'}: **${item.width} × ${item.height}**`,
        `- ${pt ? 'Descrição / alt em inglês' : 'English description / alt'}: ${item.alt.en}`,
        `- ${pt ? 'Descrição / alt em português' : 'Portuguese description / alt'}: ${item.alt.pt}`,
        `\n${pt ? briefs[item.id] : item.brief}`);
      if (item.type === 'video') {
        lines.push(`- ${pt ? 'Capa do vídeo' : 'Video poster'}: \`${item.poster}\` (${item.width} × ${item.height})`,
          `- ${pt ? 'Legendas em inglês' : 'English captions'}: \`${item.captions.en}\``,
          `- ${pt ? 'Legendas em português' : 'Portuguese captions'}: \`${item.captions.pt}\``,
          `- ${pt ? 'Transcrição em inglês' : 'English transcript'}: \`${item.transcripts.en}\``,
          `- ${pt ? 'Transcrição em português' : 'Portuguese transcript'}: \`${item.transcripts.pt}\``,
          pt ? '\nO vídeo usa `aria-label` e um título visível, pois `<video>` não aceita `alt` como uma imagem. Use a descrição acima para orientar a transcrição. A capa é exibida pelo player e compartilha o contexto acessível dele.' : '\nVideo uses an `aria-label` and visible title because `<video>` does not support image-style `alt`. Use the description above to guide the transcript. The poster appears inside the player and shares its accessible context.');
      }
    }
    lines.push(`## ${pt ? 'Formatos e acessibilidade' : 'Formats and accessibility'}`,
      pt ? '- Imagens e capas: WebP. Mantenha textos legíveis, proporção consistente e tamanho de arquivo razoável (idealmente até cerca de 600 KB por captura, sem prejudicar a leitura).\n- Vídeos: MP4 com H.264 e, se houver áudio, AAC; 1080p é suficiente. Use `faststart` ao exportar. O player não reproduz automaticamente e carrega o vídeo somente quando solicitado.\n- Legendas: WebVTT em UTF-8, nos dois idiomas, sincronizadas com a gravação final. Inclua falas e sons relevantes.\n- Transcrições: texto UTF-8 nos dois idiomas, com falas e descrição das ações visuais que são necessárias para compreender a demonstração.\n- Se não houver fala, descreva as ações nos textos e use legendas explicativas. Não deixe as legendas preenchidas com exemplos fictícios.' : '- Images and posters: WebP. Keep text legible, aspect ratios consistent and file sizes reasonable (ideally around 600 KB or less per screenshot without sacrificing readability).\n- Videos: MP4 with H.264 and AAC if audio is present; 1080p is sufficient. Enable `faststart` on export. Playback is not automatic and media uses `preload="none"`.\n- Captions: UTF-8 WebVTT in both languages, timed against the final recording. Include speech and relevant sounds.\n- Transcripts: UTF-8 text in both languages, including speech and visual actions needed to understand the demonstration.\n- For silent recordings, describe the actions in the text and explanatory captions. Do not leave fictional sample cues in the final caption files.',
      `### ${pt ? 'Estrutura de uma legenda' : 'Caption structure'}`,
      pt ? 'Exemplo de formato, não uma legenda pronta. Substitua texto e tempos pela gravação real:' : 'Format example, not a finished caption. Replace text and timing with the actual recording:',
      '```vtt\nWEBVTT\n\n00:00:00.000 --> 00:00:04.000\n' + (pt ? '[Descreva a ação ou transcreva a fala deste trecho.]' : '[Describe the action or transcribe the speech in this segment.]') + '\n```',
      `## ${pt ? 'Conferência final das mídias' : 'Final media check'}`,
      '```sh\nnpm run build\nnpm run check:media\n```',
      pt ? 'A segunda verificação retorna erro enquanto faltar algum arquivo planejado. Depois, abra as duas páginas, reproduza os vídeos, teste avançar no tempo, confira legendas/transcrições e verifique a leitura no celular. O comando confere presença e estrutura básica; a revisão do conteúdo e da sincronização é manual.' : 'The second check returns an error while any planned file is missing. Then open both pages, play and seek the videos, review captions/transcripts and check readability on mobile. The command checks presence and basic structure; content and timing need manual review.'
    );
    // Adjacent list items stay together; paragraphs and headings have normal Markdown spacing.
    const markdown = lines.map((line, index) =>
      (index ? (line.startsWith('- ') && lines[index - 1].startsWith('- ') ? '\n' : '\n\n') : '') + line
    ).join('');
    await writeFile(resolve(root, pt ? 'MEDIA.pt-BR.md' : 'MEDIA.md'), markdown + '\n');
  }
}

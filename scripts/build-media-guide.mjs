import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { publicVersion } from '../content/site.mjs';

// Keep the author-facing filenames and alt descriptions synchronized with the HTML.
export async function buildMediaGuide(root, media) {
  for (const language of ['en', 'pt']) {
    const pt = language === 'pt';
    const lines = [
      '<!-- Generated from content/media.json by scripts/build-media-guide.mjs. -->',
      `# ${pt ? 'Imagens e vídeos do site' : 'Website images and videos'}`,
      '[English](MEDIA.md) · [Português (Brasil)](MEDIA.pt-BR.md)',
      pt ? `Todos os caminhos abaixo são relativos à raiz deste repositório. Esta lista deriva de \`content/media.json\` e acompanha o Gravewright **${publicVersion} Alpha**. Dimensões, idiomas e duração devem corresponder aos arquivos finais.` : `All paths below are relative to this repository root. This list derives from \`content/media.json\` and accompanies Gravewright **${publicVersion} Alpha**. Dimensions, languages and duration must match the final files.`,
      pt ? '**Para substituir:** copie os arquivos com os nomes exatos, execute `npm run build` e atualize a página. Não é necessário editar HTML. O build mostra a mídia quando o arquivo existe e mantém o placeholder enquanto estiver ausente. Para trocar nomes ou textos alternativos, edite `content/media.json` e gere novamente.' : '**To replace:** copy files using the exact names, run `npm run build` and refresh. No HTML changes are needed. The build renders existing media and retains placeholders for missing files. To change filenames or alternative text, edit `content/media.json` and rebuild.',
      pt ? '**Importante:** os textos alternativos precisam corresponder à mídia final. Revise-os se mudar o enquadramento ou a demonstração. Use capturas reais da versão atual, com dados fictícios. Procedência, prompts e hashes das artes estão em [assets/demo/README.md](assets/demo/README.md); créditos e licenças em [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).' : '**Important:** alternative text must match the final media. Revise it if the framing or demonstration changes. Use real captures of the current version with fictional data. Artwork provenance, prompts and hashes are in [assets/demo/README.md](assets/demo/README.md); credits and licenses are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).'
    ];
    for (const item of media) {
      const brief = typeof item.brief === 'object' ? item.brief[language] || item.brief.en : item.brief;
      lines.push(`## ${item.title[language]}`,
        `- ${pt ? 'Arquivo padrão / alternativa' : 'Default / fallback file'}: \`${item.file}\``,
        ...Object.entries(item.files || {}).map(([locale, path]) => `- ${pt ? 'Arquivo por idioma' : 'Localized file'} (${locale === 'en' ? 'English' : 'Português (Brasil)'}): \`${path}\``),
        `- ${pt ? 'Dimensões' : 'Dimensions'}: **${item.width} × ${item.height}**`,
        `- ${pt ? 'Descrição / alt em inglês' : 'English description / alt'}: ${item.alt.en}`,
        `- ${pt ? 'Descrição / alt em português' : 'Portuguese description / alt'}: ${item.alt.pt}`,
        ...(Number.isFinite(item.durationSeconds) ? [`- ${pt ? 'Duração da edição final' : 'Final edit duration'}: **${item.durationSeconds} s**`] : []),
        ...(brief ? [`\n${brief}`] : []));
      if (item.type === 'video') {
        lines.push(`- ${pt ? 'Capa do vídeo' : 'Video poster'}: \`${item.poster}\``,
          `- ${pt ? 'Legendas em inglês' : 'English captions'}: \`${item.captions.en}\``,
          `- ${pt ? 'Legendas em português' : 'Portuguese captions'}: \`${item.captions.pt}\``,
          `- ${pt ? 'Transcrição em inglês' : 'English transcript'}: \`${item.transcripts.en}\``,
          `- ${pt ? 'Transcrição em português' : 'Portuguese transcript'}: \`${item.transcripts.pt}\``,
          pt ? '\nO vídeo usa `aria-label` e um título visível, pois `<video>` não aceita `alt` como uma imagem. Use a descrição acima para orientar a transcrição. A capa é exibida pelo player e compartilha o contexto acessível dele.' : '\nVideo uses an `aria-label` and visible title because `<video>` does not support image-style `alt`. Use the description above to guide the transcript. The poster appears inside the player and shares its accessible context.');
        if (item.music) lines.push(pt ? `\nTrilha: [${item.music.title} — ${item.music.artist}](${item.music.url}), [${item.music.license}](${item.music.licenseUrl}). Preserve os créditos no encerramento, nas transcrições e nos avisos de terceiros.` : `\nSoundtrack: [${item.music.title} — ${item.music.artist}](${item.music.url}), [${item.music.license}](${item.music.licenseUrl}). Preserve attribution in the end card, transcripts and third-party notices.`);
      }
    }
    lines.push(`## ${pt ? 'Formatos e acessibilidade' : 'Formats and accessibility'}`,
      pt ? '- Capturas de interface: WebP por idioma. Preserve os PNGs originais das artes e da capa ilustrada; a imagem social usa JPEG. Mantenha textos legíveis, proporção consistente e tamanho razoável por captura.\n- Vídeos: MP4 com H.264 e, se houver áudio, AAC; 1080p é suficiente. Use `faststart` ao exportar. O player não reproduz automaticamente e carrega o vídeo somente quando solicitado. Registre a duração final em `durationSeconds`.\n- Legendas: WebVTT em UTF-8, nos dois idiomas, sincronizadas com a gravação final. Inclua falas e sons relevantes.\n- Transcrições: texto UTF-8 nos dois idiomas, com falas e descrição das ações visuais necessárias para compreender a demonstração.\n- Se não houver fala, descreva as ações nos textos e use legendas explicativas. Não deixe exemplos fictícios nas legendas finais.' : '- Interface screenshots: localized WebP files. Preserve the original artwork and illustrated poster PNGs; the social image uses JPEG. Keep text legible, aspect ratios consistent and screenshot file sizes reasonable.\n- Videos: MP4 with H.264 and AAC if audio is present; 1080p is sufficient. Enable `faststart` on export. Playback is not automatic and media uses `preload="none"`. Record the final duration as `durationSeconds`.\n- Captions: UTF-8 WebVTT in both languages, timed against the final recording. Include speech and relevant sounds.\n- Transcripts: UTF-8 text in both languages, including speech and visual actions needed to understand the demonstration.\n- For silent recordings, describe the actions in text and explanatory captions. Do not leave fictional sample cues in the final caption files.',
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

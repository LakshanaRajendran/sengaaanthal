/**
 * SENGAANTHAL — Poem Pagination Utility
 *
 * Automatically splits long poems into multiple pages if they exceed single-page visual capacity,
 * preserving stanza coherence, preventing bottom overflow, and maintaining beautiful book aesthetics.
 */

export function paginatePoem(poem, maxLinesPerPage = 14) {
  if (!poem) return [];

  // Haikus always fit on a single page
  if (poem.type === 'haiku') {
    return [
      {
        ...poem,
        pageKey: String(poem.id),
        originalPoemId: poem.id,
        partIndex: 1,
        totalParts: 1,
        isFirstPart: true,
        isContinuation: false,
        content: Array.isArray(poem.content)
          ? poem.content
          : typeof poem.content === 'string'
            ? poem.content.split('\n')
            : []
      }
    ];
  }

  const rawLines = Array.isArray(poem.content)
    ? poem.content
    : typeof poem.content === 'string'
      ? poem.content.split('\n')
      : [];

  // If poem lines are few enough to fit comfortably on 1 page without bottom overflow
  if (rawLines.length <= maxLinesPerPage) {
    return [
      {
        ...poem,
        pageKey: String(poem.id),
        originalPoemId: poem.id,
        partIndex: 1,
        totalParts: 1,
        isFirstPart: true,
        isContinuation: false,
        content: rawLines
      }
    ];
  }

  // Calculate balanced number of pages so content distributes evenly with breathing room
  const numPages = Math.ceil(rawLines.length / 11);
  const targetPer = Math.ceil(rawLines.length / numPages);

  const pages = [];
  let cur = [];

  for (let i = 0; i < rawLines.length; i++) {
    cur.push(rawLines[i]);

    const isBlank = rawLines[i].trim() === '';
    const isLast = i === rawLines.length - 1;

    // Break at blank line if we reached targetPer lines, or hard limit
    if (!isLast && pages.length < numPages - 1) {
      if (cur.length >= targetPer && isBlank) {
        pages.push(cur);
        cur = [];
      } else if (cur.length >= targetPer + 3) {
        pages.push(cur);
        cur = [];
      }
    }
  }

  if (cur.length > 0) {
    pages.push(cur);
  }

  const totalParts = pages.length;

  return pages.map((pageLines, index) => {
    // Trim leading/trailing blank lines per page
    let s = 0;
    while (s < pageLines.length && pageLines[s].trim() === '') s++;
    let e = pageLines.length - 1;
    while (e >= s && pageLines[e].trim() === '') e--;

    const trimmed = pageLines.slice(s, e + 1);

    return {
      ...poem,
      pageKey: `${poem.id}_part_${index + 1}`,
      originalPoemId: poem.id,
      partIndex: index + 1,
      totalParts,
      isFirstPart: index === 0,
      isContinuation: index > 0,
      content: trimmed
    };
  });
}

/**
 * Source Map Helper Functions
 * Utility functions for JSX element extraction and source map processing
 */

/**
 * Check if source map position points to the previous element's ending line
 */
export function correctSourceMapPosition(lines, targetIndex, targetColumn) {
  const line = lines[targetIndex];
  if (!line) return { lineIndex: targetIndex, column: targetColumn };

  const trimmedLine = line.trim();
  const isOnlyClosingTag = /^<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(trimmedLine);
  const endsWithClosingTag = /<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(trimmedLine);

  let isAfterClosingTag = false;
  if (targetColumn != null) {
    const beforeTarget = line.substring(0, targetColumn);
    isAfterClosingTag = /<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(beforeTarget);
  }

  if (isOnlyClosingTag || endsWithClosingTag || isAfterClosingTag) {
    if (targetColumn != null) {
      const afterTarget = line.substring(targetColumn);
      const nextOpenMatch = afterTarget.match(/<([A-Za-z][A-Za-z0-9\-_.]*)/);
      if (nextOpenMatch && afterTarget[nextOpenMatch.index + 1] !== "/") {
        return {
          lineIndex: targetIndex,
          column: targetColumn + nextOpenMatch.index + 1,
        };
      }
    }

    for (let i = targetIndex + 1; i < lines.length && i < targetIndex + 50; i++) {
      const nextLine = lines[i];
      const openTagMatch = nextLine.match(/<([A-Za-z][A-Za-z0-9\-_.]*)/);
      if (openTagMatch && nextLine[openTagMatch.index + 1] !== "/") {
        return { lineIndex: i, column: openTagMatch.index + 1 };
      }
    }
  }

  return { lineIndex: targetIndex, column: targetColumn };
}

/**
 * Find the end of a tag (handles multi-line and JSX expressions)
 */
export function findTagEnd(lines, startLineIndex, startColumn) {
  let depth = 0;

  for (let i = startLineIndex; i < lines.length; i++) {
    const line = lines[i];
    const startCol = i === startLineIndex ? startColumn : 0;

    for (let j = startCol; j < line.length; j++) {
      const char = line[j];
      if (char === "{") depth++;
      else if (char === "}") depth--;
      else if (depth === 0) {
        if (char === "/" && line[j + 1] === ">") {
          return { lineIndex: i, columnEnd: j + 2, isSelfClosing: true };
        } else if (char === ">") {
          return { lineIndex: i, columnEnd: j + 1, isSelfClosing: false };
        }
      }
    }
  }

  return undefined;
}

/**
 * Find the closing tag for a given opening tag
 */
export function findClosingTag(lines, tagName, startLineIndex, startColumn) {
  let depth = 1;
  const openPattern = new RegExp(`<${tagName}(?=\\s|>|/>)`, "g");
  const closePattern = new RegExp(`</${tagName}\\s*>`, "g");

  for (let i = startLineIndex; i < lines.length; i++) {
    const searchStart = i === startLineIndex ? startColumn : 0;
    const searchLine = lines[i].substring(searchStart);

    const tokens = [];
    let match;
    openPattern.lastIndex = 0;
    while ((match = openPattern.exec(searchLine)) !== null) {
      const tagEnd = findTagEnd([searchLine], 0, match.index + match[0].length);
      if (tagEnd && !tagEnd.isSelfClosing) {
        tokens.push({
          type: "open",
          index: match.index,
          length: match[0].length,
        });
      }
    }

    closePattern.lastIndex = 0;
    while ((match = closePattern.exec(searchLine)) !== null) {
      tokens.push({
        type: "close",
        index: match.index,
        length: match[0].length,
      });
    }

    tokens.sort((a, b) => a.index - b.index);

    for (const token of tokens) {
      if (token.type === "open") depth++;
      else if (token.type === "close") {
        depth--;
        if (depth === 0) {
          return {
            lineIndex: i,
            columnEnd: searchStart + token.index + token.length,
          };
        }
      }
    }
  }

  return undefined;
}

/**
 * Find the innermost opening tag that contains the target position
 */
export function findOpeningTag(lines, targetLineIndex, targetColumn) {
  let bestMatch;

  for (let i = targetLineIndex; i >= 0; i--) {
    const line = lines[i];
    const tagRegex = /<([A-Za-z][A-Za-z0-9\-_.]*)/g;
    let match;

    while ((match = tagRegex.exec(line)) !== null) {
      const tagStart = match.index;
      const tagName = match[1];

      if (line[tagStart + 1] === "/") continue;

      const isAfterTagStart =
        i < targetLineIndex ||
        (i === targetLineIndex && tagStart <= (targetColumn ?? line.length));

      if (!isAfterTagStart) continue;

      const afterTagName = tagStart + match[0].length;
      const tagEndInfo = findTagEnd(lines, i, afterTagName);
      if (!tagEndInfo) continue;

      let closeLineIndex = i;
      let closeColumnEnd = tagEndInfo.columnEnd;

      if (!tagEndInfo.isSelfClosing) {
        const closeTagInfo = findClosingTag(
          lines,
          tagName,
          i,
          tagEndInfo.columnEnd
        );
        if (!closeTagInfo) continue;
        closeLineIndex = closeTagInfo.lineIndex;
        closeColumnEnd = closeTagInfo.columnEnd;
      }

      const isTargetWithin =
        (i < targetLineIndex ||
          (i === targetLineIndex &&
            tagStart <= (targetColumn ?? line.length))) &&
        (closeLineIndex > targetLineIndex ||
          (closeLineIndex === targetLineIndex &&
            closeColumnEnd >= (targetColumn ?? 0)));

      if (!isTargetWithin) continue;

      if (
        !bestMatch ||
        closeLineIndex - i < bestMatch.closeLineIndex - bestMatch.lineIndex ||
        (closeLineIndex - i ===
          bestMatch.closeLineIndex - bestMatch.lineIndex &&
          closeColumnEnd - tagStart <
            bestMatch.closeColumnEnd - bestMatch.columnStart)
      ) {
        bestMatch = {
          tagName,
          lineIndex: i,
          columnStart: tagStart,
          columnEnd: tagEndInfo.columnEnd,
          isSelfClosing: tagEndInfo.isSelfClosing,
          closeLineIndex,
          closeColumnEnd,
        };
      }
    }
  }

  return bestMatch;
}

/**
 * Find the next tag matching the expected tag name below the current position
 */
export function findNextMatchingTag(lines, startLineIndex, expectedTagName) {
  const tagPattern = new RegExp(`<(${expectedTagName})(?=\\s|>|/>)`, "i");

  for (let i = startLineIndex + 1; i < lines.length && i < startLineIndex + 50; i++) {
    const line = lines[i];
    const match = tagPattern.exec(line);

    if (match) {
      const tagStart = match.index;
      const tagName = match[1];

      const afterTagName = tagStart + match[0].length;
      const tagEndInfo = findTagEnd(lines, i, afterTagName);
      if (!tagEndInfo) continue;

      let closeLineIndex = i;
      let closeColumnEnd = tagEndInfo.columnEnd;

      if (!tagEndInfo.isSelfClosing) {
        const closeTagInfo = findClosingTag(
          lines,
          tagName,
          i,
          tagEndInfo.columnEnd
        );
        if (!closeTagInfo) continue;
        closeLineIndex = closeTagInfo.lineIndex;
        closeColumnEnd = closeTagInfo.columnEnd;
      }

      return {
        tagName,
        lineIndex: i,
        columnStart: tagStart,
        columnEnd: tagEndInfo.columnEnd,
        isSelfClosing: tagEndInfo.isSelfClosing,
        closeLineIndex,
        closeColumnEnd,
      };
    }
  }

  return undefined;
}

/**
 * Extract code from a range spanning multiple lines
 */
export function extractRange(lines, startLine, startCol, endLine, endCol) {
  if (startLine === endLine) {
    return lines[startLine].substring(startCol, endCol);
  }
  let result = lines[startLine].substring(startCol);
  for (let i = startLine + 1; i < endLine; i++) {
    result += "\n" + lines[i];
  }
  result += "\n" + lines[endLine].substring(0, endCol);
  return result;
}

/**
 * Extract source code context
 */
export function extractSourceContext(sourceContent, errorLine, contextLines = 10) {
  const lines = sourceContent.split("\n");
  const startLine = Math.max(0, errorLine - contextLines - 1);
  const endLine = Math.min(lines.length - 1, errorLine + contextLines - 1);

  const contextArray = [];

  for (let i = startLine; i <= endLine; i++) {
    const lineNumber = i + 1;
    const isErrorLine = lineNumber === errorLine;
    const prefix = isErrorLine ? ">>>" : "   ";
    const formattedLine = `${prefix} ${lineNumber
      .toString()
      .padStart(4, " ")} | ${lines[i] || ""}`;
    contextArray.push(formattedLine);
  }

  return contextArray.join("\n");
}

/**
 * Load source map file
 */
export async function loadSourceMap(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load source map: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn("Error loading source map from", url, errorMessage);
  }
}
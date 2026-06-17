/**
 * React remark formatter — converts plain-text remarks from the bank
 * data layer into JSX elements.
 *
 * Conventions:
 *   **bold**            → <b>bold</b>
 *   [text](url)         → <LocalLink href={url}>text</LocalLink>
 *   literal newlines    → <br/>
 *
 * For simple single-line text with no formatting, the raw string is
 * returned as-is.  Multi-line or formatted text is returned as a React
 * fragment (no wrapping <p>).
 */

import { type ReactElement } from "react";
import { LocalLink } from "../Components/LocalLink";

/**
 * Parse remark text into React elements.
 *
 * @param text - Plain text from BankData.remarks
 * @returns A string (for simple text) or a React fragment with formatting.
 */
export function formatRemarks(text: string): string | ReactElement {
  // Quick path: single line, no special formatting — return raw string
  if (!text.includes("\n") && !text.includes("**") && !text.includes("[")) {
    return text;
  }

  // Tokenizer: match **bold**, [text](url), or plain text
  const tokenRe = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  const nodes: (string | ReactElement)[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = tokenRe.exec(text)) !== null) {
    // Push any plain text before this token
    if (m.index > lastIdx) {
      nodes.push(text.slice(lastIdx, m.index));
    }

    if (m[1] !== undefined) {
      // **bold**
      nodes.push(<b key={nodes.length}>{m[2]}</b>);
    } else if (m[3] !== undefined) {
      // [text](url)
      nodes.push(
        <LocalLink key={nodes.length} href={m[5]}>
          {m[4]}
        </LocalLink>,
      );
    }

    lastIdx = m.index + m[0].length;
  }

  // Remaining plain text after last token
  if (lastIdx < text.length) {
    nodes.push(text.slice(lastIdx));
  }

  // Flatten: if a plain text node contains \n, split it into text + <br/>
  const flattened: (string | ReactElement)[] = [];
  for (const node of nodes) {
    if (typeof node === "string" && node.includes("\n")) {
      const parts = node.split("\n");
      parts.forEach((part, i) => {
        if (i > 0) flattened.push(<br key={`br-${flattened.length}`} />);
        if (part) flattened.push(part);
      });
    } else {
      flattened.push(node);
    }
  }

  return <>{flattened}</>;
}
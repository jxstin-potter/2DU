import type { CSSProperties } from 'react';
import type { Tag } from '../types';

export const TAG_MENTION_DATA_ATTR = 'data-tag-id';
export const TAG_PENDING_NAME_ATTR = 'data-tag-pending-name';

/** Default colors for newly created tags (same as Tags page) */
export const TAG_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#f44336', '#9c27b0', '#009688'];

/** Light yellow background for inline tag mentions */
export const tagMentionStyle: CSSProperties = {
  backgroundColor: 'rgba(255, 235, 59, 0.35)',
  borderRadius: '4px',
  padding: '0 2px',
};

/** Get (node, offset) at a given character index within a container (counts text only) */
function getNodeAndOffsetAtCharIndex(
  container: Node,
  targetIndex: number
): { node: Node; offset: number } | null {
  let currentIndex = 0;
  const walk = (node: Node): { node: Node; offset: number } | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent ?? '').length;
      if (currentIndex + len >= targetIndex) {
        return { node, offset: targetIndex - currentIndex };
      }
      currentIndex += len;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        const result = walk(node.childNodes[i]);
        if (result) return result;
      }
    }
    return null;
  };
  return walk(container);
}

/** Get the word before the caret (e.g. "@Hi" or "Buy") and a range spanning that word for replacement */
export function getWordBeforeCaret(container: HTMLElement): { word: string; range: Range } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  const selRange = sel.getRangeAt(0);
  if (!container.contains(selRange.commonAncestorContainer)) return null;
  const range = document.createRange();
  range.setStart(container, 0);
  range.setEnd(selRange.endContainer, selRange.endOffset);
  const textBefore = range.toString();
  const words = textBefore.split(/\s/);
  const word = words[words.length - 1] ?? '';
  const wordStartCharIndex = Math.max(0, textBefore.length - word.length);
  const startPos = getNodeAndOffsetAtCharIndex(container, wordStartCharIndex);
  if (!startPos) return { word, range };
  range.setStart(startPos.node, startPos.offset);
  return { word, range };
}

/** Extract plain text from title div (skip tag spans and pending-tag spans) */
export function getPlainTitleFromTitleDiv(container: HTMLElement | null): string {
  if (!container) return '';
  let text = '';
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.getAttribute(TAG_MENTION_DATA_ATTR) || el.getAttribute(TAG_PENDING_NAME_ATTR)) return;
      node.childNodes.forEach(walk);
    }
  };
  container.childNodes.forEach(walk);
  return text.trim();
}

/** Collect tag ids from tag spans in title div (dedupe) */
export function getTagIdsFromTitleDiv(container: HTMLElement | null): string[] {
  if (!container) return [];
  const ids: string[] = [];
  const spans = container.querySelectorAll(`[${TAG_MENTION_DATA_ATTR}]`);
  spans.forEach((el) => {
    const id = el.getAttribute(TAG_MENTION_DATA_ATTR);
    if (id && !ids.includes(id)) ids.push(id);
  });
  return ids;
}

/** Collect pending tag names from title div (to create on submit) */
export function getPendingTagNamesFromTitleDiv(container: HTMLElement | null): string[] {
  if (!container) return [];
  const names: string[] = [];
  const spans = container.querySelectorAll(`[${TAG_PENDING_NAME_ATTR}]`);
  spans.forEach((el) => {
    const name = el.getAttribute(TAG_PENDING_NAME_ATTR);
    if (name && name.trim() && !names.includes(name.trim())) names.push(name.trim());
  });
  return names;
}

/** Create a tag mention span for insertion into contenteditable */
export function createTagMentionSpan(tag: Tag): HTMLSpanElement {
  const span = document.createElement('span');
  span.contentEditable = 'false';
  span.setAttribute(TAG_MENTION_DATA_ATTR, tag.id);
  span.textContent = `@${tag.name}`;
  Object.assign(span.style, tagMentionStyle);
  span.setAttribute('data-tag-mention', '1');
  return span;
}

/** Create a pending tag span (name only; tag is created on submit) */
export function createPendingTagSpan(pendingName: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.contentEditable = 'false';
  span.setAttribute(TAG_PENDING_NAME_ATTR, pendingName.trim());
  span.textContent = `@${pendingName.trim()}`;
  Object.assign(span.style, tagMentionStyle);
  span.setAttribute('data-tag-mention', '1');
  return span;
}

import { Task } from '../types';

/**
 * Parse time from natural language text and return the time and cleaned text
 * Supports formats like "3pm", "3 pm", "at 3pm", "3:00pm", "3am", etc.
 * @param text - The text to parse
 * @returns Object with time (Date for today at parsed time, or null) and cleanedText
 */
export const parseTimeFromText = (text: string): { time: Date | null; cleanedText: string; matchInfo?: { start: number; end: number; text: string } } => {
  // Regex pattern matches: "at 3pm", "3pm", "3 pm", "3:00pm", "3:00 pm", "at 3:30pm", "Trash 3pm", etc.
  // Pattern breakdown:
  // - (?:^|\s) - start of string or whitespace (captured for removal)
  // - (?:at\s+)? - optional "at" followed by spaces
  // - (\d{1,2}) - hour (1-2 digits)
  // - (?::(\d{2}))? - optional colon and minutes
  // - \s* - optional whitespace
  // - (am|pm) - am or pm
  // - \b - word boundary
  // Note: "at" is optional - just typing "3pm" or "Trash 3pm" works fine
  const timePattern = /(?:^|\s)(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/gi;
  
  const match = timePattern.exec(text);

  if (!match) {
    return { time: null, cleanedText: text };
  }
  
  // Store match info for highlighting
  const matchStart = match.index!;
  const matchEnd = matchStart + match[0].length;
  const matchText = match[0].trim();
  
  const hour = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toLowerCase();

  // Validate hour and minutes
  if (hour < 1 || hour > 12 || minutes < 0 || minutes > 59) {
    return { time: null, cleanedText: text };
  }
  
  // Convert to 24-hour format
  let hour24 = hour;
  if (period === 'pm' && hour !== 12) {
    hour24 = hour + 12;
  } else if (period === 'am' && hour === 12) {
    hour24 = 0;
  }

  // Create date for today at the parsed time
  const today = new Date();
  const time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour24, minutes, 0);

  // Keep the original text - don't remove the time expression
  // Like Todoist, we keep "3pm" visible in the input but parse and set the time
  // The time text stays in the title so users can see what they typed
  const cleanedText = text;

  return { 
    time, 
    cleanedText,
    matchInfo: {
      start: matchStart,
      end: matchEnd,
      text: matchText
    }
  };
};

/** Minimum gap between order ranks; below this triggers rebalance */
export const ORDER_EPSILON = 0.5;

/**
 * Get effective order for a task (used for manual sort). Missing order treated as 0.
 */
export const getOrder = (task: Pick<Task, 'order'>): number => task.order ?? 0;

/**
 * Compute new order rank when moving a task between two neighbors (fractional indexing).
 * Updates only the moved task; avoids O(n) writes per drag.
 * @param before - Task immediately above the drop position (undefined = moving to top)
 * @param after - Task immediately below the drop position (undefined = moving to bottom)
 * @returns New order value for the moved task
 */
export function computeNewOrder(before?: Pick<Task, 'order'>, after?: Pick<Task, 'order'>): number {
  const orderBefore = before !== undefined ? getOrder(before) : undefined;
  const orderAfter = after !== undefined ? getOrder(after) : undefined;

  if (orderBefore === undefined && orderAfter !== undefined) {
    return orderAfter - 1;
  }
  if (orderBefore !== undefined && orderAfter === undefined) {
    return orderBefore + 1;
  }
  if (orderBefore !== undefined && orderAfter !== undefined) {
    return (orderBefore + orderAfter) / 2;
  }
  return 0;
}


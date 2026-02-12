import { addDays, endOfMonth, format, isBefore, isSameDay, startOfDay } from 'date-fns';
import type { Task } from '../types';

export type UpcomingSelection = {
  key: string; // YYYY-MM-DD
  kind: 'day';
  title: string;
  date: Date;
  anchorId: string;
  tasks: Task[];
};

export type BuildUpcomingSelectionOptions = {
  /** Month used as a baseline for the visible range (defaults to "through end of month"). */
  focusedMonth: Date;
  /** First day to include in the upcoming sections (date-only). */
  startDate: Date;
  /** When true, include empty days in the output (useful for calendar UIs). */
  includeEmptyDays?: boolean;
};

function toDayKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

function getDayTitle(day: Date, today: Date): string {
  const base = format(day, 'MMM d');
  if (isSameDay(day, today)) return `${base} ‧ Today ‧ ${format(day, 'EEEE')}`;
  return `${base} ‧ ${format(day, 'EEEE')}`;
}

function normalizeToDay(dateLike: Date): Date {
  return startOfDay(new Date(dateLike));
}

function isActiveTaskWithDueDate(task: Task): task is Task & { dueDate: Date } {
  return task.completed !== true && task.dueDate != null;
}

/**
 * Build the "Upcoming" sections for a list of tasks.
 *
 * Day sections include active tasks due on/after startDate, grouped by day.
 * Overdue tasks (due before startDate) are not shown in Upcoming.
 *
 * The returned list is ordered by day ascending.
 */
export function buildUpcomingSelections(
  tasks: Task[],
  options: BuildUpcomingSelectionOptions
): UpcomingSelection[] {
  const today = startOfDay(new Date());
  const start = normalizeToDay(options.startDate);

  const activeDueTasks = tasks.filter(isActiveTaskWithDueDate);

  // Overdue section removed: only show tasks from startDate (today) onward.

  // Base range: start -> end of focused month
  let end = normalizeToDay(endOfMonth(options.focusedMonth));

  // Extend the end range if there are tasks beyond end-of-month (so we don't hide tasks).
  for (const t of activeDueTasks) {
    const d = normalizeToDay(t.dueDate as Date);
    if (d.getTime() > end.getTime()) end = d;
  }

  const byDayKey = new Map<string, Task[]>();
  for (const t of activeDueTasks) {
    const day = normalizeToDay(t.dueDate as Date);
    if (isBefore(day, start)) continue;
    const key = toDayKey(day);
    const existing = byDayKey.get(key);
    if (existing) existing.push(t);
    else byDayKey.set(key, [t]);
  }

  const selections: UpcomingSelection[] = [];

  // Day sections (ascending)
  for (let day = start; day.getTime() <= end.getTime(); day = addDays(day, 1)) {
    const key = toDayKey(day);
    const dayTasks = byDayKey.get(key) ?? [];
    if (dayTasks.length === 0 && !options.includeEmptyDays) continue;

    dayTasks.sort((a, b) => {
      const aTime = normalizeToDay(a.dueDate as Date).getTime();
      const bTime = normalizeToDay(b.dueDate as Date).getTime();
      if (aTime !== bTime) return aTime - bTime;
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    });

    selections.push({
      key,
      kind: 'day',
      title: getDayTitle(day, today),
      date: day,
      anchorId: `selection-${key}`,
      tasks: dayTasks,
    });
  }

  return selections;
}
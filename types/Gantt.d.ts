import { Lang } from "./Lang"
import { TaskCollection } from "./Task"

export class GanttChart {
  constructor(element?: HTMLElement);
  widthHeader(width: string): this;
  element(element: HTMLElement): this;
  tasks(tasks: TaskCollection): this;
  period(start: Date, end: Date): this;
  todayTo(days: number): this;
  withWeekDays(): this;
  withMonthDay(): this;
  withYearMonths(): this;
  withTime(): this;
  showHeaders(isActive: boolean): this;
  i18n(translations: Lang): this;
  render(): void;
}

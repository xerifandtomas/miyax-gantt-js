import { Lang } from "./Lang";
import { TaskCollection } from "./Task";

export class GanttChart {
    constructor(element?: HTMLElement);
    widthHeader(width: string): this;
    element(element: HTMLElement): this;
    task(tasks: TaskCollection): this;
    period(start: Date, end: Date): this;
    withWeekDays(): this;
    withMonthDay(): this;
    i18n(translations: Lang): this;
    render(): void;
}

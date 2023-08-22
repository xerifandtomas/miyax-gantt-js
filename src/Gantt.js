import { calculateDays, addDays, DAYS_OF_WEEK_ARRAY, MONTHS_OF_YEAR_ARRAY } from "./Utils.js"
import translate from "./lang/en.js"

export class GanttChart {
  __translations = translate
  __widthHeader = '150px'
  __element
  __tasks = []
  __startGanttChart
  __endGanttChart
  __showPeriodDays = 0
  __isActiveWeekDays = false
  __isActiveMonthDays = false
  __isActiveYearMonths = true
  __template = ''

  TYPE_CELL = {
    task: "gantt-chart__row-cell--task",
    header: "gantt-chart__row-cell--header",
    weekend: "gantt-chart__row-cell--day-of-weekend",
    day: "gantt-chart__row-cell--day",
    month: "gantt-chart__row-cell--month",
  }


  constructor(element = null) {
    if (element) {
      this.element(element)
    }
  }

  widthHeader(width) {
    this.__widthHeader = width
    return this
  }

  element(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Element must be HTMLElement')
    }

    this.__element = element
    return this
  }

  tasks(tasks) {
    this.__tasks = tasks
    return this
  }

  period(start, end) {
    if (!(start instanceof Date) || !(end instanceof Date)) {
      throw new Error('Start and end must be Date')
    }
    if (start > end) {
      throw new Error('Start must be less than end')
    }

    this.__startGanttChart = start;
    this.__endGanttChart = end;
    this.__showPeriodDays = calculateDays(start, end)
    return this
  }

  withWeekDays() {
    this.__isActiveWeekDays = true
    return this
  }

  withMonthDay() {
    this.__isActiveMonthDays = true
    return this
  }

  i18n(translations) {
    this.__translations = Object.assign({}, translate, translations)
    this.__translations.daysOfWeek = Object.assign({}, translate.daysOfWeek, translations.daysOfWeek)
    this.__translations.monthsOfYear = Object.assign({}, translate.monthsOfYear, translations.monthsOfYear)
    return this
  }

  render() {
    this.__template = ''
    this.__generateHeader()
    this.__generateTaskRow()
    this.__renderContainer()

    this.__addListeners()
  }

  __renderContainer() {
    const template = `
      <div class="gantt-chart__container" style="grid-template-columns: ${this.__widthHeader} repeat(${this.__showPeriodDays}, 1fr)">
        ${this.__template}
      </div>`

    const contentFragment = document
      .createRange()
      .createContextualFragment(template)
    this.__element.innerHTML = ''
    this.__element.appendChild(contentFragment)
  }

  __addListeners() {
    const cells = this.__element.querySelectorAll('.gantt-chart__row-cell--task')
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const event = this.__getCustomEvent(e.target.dataset.id, 'selected')
        e.target.dispatchEvent(event)
      })
    })
  }

  __getCustomEvent(taskId, eventName) {
    const currentTask = this.__tasks.find((task) => task.id === taskId)
    return new CustomEvent(eventName, { bubbles: true, detail: structuredClone(currentTask) })
  }

  __createCellTemplate(start, end, text, type, color) {
    const bgColor = color ? `background: linear-gradient(90deg, ${color}33 0%, ${color} 100%);` : ""
    return `
          <div
            class="gantt-chart__row-cell ${this.TYPE_CELL[type]}"
            style="grid-column: ${start + 2} / ${end + 2}; ${bgColor};"
          >
            <span>
              ${text}
            </span>
          </div>`
  }

  __createCellTaskTemplate(id, start, end, text, type, color, isDraggable = false) {
    const bgColor = color ? `background: linear-gradient(90deg, ${color}99 0%, ${color} 100%);` : ""
    return `
          <div
            data-id="${id}"
            class="gantt-chart__row-cell ${this.TYPE_CELL[type]}"
            style="grid-column: ${start + 2} / ${end + 2};"
            draggable="${isDraggable}"
          >
          <span
            style="${bgColor}"
            data-id="${id}"
          >
            ${text}
            </span>
          </div>`
  }

  __createRowTemplate(cells, quantity) {
    const length = quantity ? quantity : cells.length - 1
    return cells.join("")
  }

  __addToTemplate(template) {
    this.__template += template
  }

  __generateTaskRow() {
    this.__tasks.forEach((task) => {
      const taskDuration = calculateDays(task.start, task.end)
      const rows = [this.__createCellTemplate(-1, 0, task.name, "header", task.color)]

      for (let i = 0; i < this.__showPeriodDays; i++) {
        const currentDate = addDays(this.__startGanttChart, i)
        if (task.start <= currentDate && task.end >= currentDate) {
          const text = task.description ? task.description : `${taskDuration}d`
          const cell = this.__createCellTaskTemplate(task.id, i, i + taskDuration, text, "task", task.color, true)
          rows.push(cell)
          i += taskDuration - 1
          continue
        }

        const type = currentDate.getDay() === 0 || currentDate.getDay() === 6 ? "weekend" : "day"
        const cell = this.__createCellTemplate(i, i, '', type)
        rows.push(cell)
      }

      const template = this.__createRowTemplate(rows, this.__showPeriodDays)
      this.__addToTemplate(template)
    })
  }

  __generateHeader() {
    if (!this.__isActiveWeekDays && !this.__isActiveMonthDays && !this.__isActiveYearMonths) return

    const dayOfMonthCells = [this.__createCellTemplate(-1, 0, this.__translations['daysTile'], "header")]
    const dayOfWeekCells = [this.__createCellTemplate(-1, 0, this.__translations['dayOfweekTile'], "header")]
    const monthCells = [this.__createCellTemplate(-1, 0, this.__translations['monthsTile'], "header")]
    const countDaysMonths = {}
    const months = []
    let lastMonth = null
    for (let i = 0; i < this.__showPeriodDays; i++) {
      const currentDate = addDays(this.__startGanttChart, i)

      const type = currentDate.getDay() === 0 || currentDate.getDay() === 6 ? "weekend" : "day"
      const dayCell = this.__createCellTemplate(i, i, currentDate.getDate(), type)
      dayOfMonthCells.push(dayCell)

      const day = this.__translations.daysOfWeek[DAYS_OF_WEEK_ARRAY[currentDate.getDay()]]
      const dayOfWeekCell = this.__createCellTemplate(i, i, day, type)
      dayOfWeekCells.push(dayOfWeekCell)

      const month = MONTHS_OF_YEAR_ARRAY[currentDate.getMonth()]
      countDaysMonths[month] ??= 0
      countDaysMonths[month]++

      if (lastMonth !== month) {
        months.push(month)
      }
      lastMonth = month
    }

    let i = 0
    months.forEach((month) => {
      if (countDaysMonths[month]) {
        const monthName = this.__translations.monthsOfYear[month]
        const monthCellTemplate = this.__createCellTemplate(i, i + countDaysMonths[month], monthName, "month")
        monthCells.push(monthCellTemplate)
        i += countDaysMonths[month]
      }
    })

    console.log('countDaysMonths', countDaysMonths)
    const template = `
          ${this.__isActiveYearMonths ? this.__createRowTemplate(monthCells, this.__showPeriodDays) : ''}
          ${this.__isActiveMonthDays ? this.__createRowTemplate(dayOfMonthCells) : ''}
          ${this.__isActiveWeekDays ? this.__createRowTemplate(dayOfWeekCells) : ''}
          `
    this.__addToTemplate(template)
  }
}
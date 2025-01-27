import { calculateDays, addDays, DAYS_OF_WEEK_ARRAY, MONTHS_OF_YEAR_ARRAY, carculateColorTextFromColorBackground } from './Utils.js'
import translate from '../lang/en.js'

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
  __isActiveYearMonths = false
  __isActiveHeaders = true
  __isActiveTime = false
  __template = ''
  __currentColumn = 1
  __currentRow = 1

  TYPE_CELL = {
    header: 'gjs__cell-header',
    headertask: 'gjs__cell-header-task',
    day: 'gjs__row-cell--day',
    today: 'gjs__row-cell--day gjs__cell-today',
    weekend: 'gjs__row-cell--day gjs__cell-weekend',
    month: 'gjs__cell-month',
    task: 'gjs__cell-task',
    time: 'gjs__row-cell--time',
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
    this.__tasks = tasks.map((task) => {
      if (!(task.start instanceof Date) || !(task.end instanceof Date)) {
        throw new Error('Start and end must be Date')
      }
      if (task.start > task.end) {
        throw new Error('Start must be less than end')
      }
      return {
        ...task,
        start: new Date(task.start.setHours(0, 0, 0, 0)),
        end: new Date(task.end.setHours(0, 0, 0, 0)),
      }
    })
    return this
  }

  period(start, end) {
    if (!(start instanceof Date) || !(end instanceof Date)) {
      throw new Error('Start and end must be Date')
    }
    if (start > end) {
      throw new Error('Start must be less than end')
    }

    this.__startGanttChart = new Date(start.setHours(0, 0, 0, 0))
    this.__endGanttChart = new Date(end.setHours(0, 0, 0, 0))
    this.__showPeriodDays = calculateDays(start, end)
    return this
  }

  todayTo(days) {
    if (days < 0) {
      throw new Error('Days must be positive')
    }

    const today = new Date()
    const end = addDays(today, days)
    this.period(today, end)
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

  withYearMonths() {
    this.__isActiveYearMonths = true
    return this
  }

  withTime() {
    this.__isActiveTime = true
    return this
  }

  showHeaders(isActive) {
    this.__isActiveHeaders = isActive
    return this
  }

  i18n(translations) {
    this.__translations = Object.assign({}, translate, translations)
    this.__translations.daysOfWeek = Object.assign({}, translate.daysOfWeek, translations.daysOfWeek)
    this.__translations.monthsOfYear = Object.assign({}, translate.monthsOfYear, translations.monthsOfYear)
    return this
  }

  render() {
    this.__resetTemplate()
    this.__generateTimes()
    this.__generateTaskRow()
    this.__renderContainer()

    this.__addListeners()
  }

  __resetTemplate() {
    this.__template = ''
    this.__currentRow = 1
    this.__currentColumn = 1
  }

  __renderContainer() {
    const gridTemplateColumns = [
      this.__isActiveHeaders ? this.__widthHeader : '',
      `repeat(${this.__showPeriodDays}, 1fr)`,
    ]
    const template = `
      <div class="gjs__container"style="grid-template-columns: ${gridTemplateColumns.join(' ')}">
        ${this.__template}
      </div>`

    const contentFragment = document
      .createRange()
      .createContextualFragment(template)
    this.__element.innerHTML = ''
    this.__element.appendChild(contentFragment)
  }

  __addListeners() {
    const cells = this.__element.querySelectorAll('.gjs__cell-task')
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

  __getWidthColumns() {
    let width = this.__showPeriodDays
    if (this.__isActiveHeaders) width++
    if (this.__isActiveTime) width++
    return width
  }

  __getMatrixArea(width, height = 1) {
    const startColumn = this.__currentColumn
    const endColumn = this.__currentColumn + width
    const startRow = this.__currentRow
    const endRow = this.__currentRow + height

    this.__currentColumn = endColumn
    if (this.__currentColumn > this.__getWidthColumns()) {
      this.__currentColumn = 1
      this.__currentRow = endRow
    }

    return { startColumn, endColumn, startRow, endRow }
  }

  __createCellTemplateMatrix(length, text, type, color, id) {
    const { startColumn, endColumn, startRow, endRow } = this.__getMatrixArea(length, 1)
    const bgColor = color ? `background: linear-gradient(90deg, ${color}75 0%, ${color} 100%);` : ''
    const textColor = color ? `color: ${carculateColorTextFromColorBackground(color)};` : ''
    const dataId = id ? `data-id="${id}"` : ''
    const typeClass = this.TYPE_CELL[type] ?? ''

    const template = `
          <div
            ${dataId}
            class="gjs__row-cell ${typeClass}"
            style="
            grid-column: ${startColumn} / ${endColumn};
            grid-row: ${startRow} / ${endRow};
            ${bgColor}
            ${textColor}
            "
          >
            <span
              ${dataId}
            >
              ${text}
            </span>
          </div>`

    this.__template += template
  }

  __generateTaskRow() {
    this.__tasks.forEach((task) => {
      const taskDuration = calculateDays(task.start, task.end)
      const rows = []
      if (this.__isActiveHeaders) {
        const cell = { quantity: 1, text: task.name, type: 'headertask', color: task.color, id: task.id }
        rows.push(cell)
      }

      if (this.__isActiveTime) {
        const timeCells = { quantity: 1, text: `${taskDuration}d`, type: 'time', id: task.id }
        rows.push(timeCells)
      }

      for (let i = 0; i < this.__showPeriodDays; i++) {
        const currentDate = addDays(this.__startGanttChart, i)
        if (task.start <= currentDate && task.end >= currentDate) {
          const text = task.description ? task.description : `${taskDuration}d`
          const taskDurationShow = calculateDays(currentDate, task.end)
          const cell = { quantity: taskDurationShow, text, type: 'task', color: task.color, id: task.id }
          rows.push(cell)
          i += taskDurationShow - 1
          continue
        }

        const typeClass = this.__getClassTypeDay(currentDate)
        const cell = { quantity: 1, text: '', type: typeClass }
        rows.push(cell)
      }

      rows
        .map(row => this.__createCellTemplateMatrix(row.quantity, row.text, row.type, row.color, row.id))
    })
  }

  __generateTimes() {
    if (!this.__isActiveWeekDays && !this.__isActiveMonthDays && !this.__isActiveYearMonths) return

    const dayOfMonthCells = []
    const dayOfWeekCells = []
    const monthCells = []
    if (this.__isActiveHeaders) {
      dayOfMonthCells.push({ quantity: 1, text: this.__translations.daysTitle, type: 'header' })
      dayOfWeekCells.push({ quantity: 1, text: this.__translations.dayOfweekTitle, type: 'header' })
      monthCells.push({ quantity: 1, text: this.__translations.monthsTitle, type: 'header' })
    }

    if (this.__isActiveTime) {
      const timeColumn = { quantity: 1, text: '', type: null }
      dayOfMonthCells.push(timeColumn)
      dayOfWeekCells.push(timeColumn)
      monthCells.push(timeColumn)
    }

    const months = []
    for (let i = 0; i < this.__showPeriodDays; i++) {
      const currentDate = addDays(this.__startGanttChart, i)
      const typeClass = this.__getClassTypeDay(currentDate)

      dayOfMonthCells.push({ quantity: 1, text: currentDate.getDate(), type: typeClass })

      const day = this.__translations.daysOfWeek[DAYS_OF_WEEK_ARRAY[currentDate.getDay()]]
      dayOfWeekCells.push({ quantity: 1, text: day, type: typeClass })

      const month = MONTHS_OF_YEAR_ARRAY[currentDate.getMonth()]
      if (months[months.length - 1]?.name !== month) {
        months.push({ name: month, quantity: 0, year: currentDate.getFullYear() })
      }
      months[months.length - 1].quantity++
    }

    months.forEach((month) => {
      const monthName = `${this.__translations.monthsOfYear[month.name]} ${month.year}`
      monthCells.push({ quantity: month.quantity, text: monthName, type: 'month' })
    })

    if (this.__isActiveYearMonths) {
      monthCells.map(row => this.__createCellTemplateMatrix(row.quantity, row.text, row.type))
    }
    if (this.__isActiveMonthDays) {
      dayOfMonthCells.map(row => this.__createCellTemplateMatrix(row.quantity, row.text, row.type))
    }
    if (this.__isActiveWeekDays) {
      dayOfWeekCells.map(row => this.__createCellTemplateMatrix(row.quantity, row.text, row.type))
    }
  }

  __getClassTypeDay(day) {
    const isToday = day.toDateString() === new Date().toDateString()
    if (isToday) return 'today'

    const type = day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : 'day'
    return type
  }
}

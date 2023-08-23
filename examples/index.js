import { GanttChart, ES } from '../src/index.js'

const tasks = [
  {
    id: '1',
    name: '¡¡Hola mundo!!',
    start: new Date('2023/08/1'),
    end: new Date('2023/08/10'),
    color: '#88CC88',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
  },
  {
    id: '2',
    name: 'Hello world!!',
    start: new Date('2023/08/05'),
    end: new Date('2023/08/15'),
    color: '#CC8888',
  },
  {
    id: '3',
    name: 'Super tarea',
    start: new Date('2023/08/10'),
    end: new Date('2023/08/12'),
    color: '#8888CC',
  },
  {
    id: '4',
    name: 'Super task',
    start: new Date('2023/08/11'),
    end: new Date('2023/08/15 '),
    color: '#8888CC',
  },
  {
    id: '5',
    name: 'One year task',
    start: new Date('2023/08/11'),
    end: new Date('2024/08/10 '),
    color: '#8888CC',
  },
]

const ganttChartId = document.querySelectorAll('#gantt-chart-id')[0]
const startGanttChart = new Date('2023/08/01')
const endGanttChart = new Date('2023/08/15')

const gantt = new GanttChart()
gantt
  .widthHeader('350px')
  .i18n(ES)
  .tasks(tasks)
  .element(ganttChartId)
  .period(startGanttChart, endGanttChart)
  .withWeekDays()
  .withMonthDay()
  .withYearMonths()
  .withTime()
  // .disableHeaders()
  .render()

const btn = document.querySelectorAll('#form-date')[0]

btn.addEventListener('submit', (e) => {
  e.preventDefault()

  // @ts-ignore
  const startValue = document.getElementById('start')?.value
  // @ts-ignore
  const endValue = document.getElementById('end')?.value

  const start = new Date(startValue)
  const end = new Date(endValue)

  console.log(start, end)
  gantt
    .period(start, end)
    .render()
})

// @ts-ignore
ganttChartId.addEventListener('selected', (e) => console.log(e.detail))

const btnToggleHeaders = document.querySelectorAll('#toggle-headers')[0]
let isActiveHeaders = true

btnToggleHeaders.addEventListener('click', (e) => {
  e.preventDefault()

  isActiveHeaders = !isActiveHeaders
  gantt
    .showHeaders(isActiveHeaders)
    .render()
})

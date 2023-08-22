# Miyax Gantt Chart

An open source gantt chart for the web

## Installation

TODO

## Usage

Create a html element
```html
<div id="gantt-chart"></div>
```

```javascript
import { GanttChart } from 'miyax-gantt-chart'

// Define the tasks
const tasks = [
    {
    id: "1",
    name: "Hello world!!",
    start: new Date("2023/08/09"),
    end: new Date("2023/08/15"),
    color: "#CC8888",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  }
]

// Define the element
const ganttChartHtmlElement = document.getElementById("gantt-chart")

// Define the period
const startGanttChart = new Date("2023/08/01")
const endGanttChart = new Date("2023/08/10")

// Create a new gantt chart
const gantt = new GanttChart() // or new GanttChart(ganttChartHtmlElement)

// Basic
gantt
  .element(ganttChartHtmlElement) // set the element
  .period(startGanttChart, endGanttChart) // show the period from 2023/08/01 to 2023/08/31
  .task(tasks) // add the tasks
  .render() // render the gantt chart



// Full options
gantt
  .element(ganttChartHtmlElement) // set the element
  .period(startGanttChart, endGanttChart) // show the period from 2023/08/01 to 2023/08/31
  .task(tasks) // add the tasks
  .widthHeader('350px') // set the width of the header
  .withWeekDays() // show the week days
  .withMonthDay() // show the month day
  .render() // render the gantt chart


// Update the gantt chart
const newTask = {
  id: "2",
  name: "¡¡Hola mundo!!",
  start: new Date("2023/08/09"),
  end: new Date("2023/08/15"),
  color: "#88CC88",
}
tasks.push(newTask)

gantt
  .task(tasks) // add the tasks
  .period(new Date("2023/08/01"), new Date("2023/08/31")) // show the period from 2023/08/01 to 2023/08/31
  .render() // update the gantt chart
```

Events
```javascript
// Selected task
ganttChartId.addEventListener("selected", (e) => console.log('Task selected', e.detail))
```

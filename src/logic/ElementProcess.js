import TaskTable from './TaskTable';
import {
  placeWrappedTaskDepend,
  wrapPeriodTimes,
} from '../helpers/elementprocess';

export default class ElementProcess {
  constructor(options) {
    let {
      taskCreateButton,
      taskFormSelector,
      taskController,
      pomodoroTimes,
      pomodoroTimesWrapper,
      periodNames,
      shortBreakSound,
      longBreakSound,
      taskdata,
    } = options;
    this.data = taskdata;
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$taskFormAddButton = this.$taskForm.querySelector('button');
    this.$taskCreateButton = document.querySelector(taskCreateButton);
    this.$taskController = document.querySelector(taskController);
    this.$timerEl = '';
    this.$pomodoroTimes = document.querySelector(pomodoroTimes);
    this.currentPomodoroTimes = {};
    this.$pomodoroTimesWrapper = document.querySelector(pomodoroTimesWrapper);
    this.$periodNamesElementId = periodNames;
    this.$periodNamesElement = null;
    this.currentPeriodNames = {};
    this.shortBreakSound = document.querySelector(shortBreakSound);
    this.longBreakSound = document.querySelector(longBreakSound);
    this.TaskTable = new TaskTable(taskdata);
  }
  elementSwitcherForCurrentInfo($element, isFromTimerRender = false) {
    this.$periodNamesElement = this.$periodNamesElement
      ? this.$periodNamesElement
      : document.querySelector(this.$periodNamesElementId);
    if (this.$periodNamesElement) {
      this.$periodNamesElement.remove();
    }
    if (!isFromTimerRender) {
      const timer = document.querySelector('#timer');
      if (timer) {
        timer.remove();
      }
    }
    this.$pomodoroTimesWrapper.insertBefore(
      $element,
      // we have 3 element for and need centralize
      this.$pomodoroTimesWrapper.childNodes[2]
    );
  }

  timerRender() {
    let timer = document.createElement('div');
    timer.classList.add('row');
    timer.classList.add('col-md-6');
    timer.classList.add('bg-info');
    timer.classList.add('mx-auto');
    timer.id = 'timer';
    this.elementSwitcherForCurrentInfo(timer, true);
    timer.innerHTML = `<div class="col-md-12 text-center text-break">
            <label class="col-form-label task-title fw-bold">${this.currentPomodoroTimes.title} Ready For START!</label>
          </div>`;
    this.$timerEl = document.querySelector('#timer');
  }
  timerRenderingWhileRuningCurrentTask(timerLiveInfo) {
    const {
      minutes,
      seconds,
      currentTask,
      repeatedCycle,
      timerElContent,
    } = timerLiveInfo;
    return `<div class="col-md-12">
            <h4 class="col-form-label task-time text-center fw-bold">${minutes}:${seconds}</h4>
          </div>
          <div class="col-md-12 text-center">
            <label class="col-form-label task-title fw-bold text-break">${
              currentTask.title
            }</label>
          </div>
          <div class="col-md-12 text-center bg-secondary bg-gradient rounded">
            <label class="col-form-label task-title fw-bold text-break">${timerElContent}</label>
          </div>
          <div class="col-md-12">
            <label class="col-form-label task-period fw-bold text-break">${repeatedCycle}.PERIOD : ${
      currentTask.periods['period' + repeatedCycle]
        ? currentTask.periods['period' + repeatedCycle]
        : 'Working..'
    }</label>
          </div>`;
  }
  afterAddTaskRenderPeriodNamesInput() {
    this.$periodNamesElement = this.$periodNamesElement
      ? this.$periodNamesElement
      : document.querySelector(this.$periodNamesElementId);
    if (this.$periodNamesElement) {
      this.$periodNamesElement.remove();
    }
    this.$pomodoroTimes.remove();
    const { cycles } = this.currentPomodoroTimes;
    let currentPeriods = '';
    for (let i = 0; i < cycles; i++) {
      currentPeriods += wrapPeriodTimes(i + 1);
    }
    this.$pomodoroTimesWrapper.innerHTML = placeWrappedTaskDepend(
      currentPeriods
    );
    this.$taskCreateButton.disabled = false;
    window.location.href = `#${this.$taskCreateButton.id}`;
  }
  renderTimeInfo(timerElContent) {
    this.$timerEl.innerHTML = timerElContent;
  }
}

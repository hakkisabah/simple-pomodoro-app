import { addTaskToApi } from './data';
import TimeLogic from './logic/TimeLogic';
import ElementProcess from './logic/ElementProcess';
import ListenerHandler from './logic/ListenerHandler';
import { endMessage } from './helpers/elementprocess';

class PomodoroApp extends ElementProcess {
  constructor(options) {
    super(options);
    this.TimeLogic = new TimeLogic(this);
    // All listeners here
    this.ListenerHandler = new ListenerHandler(this);
  }

  addTaskToTable(task) {
    this.currentPomodoroTimes = task;
    // extended from ElementProcess
    this.TaskTable.addTask(task);
    this.data.push(task);
  }

  addTask(task) {
    addTaskToApi(task)
      // line turn on while remote work
      // .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
      });
  }

  startTask() {
    this.TimeLogic.initializeTimer();
  }

  handleEnd() {
    clearInterval(this.TimeLogic.currentInterval);
    this.renderTimeInfo('All tasks are done');
    this.end();
  }

  setTask() {
    if (this.currentPomodoroTimes) {
      this.startTask();
    } else {
      this.handleEnd();
    }
  }

  continueTask() {
    const remainingDeadline = this.TimeLogic.getRemaining();
    this.TimeLogic[this.TimeLogic.lastTimer](remainingDeadline);
  }

  start() {
    // check if continues to current task or start a new task.
    if (this.TimeLogic.currentRemaining) {
      this.continueTask();
    } else {
      this.setTask();
    }
  }

  pause() {
    clearInterval(this.TimeLogic.currentInterval);
  }

  end(message = '') {
    const tasktTitle = this.currentPomodoroTimes.title;
    clearInterval(this.TimeLogic.currentInterval);
    this.TimeLogic.currentRemaining = null;
    this.TimeLogic.lastTimer = null;
    this.TimeLogic.repeatedCycle = 1;
    this.$taskFormAddButton.disabled = false;
    this.$taskFormInput.disabled = false;
    const modalFullScreenTrigger = document.getElementById(
      'modalFullScreenTrigger'
    );
    this.$periodNamesElement = null;
    modalFullScreenTrigger.disabled = false;
    this.$taskController.style.display = 'none';
    this.$taskFormAddButton.disabled = true;
    this.elementSwitcherForCurrentInfo(this.$pomodoroTimes);
    this.currentPomodoroTimes = {};
    endMessage(
      `${
        message === ''
          ? tasktTitle + ' has been ended'
          : tasktTitle + ' ' + message
      }`
    );
    // Reinitialization
    this.ListenerHandler.handleAddTaskForm();
    this.ListenerHandler.handlePomodoroTimes();
    this.ListenerHandler.tableListenerForAction();
  }

  init() {
    this.ListenerHandler.handleAddTaskForm();
    this.ListenerHandler.handlePomodoroTimes();
    this.ListenerHandler.handleCreateButton();
    this.ListenerHandler.handleTaskController();
    this.ListenerHandler.tableListenerForAction();
  }
}

export default PomodoroApp;

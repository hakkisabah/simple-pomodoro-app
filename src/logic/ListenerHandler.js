import { deleteTaskToApi } from '../data';
import { fillTaskScreen } from '../helpers/tasktable';
import { escape_HTML } from '../helpers/elementprocess';
export default class ListenerHandler {
  constructor(appInstance) {
    this.app = appInstance;
  }

  handlePomodoroTimes() {
    const { $pomodoroTimes, currentPomodoroTimes } = this.app;
    for (let i = 0; i < $pomodoroTimes.length; i++) {
      currentPomodoroTimes[$pomodoroTimes.elements[i].name] =
        $pomodoroTimes.elements[i].value;
    }
    $pomodoroTimes.addEventListener('keyup', (e) => {
      // If input value return not NaN then available equality for time
      if (parseInt(e.target.value) == e.target.value) {
        if (e.target.value >= 1) {
          currentPomodoroTimes[e.target.name] = e.target.value;
        } else {
          e.target.value = currentPomodoroTimes[e.target.name];
        }
      }
    });
  }
  handlePeriodNames() {
    this.app.$periodNamesElement = this.app.$periodNamesElement
      ? this.app.$periodNamesElement
      : document.querySelector(this.app.$periodNamesElementId);
    const inputs = this.app.$periodNamesElement.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].name) {
        this.app.currentPeriodNames[
          inputs[i].name
        ] = `${inputs[i].name} work...`;
      }
    }
    this.app.$periodNamesElement.addEventListener('keyup', (e) => {
      if (e.target.name) {
        this.app.currentPeriodNames[e.target.name] = e.target.value;
      }
    });
  }
  handleCreateButton() {
    this.app.$taskCreateButton.addEventListener('click', (e) => {
      const task = {
        ...this.app.currentPomodoroTimes,
        periods: this.app.currentPeriodNames,
      };
      this.app.currentPomodoroTimes = task;
      this.app.addTask(task);
      this.app.$taskFormInput.value = '';
      this.app.$taskFormInput.disabled = true;
      this.app.$taskFormAddButton.textContent = 'Add Task';
      this.app.$taskFormAddButton.disabled = true;
      const modalFullScreenTrigger = document.getElementById(
        'modalFullScreenTrigger'
      );
      this.app.$periodNamesElement = null;
      modalFullScreenTrigger.disabled = true;
      this.app.timerRender();
      this.app.$taskController.style.display = 'block';
      e.target.style.display = 'none';
    });
  }

  handleTaskController() {
    this.app.$taskController.addEventListener('click', (e) => {
      if (e.target.id && e.target.id !== 'task-controller') {
        this.app[e.target.id]();
      }
    });
  }
  handleAddTaskForm() {
    this.app.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.app.currentPomodoroTimes.title = escape_HTML(
        this.app.$taskFormInput.value
      );
      this.app.currentPomodoroTimes.completed = 'NO';
      this.app.$taskFormAddButton.textContent = 'Edit Title';
      this.app.afterAddTaskRenderPeriodNamesInput();
      this.handlePeriodNames();
      this.app.$taskCreateButton.style.display = 'block';
    });

    this.app.$taskFormInput.addEventListener('keyup', (e) => {
      this.app.$taskFormInput.value = e.target.value;
      // While entering data, only spaces and a space more than 1 character between
      // words are not accepted.
      this.app.$taskFormInput.value.replace(/\s+/g, ' ').trim();
      if (this.app.$taskFormInput.value.length > 0) {
        this.app.$taskFormAddButton.disabled = false;
      } else {
        this.app.$taskFormAddButton.disabled = true;
      }
    });
  }

  tableListenerForAction() {
    // Wait task table loading with window load for avoiding async load
    window.addEventListener('load', () => {
      // DataTables initialization dynamically
      const $taskBody = document.querySelector('#task_table tbody');
      const { app } = this;
      $taskBody.addEventListener('click', function (e) {
        const requestedRow = e.target.parentElement;
        // delete task
        if (e.target.classList.value == 'delete-icon') {
          const idNoForClickedAction =
            requestedRow.parentElement.firstChild.firstChild.textContent;
          $('#task_table').DataTable().row(requestedRow).remove().draw(false);
          app.data.filter((el, index) => {
            if (el.id == idNoForClickedAction) {
              app.data.splice(index, 1);
            }
          });
          deleteTaskToApi(idNoForClickedAction);
          return false;
        }
        // reload uncompleted task
        if (e.target.classList.value == 'refresh-icon') {
          const idNoForClickedAction =
            requestedRow.parentElement.firstChild.firstChild.textContent;
          let selectedTask = app.data.find((task) => {
            return task.id == idNoForClickedAction;
          });
          app.currentPomodoroTimes = selectedTask;
          app.setTask();
          const modalFullscreen = document.getElementById('modalFullscreen');
          const taskTableModalFullScreenInstance = bootstrap.Modal.getInstance(
            modalFullscreen
          );
          taskTableModalFullScreenInstance.toggle();
          const modalFullScreenTrigger = document.getElementById(
            'modalFullScreenTrigger'
          );
          app.$taskFormInput.disabled = true;
          modalFullScreenTrigger.disabled = true;
          app.$taskCreateButton.style.display = 'none';
          app.$pomodoroTimes.remove();
          app.timerRender();
          app.$taskController.style.display = 'block';
          return false;
        }
        // open task detail
        const idNoForClickedAction =
          requestedRow.firstChild.firstChild.textContent;
        if (idNoForClickedAction[0] != 'N') {
          let selectedTask = app.data.find((task) => {
            return task.id == idNoForClickedAction;
          });
          let taskModal = new bootstrap.Modal(
            document.getElementById('modalTaskScreen')
          );
          fillTaskScreen(selectedTask, taskModal);
          let modalFullscreen = document.getElementById('modalFullscreen');
          // Normally BootStrap 5.0 Modal z-index is 1050 and need decrease -1 for selected task
          modalFullscreen.style.zIndex = 1049;
          return false;
        }
      });
    });
  }
}

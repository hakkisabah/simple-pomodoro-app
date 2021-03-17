import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import PomodoroApp from './app';
import { getDataFromApi } from './data';
getDataFromApi().then((taskdata) => {
  let pomodoroApp = new PomodoroApp({
    taskFormSelector: '#task-form',
    taskCreateButton: '#task-create',
    taskController: '#task-controller',
    startBtnSelector: '#start',
    pauseBtnSelector: '#pause',
    pomodoroTimes: '#pomodoro-times',
    pomodoroTimesWrapper: '#pomodoro-times-wrapper',
    periodNames: '#period-names',
    shortBreakSound: '#short-break',
    longBreakSound: '#long-break',
    taskdata,
  });
  pomodoroApp.init();
});

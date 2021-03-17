import { completeTaskOnApi } from '../data';
import { addMinutesToDate, getNow, getRemainingDate } from '../helpers/date';

export default class TimeLogic {
  constructor(appInstance) {
    this.currentInterval = null;
    this.currentRemaining = null;
    this.currentTask = null;
    this.lastTimer = null;
    this.intervalLoop = 1000;
    this.app = appInstance;
    this.repeatedCycle = 1;
  }

  _periodTitleResolver() {
    const isPeriod = this.app.currentPomodoroTimes.periods[
      `period${this.repeatedCycle}`
    ];
    if (isPeriod) {
      this.app.currentPomodoroTimes.periods[`period${this.repeatedCycle}`] = {
        periodTitle: isPeriod,
        completed: 'YES',
      };
    } else {
      this.app.currentPomodoroTimes.periods[`period${this.repeatedCycle}`] = {
        periodTitle: `period${this.repeatedCycle}`,
        completed: 'YES',
      };
    }
  }

  _breakTimerStopper() {
    this._periodTitleResolver();
    const remainintRepeat =
      +this.app.currentPomodoroTimes.cycles - +this.repeatedCycle;
    if (
      remainintRepeat > 0 &&
      Math.round(this.repeatedCycle) %
        Math.round(this.app.currentPomodoroTimes.cycles) ===
        0
    ) {
      ++this.repeatedCycle;
      return this.initializeTimer(this.app.currentPomodoroTimes.cycles);
    }
    if (remainintRepeat < 1) {
      this._changeCompletedStatusOnDataTables();
      this.app.currentPomodoroTimes.completed = 'YES';
      delete this.app.currentPomodoroTimes.action;
      completeTaskOnApi(this.app.currentPomodoroTimes).then(() => {
        this.app.end('completed');
      });
    } else {
      this.repeatedCycle++;
      this.initializeTimer();
    }
  }

  initializeBreakTimer(deadline) {
    this.createTimer({
      internalVariable: 'initializeBreakTimer',
      deadline,
      timerElContent:
        +this.repeatedCycle % +this.app.currentPomodoroTimes.cycles === 0
          ? 'Long Chill..'
          : 'Chill..',
      onStop: () => this._breakTimerStopper(),
    });
  }

  _changeCompletedStatusOnDataTables() {
    let task_table = $('#task_table').DataTable();
    const { id } = this.app.currentPomodoroTimes;
    task_table.rows(function (idx, data, node) {
      if (data.id == id) {
        task_table.cell(idx, 2).data('YES');
        task_table
          .cell(idx, 3)
          .data(
            '<img class="delete-icon" src="assets/images/icons/delete.png">'
          );
      }
    });
    task_table.row(0).invalidate().draw();
  }

  initializeTimer(deadline) {
    this.createTimer({
      internalVariable: 'initializeTimer',
      deadline: deadline
        ? deadline
        : addMinutesToDate(
            getNow(),
            +this.app.currentPomodoroTimes.period_time
          ),
      timerElContent: "You're working.. ",
      onStop: () => {
        const now = getNow();
        const isLong =
          +this.repeatedCycle % +this.app.currentPomodoroTimes.cycles === 0
            ? true
            : false;
        const breakDeadline = addMinutesToDate(
          now,
          isLong
            ? +this.app.currentPomodoroTimes.long_break
            : +this.app.currentPomodoroTimes.short_break
        );
        if (isLong) {
          this.app.longBreakSound.play();
        } else {
          this.app.shortBreakSound.play();
        }
        this.initializeBreakTimer(breakDeadline);
      },
    });
  }

  createTimer({ internalVariable, deadline, timerElContent, onStop }) {
    // Tell to app about last timer
    this.lastTimer = `${internalVariable}`;
    this.currentInterval = setInterval(() => {
      const remainingTime = getRemainingDate(deadline);
      const { total, minutes, seconds } = remainingTime;
      // currentRemaining refreshing while every interval loop
      this.currentRemaining = total;
      const timerLiveInfo = {
        minutes,
        seconds,
        currentTask: this.app.currentPomodoroTimes,
        repeatedCycle: this.repeatedCycle,
        timerElContent,
      };

      this.app.$timerEl.innerHTML = this.app.timerRenderingWhileRuningCurrentTask(
        timerLiveInfo
      );
      // before the end of the break
      if (
        internalVariable === 'initializeBreakTimer' &&
        minutes < 1 &&
        seconds < 5
      ) {
        this.app.shortBreakSound.play();
      }
      if (total <= 0) {
        clearInterval(this.currentInterval);
        onStop();
      }
    }, this.intervalLoop);
  }
  getRemaining() {
    const now = getNow();
    const nowTimestamp = now.getTime();
    const remainingDeadline = new Date(nowTimestamp + this.currentRemaining);
    return remainingDeadline;
  }
}

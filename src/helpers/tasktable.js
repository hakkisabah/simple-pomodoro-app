export const fillTaskScreen = (task, instance) => {
  const $modalTaskScreen = document.getElementById('modalTaskScreen');
  $modalTaskScreen.querySelector('.modal-title').textContent = '';
  $modalTaskScreen.querySelector('.modal-body').innerHTML = '';
  _wrapTaskScreen($modalTaskScreen, task);
  instance.toggle();
};

const _wrapTaskScreen = ($modalTaskScreen, task) => {
  let modalTitle = $modalTaskScreen.querySelector('.modal-title');
  modalTitle.textContent = `TASK : ${task.title}
  ${task.completed === 'YES' ? '(COMPLETED)' : ''}`;
  let modalBody = $modalTaskScreen.querySelector('.modal-body');

  const taskDetail = _wrapSingleTask(task);
  modalBody.innerHTML = `<div class="row">${taskDetail}</div>`;
};

const _wrapSingleTask = (task) => {
  let taskDetail = '';
  taskDetail += _wrapFirstTitle(task);
  Object.keys(task).forEach((key) => {
    if (key === 'periods' && Object.keys(task[key]).length > 0) {
      let tempPeriodDetail = '';
      Object.keys(task[key]).sort((a, b) => b - a);
      Object.keys(task[key]).forEach((periodKeys) => {
        tempPeriodDetail += _wrapPeriodDetail(
          periodKeys,
          task[key][periodKeys].periodTitle,
          task[key][periodKeys].completed
        );
      });
      taskDetail += `
        <div class="col-md-12 mb-3 navbar-light bg-light">
          ${tempPeriodDetail}
        </div>`;
    } else {
      if (key !== 'action' && key !== 'periods' && key !== 'title') {
        taskDetail += _wrapTaskDetail(key, task);
      }
    }
  });
  return taskDetail;
};

const _wrapFirstTitle = (task) => {
  return `
        <div class="col-md-12 mb-3 navbar-light bg-light">
          <label class="col-md-6 col-form-label fw-bold"
            >TITLE :</label
          >
          <div class="col-md-12 text-break">
            <input
              type="text"
              readonly
              class="form-control-plaintext"
              value="${task.title}"
            />
          </div>
        </div>
        `;
};

const _wrapPeriodDetail = (periodKey, periodTitle, periodStatus) => {
  return `
        <label class="col-md-6 col-form-label fw-bold">${periodKey.toUpperCase()} :</label>
        <div class="col-md-12">
          <input type="text" readonly class="form-control-plaintext text-break" 
          value="${
            periodStatus === 'YES'
              ? periodTitle + ' completed'
              : 'period not completed'
          }">
        </div>`;
};

const _wrapTaskDetail = (key, task) => {
  return `
        <div class="col-md-12 mb-3 navbar-light bg-light">
          <label class="col-md-6 col-form-label fw-bold"
            >${key.toUpperCase()} :</label
          >
          <div class="col-md-3">
            <input
              type="text"
              readonly
              class="form-control-plaintext"
              value="${
                key === 'createdAt'
                  ? new Date(task.createdAt).toLocaleDateString()
                  : task[key]
              }"
            />
          </div>
        </div>`;
};

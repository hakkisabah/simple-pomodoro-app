import { API_URL, isLocal } from './constans';

// ---------------------
// Locally ---------------------
// ---------------------
export const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem('data')) || [];
};

export const setLocalStorage = (data) => {
  localStorage.setItem('data', JSON.stringify(data));
};

export const removeFromLocalStorage = (taskId) => {
  let currentStorage = getLocalStorage();
  const arranged = currentStorage.filter((el) => el.id != taskId);
  setLocalStorage(arranged);
};

// ---------------------
// Remotely ---------------------
// ---------------------
export const getDataFromApi = () => {
  if (isLocal) {
    // Local
    return new Promise((resolve) => resolve(getLocalStorage()));
  } else {
    // Remote
    return fetch(API_URL)
      .then((data) => data.json())
      .then((data) => data);
  }
};

export const addTaskToApi = (task) => {
  if (isLocal) {
    // Local
    let currentData = getLocalStorage();
    task.id =
      currentData.length > 0 ? currentData[currentData.length - 1].id + 1 : 1;
    currentData.push(task);
    setLocalStorage(currentData);
    return new Promise((resolve) => resolve(task));
  } else {
    // Remote
    return fetch(API_URL, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
  }
};

export const deleteTaskToApi = (taskId) => {
  if (isLocal) {
    // Local
    removeFromLocalStorage(taskId);
  } else {
    // Remote
    fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((data) => data);
  }
};

export const completeTaskOnApi = (task) => {
  if (isLocal) {
    // Local
    let currentStorage = getLocalStorage();
    currentStorage.filter((el, index) => {
      if (el.id == task.id) {
        currentStorage[index].completed = 'YES';
      }
    });
    setLocalStorage(currentStorage);
    return new Promise((resolve) => resolve(task));
  } else {
    // Remote
    return fetch(`${API_URL}/${task.id}`, {
      method: 'put',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, completed: 'YES' }),
    });
  }
};

import axiosClient from './axiosClient';

const taskApi = {
  getAllTasks: () => {
    const url = '/tasks';
    return axiosClient.get(url, {params});
  },
  createTask: (data) => {
    const url = '/tasks';
    return axiosClient.post(url, data);
  },
  updateTask: (id, data) => {
    const url = `/tasks/${id}`;
    return axiosClient.put(url, data);
  },
  deleteTask: (id) => {
    const url = `/tasks/${id}`;
    return axiosClient.delete(url);
  }
};

export default taskApi;
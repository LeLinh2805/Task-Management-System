import axiosClient from './axiosClient';

const taskApi = {
  getAllTasks: (params) => {
    const url = '/tasks';
    return axiosClient.get(url, { params });
  },
  getTaskDetail: (id) => {
    const url = `/tasks/${id}`;
    return axiosClient.get(url);
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
  },
  getSnapshots: (taskId) => {
    const url = `/tasks/${taskId}/history`;
    return axiosClient.get(url);
  },
  exportTasks: (filter) => {
    const url = '/tasks/export';
    return axiosClient.post(url, { priority: filter },{
      responseType: 'blob',
   } );
  }

};

export default taskApi;
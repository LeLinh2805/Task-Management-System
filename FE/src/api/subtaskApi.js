import axiosClient from './axiosClient';

const subtaskApi = {
    createSubtask: (data) => {
        const url = '/subtasks';
        return axiosClient.post(url, data);
    },
    getSubtask: (taskId) => {
        const url = `/subtasks/${taskId}`;
        return axiosClient.get(url);
    },
    updateSubtask: (id, data) => {
        const url = `/subtasks/${id}`;
        return axiosClient.put(url, data);
    },
    deleteSubtask: (id) => {
        const url = `/subtasks/${id}`;
        return axiosClient.delete(url);
    }
};

export default subtaskApi;
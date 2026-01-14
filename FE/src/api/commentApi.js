import axiosClient from './axiosClient';

const commentApi = {
    createComment: (data) => {
        const url = '/comments';
        return axiosClient.post(url, data);
    },
    getCommentsByTask: (taskId) => {
        const url = `/comments/${taskId}`;
        return axiosClient.get(url);
    },
    updateComment: (id, data) => {
        const url = `/comments/${id}`;
        return axiosClient.put(url, data);
    },
    deleteComment: (id) => {
        const url = `/comments/${id}`;
        return axiosClient.delete(url);
    }
};

export default commentApi;

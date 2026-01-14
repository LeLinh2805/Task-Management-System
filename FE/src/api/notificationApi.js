import axiosClient from './axiosClient';

const notificationApi = {
    getAll: () => {
        const url = '/notifications';
        return axiosClient.get(url);
    },
    markAsRead: (id) => {
        const url = `/notifications/${id}/read`;
        return axiosClient.put(url);
    }
};

export default notificationApi;
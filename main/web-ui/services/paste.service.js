const axios = require('axios');


const API_BASE_URL = process.env.PASTE_SERVICE_URL || 'http://app:3001';


const { sendToQueueWithResponse } = require('./rabbitmq');

const createPaste = async (data) => {
    const response = await sendToQueueWithResponse({
        action: 'createPaste',
        data: data
    });
    return response; // { status: 'success', pasteId: '...' }
};

// Lấy paste theo ID → vẫn dùng HTTP
const getPasteById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/paste/${id}`);
        return response.data.paste;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            const notFoundError = new Error('Paste not found');
            notFoundError.status = 404;
            throw notFoundError;
        }
        throw new Error('Failed to fetch paste');
    }
};

// Lấy danh sách public pastes theo trang
const getPublicPastes = async (page = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public?page=${page}`);
        return {
            pastes: response.data.pastes,
            pagination: response.data.pagination
        };
    } catch (error) {
        throw new Error('Failed to fetch public pastes');
    }
};

// Lấy thống kê theo tháng
const getMonthlyStats = async (month) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/${month || ''}`);
        return response.data.stats;
    } catch (error) {
        throw new Error('Failed to fetch monthly statistics');
    }
};

module.exports = {
    createPaste,
    getPasteById,
    getPublicPastes,
    getMonthlyStats
};

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

export const createBooking = (data) => {
    return axios.post(API_URL, data);
};
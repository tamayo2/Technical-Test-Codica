import axios from 'axios';
import { CONFIG } from '../config/config.js';

export const apiClient = axios.create({
    baseURL: CONFIG.BASE_API_URL,
    timeout: 5000,
    params: { apikey: CONFIG.API_KEY }
});
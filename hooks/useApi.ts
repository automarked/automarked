import { FileAPIURL } from '@/constants/api';
import axios from 'axios';

export const baseURL = FileAPIURL + '/api';

export const createdInstance = axios.create({
    baseURL: `${baseURL}`,
    headers: {}
});
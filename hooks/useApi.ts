import { apiBaseURL } from '@/constants/api';
import axios from 'axios';

export const baseURL = apiBaseURL + '/api';

export const createdInstance = axios.create({
    baseURL: `${baseURL}`,
    headers: {}
});

export const updateSale = async (saleId: string, formData: FormData) => {
    try {
        const response = await createdInstance.put(`/sales/${saleId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};
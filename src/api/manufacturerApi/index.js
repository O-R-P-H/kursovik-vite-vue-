import {config, DefaultApiInstance} from "@/api";

export const ManufacturerApi = {
    async getAll() {
        const url = `${config.backendIP}/manufacturers`;
        const req = await DefaultApiInstance.get(url);
        return req.data;
    },
    async create(manufacturerData) {
        const url = `${config.backendIP}/manufacturers`;
        const req = await DefaultApiInstance.post(url, manufacturerData);
        return req.data;
    },
    async update(id, manufacturerData) {
        const url = `${config.backendIP}/manufacturers/${id}`;
        const req = await DefaultApiInstance.put(url, manufacturerData);
        return req.data;
    },
    async delete(id) {
        try {
            const url = `${config.backendIP}/manufacturers/${id}`;
            const response = await DefaultApiInstance.delete(url);
            return response.data;
        } catch (error) {
            // Если это 404 ошибка, считаем удаление успешным
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    }
};

import { config, DefaultApiInstance } from "@/api";

export const PriceListApi = {
    async getAll() {
        const url = `${config.backendIP}/price-lists`;
        const response = await DefaultApiInstance.get(url, {
            headers: {
                'accept': 'application/json'
            }
        });
        return response.data;
    },

    async create(priceListData) {
        const url = `${config.backendIP}/price-lists`;
        const response = await DefaultApiInstance.post(url, {
            manufacturer: priceListData.manufacturer,
            productName: priceListData.productName,
            group: priceListData.group,
            price: priceListData.price
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        return response.data;
    },

    async update(id, priceListData) {
        const url = `${config.backendIP}/price-lists/${id}`;
        const response = await DefaultApiInstance.put(url, {
            productName: priceListData.productName,
            group: priceListData.group,
            price: priceListData.price,
            manufacturer: priceListData.manufacturer // Отправляем как строку
        }, {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });
        return response.data;
    },

    async delete(id) {
        const url = `${config.backendIP}/price-lists/${id}`;
        try {
            const response = await DefaultApiInstance.delete(url);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return { success: true };
            }
            throw error;
        }
    }
};

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

        // Преобразуем данные в нужный формат
        const requestData = {
            manufacturer: priceListData.manufacturer,
            productName: priceListData.productName,
            group: priceListData.group,
            price: priceListData.price // Оставляем как строку, если API ожидает строку
        };

        try {
            const response = await DefaultApiInstance.put(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка в PriceListApi.update:', {
                url,
                requestData,
                error: error.response?.data || error.message
            });
            throw error;
        }
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

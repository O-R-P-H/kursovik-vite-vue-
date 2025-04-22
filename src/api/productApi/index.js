import {config, DefaultApiInstance} from "@/api";

export const ProductApi = {
    async getAll() {
        const url = `${config.backendIP}/products`
        const req = await DefaultApiInstance.get(url)
        return req.data
    },
    async create(productData) {
        const url = `${config.backendIP}/products`;
        const req = await DefaultApiInstance.post(url, productData, {
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            }
        });
        return req.data;
    },
    // productApi/index.js
    async update(id, productData) {
        const url = `${config.backendIP}/products/${id}`;
        const requestData = {
            name: productData.name,
            count: productData.count,
            group: productData.group,
            number: productData.number,
            price: productData.price,
            manufacturer: productData.manufacturer // Отправляем как есть (строку или объект)
        };

        const req = await DefaultApiInstance.put(url, requestData);
        return req.data;
    },
    async deleteMultiple(ids) {
        const url = `${config.backendIP}/products`
        try {
            const req = await DefaultApiInstance.delete(url, {
                data: ids
            })
            return req.data
        } catch (error) {
            console.error('Delete error:', error)
            throw error
        }
    }
}

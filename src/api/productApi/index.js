import {config, DefaultApiInstance} from "@/api";

export const ProductApi = {
    async getAll() {
        const url = `${config.backendIP}/products`
        const req = await DefaultApiInstance.get(url)
        console.log(req)
        return req.data
    },
    async create(productData) {
        const url = `${config.backendIP}/products`;
        const req = await DefaultApiInstance.post(url, productData);
        return req.data;
    },
    async update(id, productData) {
        const url = `${config.backendIP}/products/${id}`;
        const req = await DefaultApiInstance.put(url, productData);
        return req.data;
    },

    async deleteMultiple(ids) {
        const url = `${config.backendIP}/products`
        try {
            const req = await DefaultApiInstance.delete(url, {
                data: ids // axios передает это как тело запроса для DELETE
            })
            console.log('Deleted successfully:', req.data)
            return req.data
        } catch (error) {
            console.error('Delete error:', error)
            throw error
        }
    }
}

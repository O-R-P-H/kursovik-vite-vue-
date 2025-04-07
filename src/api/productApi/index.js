import {config, DefaultApiInstance} from "@/api";

export const ProductApi ={
    async getAll (){
        const url = `${config.backendIP}/products`
        const req = await DefaultApiInstance.get(url)
        console.log(req)
        return req.data

    }
}

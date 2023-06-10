import { SuccessResponse } from './../types/util.type'
import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import http from 'src/utils/http'

const URL = 'products'

export const productApi = {
  getProducts: (params: ProductListConfig) => {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getProductById: (id: string) => {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

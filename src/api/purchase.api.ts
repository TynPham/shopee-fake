import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/util.type'
import http from 'src/utils/http'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyPurchases: (body: { product_id: string; buy_count: number }[]) =>
    http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body),
  updatePurchase: (body: { product_id: string; buy_count: number }) =>
    http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body),
  deletePurchase: (purchases_id: string[]) =>
    http.delete<SuccessResponse<{ deleted_count: number }>>(URL, {
      data: purchases_id
    })
}

export default purchaseApi

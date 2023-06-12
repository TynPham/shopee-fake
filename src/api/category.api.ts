import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/util.type'
import http from 'src/utils/http'

const URL = 'categories'

export const categoryApi = {
  getCategories: () => http.get<SuccessResponse<Category[]>>(URL)
}

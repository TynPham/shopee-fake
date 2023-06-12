import AsideFilter from './asideFilter'
import Product from './product'
import SortProductList from './sortProductList'
import { productApi } from 'src/api/product.apt'
import useQueryParams from 'src/hook/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import Pagination from 'src/components/pagination'
import { ProductListConfig } from 'src/types/product.type'
import { omitBy, isUndefined } from 'lodash'
import { categoryApi } from 'src/api/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '20',
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      category: queryParams.category,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          {productsData && (
            <>
              <div className='col-span-3'>
                <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
              </div>
              <div className='col-span-9'>
                <SortProductList queryConfig={queryConfig} pageSize={productsData?.data.data.pagination.page_size} />
                <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {productsData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                <Pagination queryConfig={queryConfig} pageSize={productsData?.data.data.pagination.page_size} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

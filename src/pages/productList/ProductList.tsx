import AsideFilter from './asideFilter'
import Product from './product'
import SortProductList from './sortProductList'
import { productApi } from 'src/api/product.apt'
import useQueryParams from 'src/hook/useQueryParams'
import { useQuery } from '@tanstack/react-query'

export default function ProductList() {
  const queryParams = useQueryParams()

  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productApi.getProducts(queryParams)
  })

  console.log(data)

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {Array(30)
                .fill(0)
                .map((_, index) => (
                  <div className='col-span-1' key={index}>
                    <Product />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { product } from '../lib/models/Orders'
const OrderItem = ({item}:{item:product}) => {

  return (
    <div className='flex  flex-col md:flex-row  items-start md:items-center justify-between md:gap-6 rounded-md  hover:bg-purple-800 hover:text-white px-2 py-1 md:px-6 md:py-2 border border-purple-100 gap-2'>
                            <div key={item.productId} className='flex   sm:grid grid-cols-12 gap-2  w-full justify-between items-center  rounded-md text-sm  cursor-pointer'>
                                <div className='h-full col-span-6'>
                                    <div className='flex gap-2 items-center h-full'>
                                        <img  src="/product.jpeg" alt="My Image Description" className='w-16 h-16 rounded-md' width={200} height={20}/>
                                        <span className='break-words text-wrap w-24 sm:w-32 md:w-48'>{item.title}</span>
                                    </div>
                                </div>
                                <div className='col-span-6 flex flex-col items-start md:grid grid-cols-2 gap-2'>
                                    <div className='flex  justify-center items-center gap-2  h-4  col-span '> 
                                        <span className='font-bold'>Quantity: </span> 
                                        <span>{item.quantity}</span> 
                                    </div>
                                    <div className=' flex gap-2 col-span'>
                                        <span className='font-bold'>Price:</span>
                                        <span>N{item.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
  )
}

export default OrderItem
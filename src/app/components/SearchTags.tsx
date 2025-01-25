import React from 'react'

const SearchTags = () => {
  return (
    <div className='flex flex-wrap w-full text-purple-900 gap-2'> 
                    <div  className='border border-purple-900 px-4 py-0.5 rounded-md flex items-center gap-1'>
                      <span>Fashion </span>
                      <span className='text-2xl mb-1 cursor-pointer'>x</span>
                    </div>
                    <div  className='border border-purple-900 px-4 py-0.5 rounded-md flex items-center gap-1'>
                      <span>20,000-50,000 </span>
                      <span className='text-2xl mb-1 cursor-pointer'>x</span>
                    </div>
                    <div  className='border border-purple-900 px-4 py-0.5 rounded-md flex items-center gap-1'>
                      <span>Men</span>
                      <span className='text-2xl mb-1 cursor-pointer'>x</span>
                    </div>
    </div>
  )
}

export default SearchTags
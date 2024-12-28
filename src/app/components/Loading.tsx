import React from 'react'
import PacmanLoader from 'react-spinners/PacmanLoader'

const Loading = () => {
  return (
    <div className='w-screen h-screen z-50 fixed top-0 left-0 flex justify-center items-center bg-opacity-70 backdrop-blur-sm'>
        <PacmanLoader color='rgb(88 28 135 / var(--tw-text-opacity, 1))'/>
    </div>
  )
}

export default Loading
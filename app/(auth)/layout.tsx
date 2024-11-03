import React from 'react'

const Authlayout = ({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) => {
  return (
    <div className='h-full flex items-center justify-center'>
        {children}
    </div>
  )
}

export default Authlayout
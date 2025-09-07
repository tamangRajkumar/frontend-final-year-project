import React from 'react'
import Card from '../../src/components/find_user/Card'

const OnlineUsers = () => {
  return (
  <div>
    <p className='text-2xl font-bold text-center mt-10 mb-5 text-green-600'>Online Users</p>
    <div>
    <div className="grid grid-cols-4 mt-5 mx-10    ">
    <Card/>
    </div>
    </div>
  </div>
  )
}

export default OnlineUsers
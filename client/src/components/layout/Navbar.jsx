import React from 'react'
import ProfileInfoCard from '../cards/ProfileInfoCard'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='sticky top-0 z-50 bg-white/90 border-b border-gray-200 backdrop-blur-sm py-3 w-full'>
      <div className='w-full px-4 md:px-6 flex items-center justify-between'>
        <Link to='/dashboard'>
          <h2 className='text-lg md:text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200'>
            <span className='text-blue-500'>Interview Buddy</span> – Crack your Interview with AI
          </h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </div>
  )
}

export default Navbar

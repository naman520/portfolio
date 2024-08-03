import React from 'react';
import img1 from '../assets/imgportfolio.jpg';
import '../Page/home.css';
import Project from './Project';
import FloatingNav from './FloatingNav';

export default function Home() {
  return (
    <>

      <div className='bg-gradient-to-r from-slate-900 to-slate-700 min-h-screen relative'>
        <div>
          <FloatingNav />
        </div>
        <div className='relative max-w-xl mx-auto'>
          <img className='w-full h-[700px] object-cover rounded-md pt-10' src={img1} alt='Mountain View' />
          <div className='absolute inset-0 bg-gray-700 opacity-60 rounded-md'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <h2 className='intro bg-gradient-to-r from-green-500 to-yellow-400 bg-clip-text text-transparent text-3xl font-bold z-10'>
              Myself, Naman Gupta, B.Tech Final Year Student
            </h2>
          </div>
        </div>

        <div className='text-3xl font-bold text-gray-200 text-center my-4 pt-10'>
          My Tech Stack
        </div>

        <div className='flex justify-center space-x-4 mb-4'>
          <div className='bg-green-400 text-4xl text-black font-semibold pt-3 h-16 w-16 text-center rounded-full'>
            M
          </div>
          <div className='bg-black text-4xl text-white font-semibold pt-2 h-16 w-16 text-center rounded-full'>
            ex
          </div>
          <div className='bg-[#57c3db] text-4xl text-black font-semibold pt-3 h-16 w-16 text-center rounded-full'>
            R
          </div>
          <div className='bg-green-700 text-4xl text-black font-semibold pt-3 h-16 w-16 text-center rounded-full'>
            N
          </div>
        </div>

        <div className='flex justify-center space-x-4 mb-4'>
          <div className='bg-yellow-400 text-xl text-black font-light pt-3 h-14 w-28 text-center rounded-full'>
            Python
          </div>
          <div className='bg-teal-600 text-xl text-white font-light pt-3 h-14 w-32 text-center rounded-full'>
            TailwindCSS
          </div>
        </div>

        <div className='pt-10'>
          <div className='text-2xl font-bold text-blue-200 text-center sm:pt-5'>
            My Projects
          </div>
          <div >
            <Project />
          </div>
        </div>   
      </div>
      
    </>
  );
}

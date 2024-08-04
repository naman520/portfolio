import React from 'react';
import img1 from '../assets/imgportfolio.jpg';
import '../Page/home.css';
import Project from './Project';
import FloatingNav from './FloatingNav';
import Footer from './Footer';

export default function Home() {
  return (
    <>

      <div className='bg-gradient-to-r from-slate-900 to-slate-700 min-h-screen relative'>
        <div>
          <FloatingNav />
        </div>
        <div className='relative max-w-6xl mx-auto flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 pt-20'>
          <div className='md:flex-1 text-center md:text-left'>
            <h2 className='intro bg-gradient-to-r from-green-500 to-yellow-400 bg-clip-text text-transparent text-md md:text-4xl font-bold'>
              Myself, Naman Gupta, B.Tech Final Year Student. Proficient in Python, MERN Stack, Data Analysis and DSA
            </h2>
          </div>
          <div className='md:flex-1'>
            <img className='w-[200px] md:w-[300px] h-[200px] md:h-[300px] object-cover rounded-full border-4 border-gray-900' src={img1} alt='Naman Gupta' />
          </div>
        </div>
        <div className='text-white text-center text-lg pt-5'>
            Check out My &nbsp;
            <span className=' underline hover:text-yellow-500'>
                <a  href="https://leetcode.com/u/namangupta2360/">LeetCode</a> 
            </span> 
            &nbsp; and &nbsp;
            <span className=' underline hover:text-green-600'>
                <a href="https://www.geeksforgeeks.org/user/namangupta2360/">GFG</a> 
            </span>
              &nbsp; Account
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
        <div>
          <Footer />
        </div>
      </div>
      
    </>
  );
}

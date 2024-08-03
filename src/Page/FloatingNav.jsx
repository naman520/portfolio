import React from 'react';

export default function FloatingNav() {
  return (
    <div className='bg-gradient-to-r from-amber-600 to-slate-500 fixed top-0 left-0 w-full p-4 z-50'>
      <ul className='flex justify-center space-x-4 p-0 m-0 text-lg font-light'>
        <li><a href="mailto:namangupta2360@gmail.com" className='text-white hover:underline'>Email</a></li>
        <li><a href="https://www.linkedin.com/in/naman-gupta-914a6822a/" className='text-white hover:underline'>LinkedIn</a></li>
        <li><a href="https://github.com/naman520" className='text-white hover:underline'>GitHub</a></li>
        <li><a href="" className='text-white hover:underline'>Resume</a></li>
      </ul>
    </div>
  );
}

import React from 'react'

export default function Footer() {
  return (
    <>
      <div className=' text-center text-white text-xl '>
        <p> &copy; {new Date().getFullYear()}
            &nbsp;
            <span>
                <a href="https://naman-gupta.vercel.app/" className='text-white hover:underline'>
                    Naman Gupta
                </a>
            </span>
        </p>
        <p><span>
                <a href="mailto:namangupta2360@gmail.com">My contact </a>
            </span></p>
      </div>
    </>
  )
}

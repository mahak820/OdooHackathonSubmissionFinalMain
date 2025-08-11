import React from 'react'

const Page1 = () => {
  return (
    <>
    <div style={{
                    background: 'linear-gradient(180deg, hsla(235, 51%, 52%, 1) 0%, hsla(235, 46%, 38%, 1) 50%, hsla(234, 46%, 8%, 1) 100%)',
                }} 
                    className='min-h-screen bg-gradient-to-b from-sky-800 via-[#01023D] to-[#000000] text-white'>
                    
    </div>

        <div className='min-h-screen bg-[#10132B]'>
                <h1 className='text-yellow-500'>Hello from page 1</h1>
        </div>
    </>
  )
}

export default Page1

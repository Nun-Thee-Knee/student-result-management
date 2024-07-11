import React from 'react'
import Image from 'next/image'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

const page = async() => {
    const data = await getServerAuthSession()
  return (
    <>
    {
        !data?<div className='bg-black h-[100vh] flex flex-col items-center justify-center p-28 gap-10'>
        <center>
        <h1 className='text-5xl text-white uppercase'>STUDENT RESULT MANAGEMENT SYSTEM</h1>
        </center>
        <Image alt='logo' src="/dsce.jpg" width={200} height={200}></Image>
        <a href="/api/auth/signin" className='bg-blue-700 p-5 rounded-xl text-white hover:bg-blue-500'>Get Started</a>
    </div>:<h1>{JSON.stringify(data)}</h1> 
    }
    </>
  )
}

export default page
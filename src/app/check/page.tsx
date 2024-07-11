'use client'
import React from 'react'
import Image from 'next/image'
import { api } from '~/trpc/react'
import Role from '../_components/role'

const page = () => {
    const {data:userData,isLoading} = api.user.getRole.useQuery({id: "clyh6vbgd0002anul5rjqnody"})
  return (
    <div className='bg-black flex justify-center items-center h-[100vh] text-white'>
    {isLoading?<Image src="/loading.gif" height={200} width={200} alt='Loading'></Image>:<div>{userData?.role === "null"?<Role/>:<h1>Not null</h1>}</div>}
    </div>
  )
}

export default page
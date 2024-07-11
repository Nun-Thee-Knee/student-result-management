'use client'
import React from 'react'
import Image from 'next/image'
import { api } from '~/trpc/react'
import Role from '../_components/role'
import { usePathname } from 'next/navigation'
import Teacher from '../_components/Teacher'
import Student from '../_components/Student'

const Page = () => {
    const path = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const id = path?.substring(1) as string
    const { data: userData, isLoading } = api.user.getRole.useQuery({ id: id })
    return (
        <div className='bg-black flex justify-center items-center h-auto text-white p-14'>
            {isLoading ? (
                <Image src="/loading.gif" height={200} width={200} alt='Loading' />
            ) : (
                <div>
                    {userData?.role === "null" ? (
                        <Role userId={id}/>
                    ) : (
                        <h1>
                            <a href='/api/auth/signout' className='bg-red-600 hover:bg-red-900 p-3 rounded-md text-white'>Sign Out</a>
                            {userData?.role === "Teacher"?<Teacher userId={id}/>:<Student/>}</h1>
                    )}
                </div>
            )}
        </div>
    )
}

export default Page

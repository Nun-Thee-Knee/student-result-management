'use client'
import React from 'react'
import Image from 'next/image'
import { api } from '~/trpc/react'
import Role from '../_components/role'
import { usePathname } from 'next/navigation'

const Page = () => {
    const path = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const id = path?.substring(1) as string
    const { data: userData, isLoading } = api.user.getRole.useQuery({ id: id })

    return (
        <div className='bg-black flex justify-center items-center h-[100vh] text-white'>
            {isLoading ? (
                <Image src="/loading.gif" height={200} width={200} alt='Loading' />
            ) : (
                <div>
                    {userData?.role === "null" ? (
                        <Role userId={id}/>
                    ) : (
                        JSON.stringify(userData?.role) === "Teacher" ? (
                            <h1>{userData?.role}</h1>
                        ) : (
                            <h1>{userData?.role}</h1>
                        )
                    )}
                </div>
            )}
        </div>
    )
}

export default Page

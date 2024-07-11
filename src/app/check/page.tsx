'use client'
import React from 'react'
import { api } from '~/trpc/react'

const page = () => {
    const userData = api.user.getRole.useQuery({id: "Thisa"})
  return (
    <div>{JSON.stringify(userData)}</div>
  )
}

export default page
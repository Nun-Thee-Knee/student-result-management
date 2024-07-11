'use client'
import React, { useState } from 'react'
import { api } from '~/trpc/react'

const Role = ({userId}:{userId:string}) => {
    const [role, setRole] = useState("")
    const [error, setError] = useState("")

    const mutation = api.user.updateRole.useMutation()

    const handleProceed = () => {
        mutation.mutate({ id: userId, newRole: role }, {
            onSuccess: (data) => {
                console.log("Role updated successfully", data)
                window.location.reload()
            },
            onError: (error) => {
                console.error("Error updating role", error)
                setError("Failed to update the role. Please try again.")
            }
        })
    }

    return (
        <div className='flex flex-col justify-center items-center gap-10'>
            <div className='flex lg:flex-row flex-col justify-center items-center gap-10'>
                <div
                    className={`p-10 text-white text-3xl rounded-xl cursor-pointer hover:bg-blue-900 uppercase font-bold ${role === 'Student' ? 'bg-blue-900' : 'bg-blue-700'}`}
                    onClick={() => setRole('Student')}
                >
                    Student
                </div>
                <div
                    className={`p-10 text-white text-3xl rounded-xl cursor-pointer hover:bg-blue-900 uppercase font-bold ${role === 'Teacher' ? 'bg-blue-900' : 'bg-blue-700'}`}
                    onClick={() => setRole('Teacher')}
                >
                    Teacher
                </div>
            </div>
            <div className='mt-5 text-2xl'>
                Selected Role: {role}
            </div>
            {error && <div className='mt-5 text-red-500'>{error}</div>}
            <button
                className='mt-5 bg-green-700 p-5 text-white text-2xl rounded-xl cursor-pointer hover:bg-green-900'
                onClick={handleProceed}
            >
                Proceed
            </button>
        </div>
    )
}

export default Role

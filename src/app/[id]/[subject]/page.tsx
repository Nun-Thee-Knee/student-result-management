'use client'

import React, { useState, FormEvent, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '~/trpc/react';

const AddStudentForm: React.FC = () => {
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const pathname = usePathname();
  const classId = pathname.split('/').pop() || ''; 

  const mutation = api.classes.addStudent.useMutation({
    onSuccess: () => {
      setError(null);
      alert('Student added successfully');
    },
    onError: (err) => {
      setError('Failed to add student');
      console.error(err);
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new request
    try {
      await mutation.mutateAsync({ classId, studentEmail });
    } catch (err) {
      console.error(err); // Log any additional errors
    }
  };

  useEffect(() => {
    console.log('Class ID:', classId); // Debugging
  }, [classId]);

  return (
    <div className='flex items-center justify-center p-20'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type="email"
          placeholder="Student Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
        <button
          type="submit"
          className='bg-blue-700 text-white p-3 rounded'
        >
          Add
        </button>
        {mutation.isError && <p className='text-red-500'>{error}</p>}
      </form>
    </div>
  );
};

export default AddStudentForm;

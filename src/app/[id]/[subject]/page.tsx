'use client'

import React, { useState, FormEvent } from 'react';
import { api } from '~/trpc/react';

const AddStudentForm: React.FC = () => {
  const [studentId, setStudentId] = useState<string>('');
  const [classId, setClassId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const mutation = api.classes.addStudent.useMutation({
    onSuccess: () => {
      setError(null);
      alert('Student added successfully');
    },
    onError: (err) => {
      setError('Failed to add student');
      console.error(err); // Log the error for debugging
    }
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new request
    try {
      await mutation.mutateAsync({ classId, studentId });
    } catch (err) {
      console.error(err); // Log any additional errors
    }
  };

  return (
    <div className='flex items-center justify-center p-20'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type="text"
          placeholder="Class ID"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className='w-full p-2 border rounded'
          required
        />
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
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

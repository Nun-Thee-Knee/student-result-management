'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '~/trpc/react';

interface FormData {
  subjectName: string;
  semester: string;
  year: string;
}

interface TeacherProps {
  userId: string;
}

const Teacher: React.FC<TeacherProps> = ({ userId }) => {
  const [formData, setFormData] = useState<FormData>({
    subjectName: '',
    semester: '',
    year: ''
  });

  const [error, setError] = useState<string>('');

  const mutation = api.classes.createClass.useMutation();
  const { data: classes, error: fetchError, isLoading, refetch } = api.classes.getClass.useQuery({ id: userId });
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    const { subjectName, semester, year } = formData;

    if (!subjectName || !semester || !year) {
      setError('All fields are required');
      return;
    }

    mutation.mutate(
      { name: subjectName, semester, year: parseInt(year) },
      {
        onSuccess: (data) => {
          console.log('Class created successfully', data);
          refetch();
        },
        onError: (error) => {
          console.error('Error creating class', error);
          setError('Failed to create the class. Please try again.');
        }
      }
    );
  };

  useEffect(() => {
    if (fetchError) {
      setError('Failed to fetch classes. Please try again.');
    }
  }, [fetchError]);

  const handleClassClick = (id: string) => {
    router.push(`${pathname}/${id}`);
  };

  return (
    <div className='flex flex-col items-start justify-start h-auto p-14 gap-14'>
      <div className='flex lg:flex-row flex-col items-center justify-start gap-10'>
        <div className='flex gap-5'>
          <label htmlFor="subjectName">Subject Name</label>
          <input
            className='bg-black text-white rounded-md border-white border-[1px]'
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
          />
        </div>
        <div className='flex gap-5'>
          <label htmlFor="semester">Semester</label>
          <input
            className='bg-black text-white rounded-md border-white border-[1px]'
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          />
        </div>
        <div className='flex gap-5'>
          <label htmlFor="year">Year</label>
          <input
            className='bg-black text-white rounded-md border-white border-[1px]'
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </div>
        <div className='flex gap-5'>
          <button
            className='bg-blue-700 p-2 text-white rounded-md hover:bg-blue-900'
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
        {error && <div className='mt-5 text-red-500'>{error}</div>}
      </div>
      <div className='grid lg:grid-cols-3 flex-col md:grid-cols-2 gap-10 w-full'>
        {isLoading ? (
          <div className='text-white'>Loading...</div>
        ) : (
          classes?.map((classItem) => (
            <div 
              key={classItem.id} 
              className="flex items-center justify-center bg-blue-700 p-5 text-white cursor-pointer hover:bg-blue-900"
              onClick={() => handleClassClick(classItem.id)}
            >
              <center>
                Class ID: {classItem.id}
                <br />
                Subject Name: {classItem.name}
                <br />
                Semester: {classItem.semester}
                <br />
                Year: {classItem.year}
              </center>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teacher;

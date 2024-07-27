'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '~/trpc/react';

const ClassDetailsPage: React.FC = () => {
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [editMode, setEditMode] = useState<string | null>(null); // Track the student being edited
  const [showModal, setShowModal] = useState<boolean>(false); // Control modal visibility
  const pathname = usePathname();
  const classId = pathname.split('/').pop() || '';

  const { data, refetch } = api.classes.getClassWithStudentsAndMarks.useQuery({ id: classId });

  useEffect(() => {
    if (data) {
      setStudents(data.students);
      setMarks(data.marks);
    }
  }, [data]);

  const addStudentMutation = api.classes.addStudent.useMutation({
    onSuccess: () => {
      setError(null);
      alert('Student added successfully');
      refetch();
    },
    onError: (err) => {
      setError('Failed to add student');
      console.error(err);
    }
  });

  const updateMarksMutation = api.classes.updateStudentMarks.useMutation({
    onSuccess: () => {
      setShowModal(true); // Show modal on success
      refetch();
    },
    onError: (err) => {
      console.error(err);
    }
  });

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error before new request
    try {
      await addStudentMutation.mutateAsync({ classId, studentEmail });
    } catch (err) {
      console.error(err); // Log any additional errors
    }
  };

  const handleMarksChange = (studentId, field, value) => {
    setMarks(prevMarks => {
      const updatedMarks = prevMarks.map(mark => {
        if (mark.userId === studentId) {
          return { ...mark, [field]: value };
        }
        return mark;
      });
      return updatedMarks;
    });
  };

  const handleSaveMarks = (studentId) => {
    const studentMarks = marks.find(mark => mark.userId === studentId);
    if (studentMarks) {
      updateMarksMutation.mutate({
        classId,
        studentId,
        ia1: studentMarks.ia1,
        ia2: studentMarks.ia2,
        ia3: studentMarks.ia3,
        see: studentMarks.see,
      });
      setEditMode(null); // Exit edit mode after saving
    }
  };

  const handleEdit = (studentId) => {
    setEditMode(studentId); // Set the student in edit mode
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div className='flex flex-col items-center justify-center p-20'>
      <form onSubmit={handleAddStudent} className='space-y-4 mb-8'>
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
        {addStudentMutation.isError && <p className='text-red-500'>{error}</p>}
      </form>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">IA1</th>
              <th className="px-4 py-2 border">IA2</th>
              <th className="px-4 py-2 border">IA3</th>
              <th className="px-4 py-2 border">SEE</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const studentMarks = marks.find(mark => mark.userId === student.id) || { ia1: 0, ia2: 0, ia3: 0, see: 0 };
              const isEditing = editMode === student.id;
              return (
                <tr key={student.id}>
                  <td className="px-4 py-2 border">{student.name}</td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={studentMarks.ia1}
                        onChange={(e) => handleMarksChange(student.id, 'ia1', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      studentMarks.ia1
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={studentMarks.ia2}
                        onChange={(e) => handleMarksChange(student.id, 'ia2', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      studentMarks.ia2
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={studentMarks.ia3}
                        onChange={(e) => handleMarksChange(student.id, 'ia3', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      studentMarks.ia3
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={studentMarks.see}
                        onChange={(e) => handleMarksChange(student.id, 'see', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    ) : (
                      studentMarks.see
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveMarks(student.id)}
                        className="bg-green-700 text-white p-2 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="bg-yellow-500 text-white p-2 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Success</h2>
            <p>Marks updated successfully!</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailsPage;

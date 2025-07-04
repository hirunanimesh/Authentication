"use client";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import api from '../../constants/api';

interface Teacher {
  id: number;
  email: string;
  username: string;
  role: string;
}

const StudentPage = () => {
  const name = useSelector((state: any) => state.user.username); 
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/teachers');
      setTeachers(response.data);
      setShowTeachers(true);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const hideTeachers = () => {
    setShowTeachers(false);
    setTeachers([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-5 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Hello, {name}!
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome to your student dashboard
          </p>
        </header>

        {/* Action Button Section */}
        <section className="mb-8">
          <div className="flex justify-start">
            {!showTeachers ? (
              <button
                onClick={fetchTeachers}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Show teachers list"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Show Teachers'
                )}
              </button>
            ) : (
              <button
                onClick={hideTeachers}
                className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Hide teachers list"
              >
                Hide Teachers
              </button>
            )}
          </div>
        </section>

        {/* Teachers List Section */}
        {showTeachers && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <header className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Teachers Directory
              </h2>
              <p className="text-gray-600">
                Browse and connect with available teachers
              </p>
            </header>
            
            {teachers.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
                {teachers.map((teacher) => (
                  <article
                    key={teacher.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow duration-200"
                    role="listitem"
                  >
                    <header className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {teacher.username}
                      </h3>
                    </header>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-700 min-w-0 flex-shrink-0 mr-2">
                          Email:
                        </span>
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                          aria-label={`Send email to ${teacher.username}`}
                        >
                          {teacher.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">
                          Role:
                        </span>
                        <span className="text-gray-600 capitalize">
                          {teacher.role}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-2">
                          ID:
                        </span>
                        <span className="text-gray-600 font-mono text-xs">
                          {teacher.id}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-3">
                  <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg">
                  No teachers found.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Check back later for available teachers.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default StudentPage;
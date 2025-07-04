"use client";
import { useSelector } from 'react-redux';

const TeacherPage = () => {
  const name = useSelector((state: any) => state.user.username);
  const role = useSelector((state: any) => state.user.role);

  const user = useSelector((state: any) => state.user); // Add this for debugging
  
  console.log("User state:", user); // Debug log to see what's in the state
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
        <p>Your role is: {role}</p>
        {/* Add more content specific to the teacher here */}
    </div>
  );
};


export default TeacherPage;
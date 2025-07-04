"use client";
import { useSelector } from 'react-redux';

const StudentPage = () => {
  const name = useSelector((state: any) => state.user.username);

  const user = useSelector((state: any) => state.user); // Add this for debugging
  
  console.log("User state:", user); // Debug log to see what's in the state
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};


export default StudentPage;
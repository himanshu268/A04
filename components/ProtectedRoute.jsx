// components/ProtectedRoute.js
"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login page if user is not authenticated
  if (status === 'loading') {
    // Loading state while session is being fetched
    return <div>Loading...</div>;
  }

  if (!session) {
    // User is not authenticated, redirect to login page
    router.push('');
    
    return null;
  }

  // User is authenticated, render the children components
  return children;
};

export default ProtectedRoute;

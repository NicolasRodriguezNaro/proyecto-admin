import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from '@/app/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/queryClient';
import { AuthProvider } from '@/auth/AuthProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);


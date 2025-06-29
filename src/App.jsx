import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import LandingPage from '@/components/pages/LandingPage';
import LoginPage from '@/components/pages/LoginPage';
import RegisterPage from '@/components/pages/RegisterPage';
import Dashboard from '@/components/pages/Dashboard';
import HelperChat from '@/components/pages/HelperChat';
import KnowledgeBase from '@/components/pages/KnowledgeBase';
import Account from '@/components/pages/Account';
import Billing from '@/components/pages/Billing';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="helper/:helperId" element={<HelperChat />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="account" element={<Account />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;
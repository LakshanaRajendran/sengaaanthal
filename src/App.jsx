import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Book from './components/Book/Book';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './styles/global.css';
import './styles/book.css';
import './styles/cover.css';
import './styles/pages.css';
import './styles/bookmark.css';
import './styles/responsive.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Vintage Poetry Book Reader */}
        <Route path="/" element={<Book />} />

        {/* Administrator Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Administrator Dashboard & Poem Management */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all redirects back to the reader */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

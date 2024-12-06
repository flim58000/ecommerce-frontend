'use client';

import React from 'react';
import { AppProvider } from '../contexts/AppContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
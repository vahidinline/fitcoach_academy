import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import './styles/index.css';
import { NotificationProvider } from 'context/NotificationContext';
import dayjs from 'dayjs';
import jalaliday from 'jalaliday';

dayjs.extend(jalaliday);
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <NotificationProvider>
    <App />
  </NotificationProvider>
);

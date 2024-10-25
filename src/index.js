import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './ContextApi/userContex';
import AlanProvider from './ContextApi/AlanContext';
import EmotionsProvider from './ContextApi/emotionsContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <BrowserRouter>

      <AlanProvider>
         <EmotionsProvider>
            <UserProvider>
               <App />
            </UserProvider>
         </EmotionsProvider>
      </AlanProvider>

   </BrowserRouter>
);


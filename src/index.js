import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './ContextApi/userContex';
import EmotionsProvider from './ContextApi/emotionsContext';
import VirtualProvider from './ContextApi/virtualContex';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <BrowserRouter>

      <VirtualProvider>
         <EmotionsProvider>
            <UserProvider>
               <App />
            </UserProvider>
         </EmotionsProvider>
      </VirtualProvider>


   </BrowserRouter>
);


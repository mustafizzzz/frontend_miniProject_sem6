// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';

// let socket = io('https://mood-lens-server.onrender.com');

// console.log('Socket', socket);


// const TestSocket = () => {
//     const [question, setQuestion] = useState([]);
//     const [answer, setAnswer] = useState(''); // To store user's answer
//     const test_id = '6719fb40f1230bb78e7c4740'; // Example test ID
//     const chatContainerRef = useRef(null)
//     console.log('Check', process.env.REACT_APP_DEPLOY_URL);


//     useEffect(() => {

//         if (window.location.pathname === '/test-socket') {
//             // Emit `start_test` event with the test_id when component mounts
//             socket.emit('start_test', { test_id });

//             // Listen for questions from the server
//             socket.on('questions', (data) => {
//                 setQuestion((prevMessages) => [...prevMessages, { type: 'question', text: data }]);
//                 console.log('Question received:', data);

//                 // Emit two functions after receiving the question
//                 socket.emit('question_ack', { message: 'Question received' });
//                 socket.emit('ready_for_next', { message: 'Ready for next question' });
//             });

//             //listend for the next question
//             socket.on('response', (response) => {
//                 setQuestion((prevMessages) => [
//                     ...prevMessages,
//                     { type: 'question', text: response } // Add new question
//                 ]);
//                 console.log('Response received:', response);
//             });



//             // Handle errors by displaying an alert
//             socket.on('error', (errorMessage) => {
//                 alert(`Error: ${errorMessage}`);
//             });
//         }

//         // Cleanup on component unmount
//         return () => {
//             socket.off('questions');
//             socket.off('response');
//             socket.off('error');
//         };
//     }, []);



//     useEffect(() => {
//         if (chatContainerRef.current) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//     }, []);

//     // Handle answer submission
//     const handleAnswerSubmit = () => {

//         if (answer.trim() !== '') {

//             setQuestion((prevMessages) => [
//                 ...prevMessages,
//                 { type: 'answer', text: answer }
//             ]);
//             // Emit the answer to the server
//             socket.emit('message', { message: answer });

//             setAnswer(''); // Clear the input box after submission
//         } else {
//             alert('Please enter an answer before submitting.');
//         }
//     };

//     return (
//         <div className="test-socket-container">
//             <h2>Viva Test</h2>
//             <div className="chat-box" ref={chatContainerRef}>
//                 {question.map((msg, index) => (
//                     <div
//                         key={index}
//                         className={`chat-message ${msg.type === 'question' ? 'question' : 'answer'}`}
//                     >
//                         <p><strong>{msg.type === 'question' ? 'Question' : 'Your Answer'}:</strong> {msg.text}</p>
//                     </div>
//                 ))}
//             </div>
//             <div className="input-container">
//                 <input
//                     type="text"
//                     value={answer}
//                     onChange={(e) => setAnswer(e.target.value)}
//                     placeholder="Type your answer here"
//                 />
//                 <button onClick={handleAnswerSubmit}>Submit Answer</button>
//             </div>
//         </div>
//     );
// }

// export default TestSocket
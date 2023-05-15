import React, { useState, useEffect } from 'react';
// import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = (props) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
        console.log('Connected to server');
        });
        
        socket.on('chat message', (message) => {
        setMessages((messages) => [...messages, message]);
        });
        
        socket.on('disconnect', () => {
        console.log('Disconnected from server');
        });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
        const signedMessage = `${props.user.email}: ${inputValue}`
        socket.emit('chat message', signedMessage);
        setInputValue('');
        }
    };

    return (
        <div className="App">
        <h1>Chat Room</h1>
        <div className="messages">
            {messages.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </div>
        <form onSubmit={handleSubmit}>
            <input type="text" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            <button type="submit">Send</button>
        </form>
        </div>
    );
}

export default Chat;
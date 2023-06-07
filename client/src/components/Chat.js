import React, { useState, useEffect } from 'react';

const Chat = ({ user, messages, sendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue.trim() !== '') {
            const signedMessage = `${user.username}: ${inputValue}`
            sendMessage(signedMessage);
            setInputValue('');
        }
    };

    let messagesComponent
    if (messages) {
        messagesComponent = messages.map((message, index) => {
            return (<div key={index}>{message}</div>)
        })
    }

    return (
        <>
            <h5>Chat</h5>
            <div className='input-group message-field grid-x'>
                <form onSubmit={handleSubmit} className="input-field small-10">
                    <input type="text" value={inputValue}  onChange={(event) => setInputValue(event.target.value)} />
                </form>
                <button type="submit" className="button input-group-button small-2">Send</button>
            </div>
            <div className="messages">
                {messagesComponent}
            </div>
        </>
    );
}

export default Chat;
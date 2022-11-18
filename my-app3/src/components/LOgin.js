import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LOgin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/')
        }
    }, [])
    const handlelogin = async () => {
        console.warn("email,password", email, password);
        let result = await fetch('http://localhost:5000/login', {
            method: 'post',
            body: JSON.stringify({ email, password }),
            headers: {
                'content-type': 'application/json'
            }
        });
        result = await result.json();
        console.warn(result);
        if (result.auth) {
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', JSON.stringify(result.auth));
            navigate('/')
        } else {
            alert('Please enter correct details');
        }
    }

    return (
        <div className='login'>
            <h1>Login</h1>
            <input type="email" className='inputBox' value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email' />
            <input type="password" className='inputBox' value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
            <button onClick={handlelogin} className='appbutton'>Login</button>
        </div>
    )
}

export default LOgin
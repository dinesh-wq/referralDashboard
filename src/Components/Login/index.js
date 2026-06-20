import './index.css'
import Cookies from 'js-cookie'
import {Navigate, useNavigate} from 'react-router-dom'
import { useState } from 'react'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const token = Cookies.get('token')
    if (token !== undefined) {
        return <Navigate to="/" />
    }
    const signIn = async (e) => {
        e.preventDefault();
        const url = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin'
        const options = {
            method: 'POST',
            body: JSON.stringify({email, password}),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok) {
            console.log(data)
            Cookies.set('token', data.data.token, {expires: 7})
            navigate('/')
        } else {
            setErrorMessage(data.message)
        }
    }
    return (
        <div className="login-page-background-container">
            <form className="login-page-main-container" onSubmit={signIn}>
                <h1 className="login-page-main-heading">Go Business</h1>
                <p className="login-page-paragraph">Sign in to open your referral dashboard</p>
                <label htmlFor='loginEmail' className="login-page-label">Email</label>
                <input type="email" placeholder='you@example.com' id='loginEmail' className="login-page-input" onChange={event => setEmail(event.target.value)} />
                <label htmlFor='loginPassword' className="login-page-label">Password</label>
                <input type="password" placeholder='Password' id="loginPassword" className="login-page-input" onChange={event => setPassword(event.target.value)} />
                <button type="submit" className="login-page-button">Sign In</button>
                <p className="login-page-error-message">{errorMessage}</p>
            </form>
        </div>
    )
}

export default Login

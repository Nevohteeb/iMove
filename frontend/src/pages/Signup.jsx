import {useState} from 'react'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // bring in signup function, loading state, error from our hook:
    const {signup, error, isLoading} = useSignup()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await signup(email, password)
    }

  return (
    <form className="signup" onSubmit={handleSubmit}>
        <h3>Sign Up:</h3>

        <label>Email:</label>
        <input
            type = "email"
            placeholder= "New Email"
            onChange = {(e) => setEmail(e.target.value)}
            value = {email}
        />

        <label>Password:</label>
        <input
            type = "password"
            placeholder= "New Password"
            onChange = {(e) => setPassword(e.target.value)}
            value = {password}
        />

        <p>Please note password must contain:<br></br>- min 8 characters<br></br>- 1 uppercase<br></br>- 1 lowercase<br></br>- 1 symbol</p>

        <button disabled={isLoading}>Sign Up</button>
        {error && <div className="error">{error}</div>}
    </form>
  )
}

export default Signup
import {useState,useEffect} from 'react';
import {FaSignInAlt} from 'react-icons/fa';
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {login,reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'


function Login() {
  const [formData,setFormData] = useState({
    email: '',
    password:''
  })
  const {email,password} = formData
  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user,isLoading,isError,isSuccess,message} = useSelector((state)=>state.auth)
  useEffect(()=>{

    if (isError){
      toast.error(message)
    }
    if(isSuccess || user){
      navigate('/')
    }

  },[user,isError,isSuccess,message,navigate,dispatch])
  const onSubmit = (e)=>{
    e.preventDefault()
      const userData = {
        email,
        password
      }
      dispatch(login(userData))
      dispatch(reset())
  }
  if (isLoading){
    return (<Spinner/>)
  }

  return (
    <>
    <section className='heading'>
      <h1>
        <FaSignInAlt /> Login
      </h1>
      <p>Please Login</p>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
          <input type='email' className='form-control' id='email' name='email' value={email} placeholder='Enter Your Email' onChange={onChange}/>
          </div>
          <div className='form-group'>
          <input type='password' className='form-control' id='password' name='password' value={password} placeholder='Enter Your Password' onChange={onChange}/>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </section>
    </>
  )
}

export default Login
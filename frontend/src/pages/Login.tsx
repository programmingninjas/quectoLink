import {useState,useEffect} from 'react';
import {FaSignInAlt} from 'react-icons/fa';
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {login,reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import {Button } from "@/components/ui/button"


function Login() {
  const [formData,setFormData] = useState({
    email: '',
    password:''
  })
  const {email,password} = formData
  const onChange = (e:any)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user,isLoading,isError,isSuccess,message} = useSelector((state:any)=>state.auth)
  useEffect(()=>{

    if (isError){
      toast.error(message)
    }
    if(isSuccess || user){
      navigate('/')
    }

  },[user,isError,isSuccess,message,navigate,dispatch])
const onSubmit = (e:any)=>{
    e.preventDefault()
        const userData = {
            email,
            password
        }
        dispatch(login(userData) as any) // Fix dispatch call by casting the action type as 'any'
        dispatch(reset())
}
if (isLoading){
    return (<Spinner/>)
}

  return (
    <>
    <section className='flex heading gap-4 items-center justify-center'>
        <FaSignInAlt /> Login
    </section>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
          <input type='email' className='form-control' id='email' name='email' value={email} placeholder='Enter Your Email' onChange={onChange}/>
          </div>
          <div className='form-group'>
          <input type='password' className='form-control' id='password' name='password' value={password} placeholder='Enter Your Password' onChange={onChange}/>
          </div>
          <div className='form-group'>
            <Button type='submit' className='btn btn-block'>Submit</Button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Login
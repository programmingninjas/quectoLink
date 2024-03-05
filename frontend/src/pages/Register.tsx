import {useState,useEffect} from 'react';
import {FaUser} from 'react-icons/fa';
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {register,reset} from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import { Button } from "@/components/ui/button"


function Register() {
  const [formData,setFormData] = useState({
    name:'',
    email: '',
    password:'',
    confirm_password:''
  })
  const {name,email,password,confirm_password} = formData
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user,isLoading,isError,isSuccess,message} = useSelector((state)=>state.auth)

  const onChange = (e:any)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(()=>{

    if (isError){
      toast.error(message)
    }
    if(isSuccess || user){
      navigate('/')
    }

    dispatch(reset())

  },[user,isError,isSuccess,message,navigate,dispatch])

  const onSubmit = (e:any)=>{
    e.preventDefault()
    if (password!==confirm_password){
      toast.error("Passwords do not match")
    }
    else{
      const userData = {
        name,
        email,
        password
      }
      dispatch(register(userData) as any)
    }
  }
  if (isLoading){
    return (<Spinner/>)
  }
  return (
    <>
    <section className='heading'>
      <h1>
        <FaUser /> Register
      </h1>
      <p>Please create an account</p>
      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
          <input type='text' className='form-control' id='name' name='name' value={name} placeholder='Enter Your Name' onChange={onChange}/>
          </div>
          <div className='form-group'>
          <input type='email' className='form-control' id='email' name='email' value={email} placeholder='Enter Your Email' onChange={onChange}/>
          </div>
          <div className='form-group'>
          <input type='password' className='form-control' id='password' name='password' value={password} placeholder='Enter Your Password' onChange={onChange}/>
          </div>
          <div className='form-group'>
          <input type='password' className='form-control' id='confirm_password' name='confirm_password' value={confirm_password} placeholder='Confirm Your Password' onChange={onChange}/>
          </div>
          <div className='form-group'>
            <Button type='submit' className='btn btn-block'>Submit</Button>
          </div>
        </form>
      </section>
    </section>
    </>
  )
}

export default Register
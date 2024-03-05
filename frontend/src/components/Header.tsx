import {FaSignInAlt,FaSignOutAlt,FaUser} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {logout,reset} from '../features/auth/authSlice';
import { Button } from "@/components/ui/button"

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector((state)=> state.auth)
    console.log(user)
    const onLogout = ()=>{
        dispatch(logout() as any)
        dispatch(reset())
        navigate('/')
    }
  return (
    <header className="header">
        <div className='logo'>
            <Link to='/'>Quecto Link</Link>
        </div>
        <ul>
            {user?(<li>
                <Button className='btn' onClick={onLogout}>
                    <FaSignOutAlt/> Logout
                </Button>
            </li>):(<>            
            <li>
                <Link to='/login'>
                    <FaSignInAlt/> Login
                </Link>
            </li>
            <li>
                <Link to='/register'>
                    <FaUser/> Register
                </Link>
            </li>
            </>)}
        </ul>
    </header>
  )
}

export default Header
import { FaSignInAlt,FaSignOutAlt, FaUser } from 'react-icons/fa';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { Button } from "@/components/ui/button"

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state:any) => state.auth)
    console.log(user)
    const onLogout = () => {
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
                {user ? (<>
                    {location.pathname === '/analytics' ? (<li>
                        <Button className='btn' onClick={()=>{navigate('/')}}>
                            Dashboard
                        </Button>
                    </li>):(<li>
                        <Button className='btn' onClick={()=>{navigate('/analytics')}}>
                            <IoAnalyticsOutline size={20} className='pr-1' /> Analytics
                        </Button>
                    </li>)}
                    <li>
                        <Button className='btn' onClick={onLogout}>
                            <FaSignOutAlt /> Logout
                        </Button>
                    </li>
                    </>) : (<>
                        <li>
                            <Link to='/login'>
                                <FaSignInAlt /> Login
                            </Link>
                        </li>
                        <li>
                            <Link to='/register'>
                                <FaUser /> Register
                            </Link>
                        </li>
                    </>)}
            </ul>
        </header>
    )
}

export default Header
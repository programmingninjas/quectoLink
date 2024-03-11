import { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const RedirectPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resolveShortURL = async () => {
      try {
        const response = await fetch(`https://quecto.fr.to/api/link/${hash}`);
        if (response.status == 404) {
          toast.error('Failed to resolve URL');
          navigate('/');
          return;
        }
        const data = await response.json();
        window.location.replace(data.long); // Redirect the user to the long URL
      } catch (e) {
        toast.error('Error');
        navigate('/'); 
      }
    };

    resolveShortURL();
  }, [hash]);

  return (
    <div className='container'>
      <Spinner />
    </div>
  );
};

export default RedirectPage;

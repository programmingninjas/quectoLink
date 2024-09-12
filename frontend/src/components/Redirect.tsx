import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import { toast } from 'react-toastify';

const RedirectPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const resolveShortURL = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/link/${hash}`);
        if (response.status == 404) {
          toast.error('Failed to resolve URL');
          navigate('/');
          return;
        }
        const data = await response.json();
        let url = data.long;
        // Check if the URL starts with http:// or https://
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          // If not, assume it's a relative path and prepend with http://
          url = "https://" + url;
        }
        window.location.replace(url); // Redirect the user to the long URL
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

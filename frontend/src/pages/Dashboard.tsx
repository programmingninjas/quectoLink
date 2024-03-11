import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'

export default function Dashboard() {
  const [shortUrl, setShortUrl] = useState<string>("Shortened URL");
  const [longUrl, setLongUrl] = useState<string>("");
  const user = useSelector((state: any) => state.auth?.user);
  const navigate = useNavigate();
  let authToken = user?.token;
  let id = user?._id;
  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (!user.token) {
        const userDataString = localStorage.getItem('user');
        if (userDataString !== null) {
          const userData = JSON.parse(userDataString);
          const { token, _id } = userData;
          authToken = token;
          id = _id;
        }
      }
      const response = await fetch('https://quecto.fr.to/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ longUrl, id }),
      });
      if (!response.ok) {
        toast.error('Failed to shorten URL');
      }
      const data = await response.json();
      setShortUrl(data.short);
    } catch (error) {
      toast.error('Error occurred while shortening URL');
    }
  };
  return (
    <div className="bg-gray-50 rounded-lg py-12 lg:py-16">
      <div className="container px-3">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              Shorten links. Share with ease.
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Turn long, complex URLs into short links. Perfect for sharing on social media, in emails, or anywhere you want to make a great impression with a clean, concise link.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Input
                className="rounded-md w-full lg:w-[600px] h-10 font-mono shadow dark:placeholder-gray-300"
                placeholder="Enter your URL"
                type="url"
                value={longUrl}
                onChange={(event) => setLongUrl(event.target.value)}
              />
              <Button className="h-10 sm:px-4 md:px-6 text-sm font-medium" onClick={handleSubmit}>Shorten</Button>
            </div>
            <div className="flex items-center gap-2">
              <Link to={'/' + shortUrl} className="flex items-center justify-center h-full rounded-md w-full lg:w-[200px] p-2 font-mono shadow dark:placeholder-gray-300 hover:text-slate-500">
                {shortUrl}
              </Link>
              <Button className="h-10 sm:px-4 md:px-6 text-sm font-medium" onClick={() => { navigator.clipboard.writeText(window.location.href + shortUrl); toast.success("Copied") }}>Copy</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


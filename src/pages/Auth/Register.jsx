import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMail, IconLock, IconUser } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useApi } from '../../contexts/ApiContext';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const api = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await api.register(name, email, password);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-bgr">
      <div className="absolute w-full h-full transform-gpu blur-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full animate-blob" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="relative w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-xl z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create an Account</h2>
          <p className="text-muted-foreground">Get started with your new account</p>
        </div>
        {error && <div className="p-4 text-white bg-red-500 rounded-md">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-muted-foreground" htmlFor="name">Name</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <IconUser className="w-5 h-5 text-muted-foreground" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 pl-10 text-foreground bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground" htmlFor="email">Email Address</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <IconMail className="w-5 h-5 text-muted-foreground" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full px-4 py-2 pl-10 text-foreground bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground" htmlFor="password">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <IconLock className="w-5 h-5 text-muted-foreground" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 pl-10 text-foreground bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white transition-all duration-300 ease-in-out rounded-md bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <div className="text-sm text-center">
            <p className="text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

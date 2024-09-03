import './App.css';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Create Your Own Friend Profile!</h1>
      {isAuthenticated ? (
        <>
          <Link to="/form" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Go to Form
          </Link>
          <button
            onClick={() => logout()}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Log Out
          </button>
        </>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </button>
      )}
    </div>
  );
}

export default App;

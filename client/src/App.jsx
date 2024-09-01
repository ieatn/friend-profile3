import './App.css';
import { Link } from 'react-router-dom';


function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Create Your Own Friend Profile!</h1>
      <Link to="/form" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go to Form
      </Link>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  // const [count, setCount] = useState(0)
  const [hello, setHello] = useState();

  useEffect(() => {
    const fetchHello = async () => {
      try {
        const response = await axios.get('http://localhost:3002/wel');
        setHello(response.data);
        // alert('Data fetched successfully');
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchHello();
  }, []);
  return (
    <>
    <h1>{hello}</h1>

      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App

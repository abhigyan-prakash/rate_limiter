import React, { useEffect, useState } from 'react';
import { getExampleResponse } from '../../services/example';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    getExampleResponse().then(resp => {
      if (mounted) {
        setMessage(resp.message);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="wrapper">
      <p>Response: {message}</p>
    </div>
  );
}

export default App;

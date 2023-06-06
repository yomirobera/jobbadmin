import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initialize } from './components/keycloak/keycloak';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<div className='loader'></div>)

// Initialize Keycloak
initialize()
  .then(() => { // If No Keycloak Error occurred - Display the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
})
.catch(() => {
  root.render(
    <React.StrictMode>
      <p>Could Not Connect To Keycloak.</p>
    </React.StrictMode>
  );
}); 
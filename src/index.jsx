import client from 'react-dom/client';
import { StrictMode } from 'react';
import App from './app.jsx';


let root = client.createRoot(document.getElementById("root"))
root.render(
    <StrictMode>
        <App/>
    </StrictMode>
)
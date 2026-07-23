import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './app/providers/storeProvider';
import { router } from './app/router';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}

export default App;
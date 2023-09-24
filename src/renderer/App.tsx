import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import CardManagement from './views/CardManagement';

import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account-management" element={<CardManagement />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

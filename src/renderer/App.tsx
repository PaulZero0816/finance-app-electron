import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import { SnackbarProvider } from 'notistack';

export default function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

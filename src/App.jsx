import { Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import Organizing from './pages/Organizing';
import ItemDetail from './pages/ItemDetail';

function NotFound() {
  return (
    <div className="page">
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub">
        That link doesn't go anywhere. <Link className="inline-link" to="/">Back to events</Link>.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/new" element={<CreateEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/edit" element={<EditEvent />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/organizing" element={<Organizing />} />
          {/* Kept from last week's fetch + routing assignment. */}
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />
      <Toast />
    </AppProvider>
  );
}

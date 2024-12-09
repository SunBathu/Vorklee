import { MessageProvider } from './context/MessageContext';
import TopMenu from './components/TopMenu';

export default function RootLayout({ children }) {
  const message = 'Hello, World!'; // Replace with your actual message

  return (
    <div>
      <TopMenu message={message} />
      {children}
    </div>
  );
}
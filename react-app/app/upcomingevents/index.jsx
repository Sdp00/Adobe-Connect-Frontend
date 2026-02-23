// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import UpcomingEvents from './components/app.jsx';
import './styles/index.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <UpcomingEvents />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

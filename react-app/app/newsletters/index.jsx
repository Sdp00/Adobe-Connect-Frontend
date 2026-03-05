// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import Newsletters from './components/newsletters.jsx';
import './styles/newsletters.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <Newsletters />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

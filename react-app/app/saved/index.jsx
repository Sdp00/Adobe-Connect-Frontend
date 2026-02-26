// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import Saved from './components/saved';
import './styles/saved.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <Saved />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

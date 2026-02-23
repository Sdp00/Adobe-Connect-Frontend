// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import Training from './components/training';
import './styles/training.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <Training />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

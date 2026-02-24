import { createRoot } from 'react-dom/client';
import './styles/index.css';
import Feed from './components/app.jsx';

export async function decorateBlock(block) {
  const root = createRoot(block);
  root.render(<Feed />);
}

export default async function decorate(block) {
  await decorateBlock(block);
}

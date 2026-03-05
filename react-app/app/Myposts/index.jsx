import { createRoot } from 'react-dom/client';
import MyPosts from './components/app.jsx';
import './styles/index.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <MyPosts />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

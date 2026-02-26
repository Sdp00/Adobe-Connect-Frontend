// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
import EventsComponent from './components/events';
import './styles/events.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
    <EventsComponent block={block} />,
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

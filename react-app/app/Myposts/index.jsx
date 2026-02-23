// eslint-disable-next-line import/extensions
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line no-unused-vars
<<<<<<<< HEAD:react-app/app/upcomingevents/index.jsx
import UpcomingEvents from './components/app.jsx';
========
import MyPosts from './components/app.jsx';
>>>>>>>> develop:react-app/app/Myposts/index.jsx
import './styles/index.css';

export async function decorateBlock(block) {
  const root = createRoot(block);

  root.render(
<<<<<<<< HEAD:react-app/app/upcomingevents/index.jsx
    <UpcomingEvents />,
========
    <MyPosts />,
>>>>>>>> develop:react-app/app/Myposts/index.jsx
  );
}

export default async function decorate(block) {
  decorateBlock(block);
}

import type { Preview } from '@storybook/react-vite';
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router';
import '../app/app.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    reactRouter: reactRouterParameters({
      location: {
        pathParams: {},
        searchParams: {},
        hash: '',
        state: {},
      },
      routing: {
        path: '/',
        handle: 'Root',
      },
    }),
  },
  decorators: [withRouter],
};

export default preview;
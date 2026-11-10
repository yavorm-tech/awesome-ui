import './preview.css';

import type { Preview } from '@storybook/react-vite';

import { withTheme } from './themeDecorator';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Built-in theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'flowbite', title: 'Flowbite' },
          { value: 'slate-pro', title: 'Slate Pro' },
          { value: 'soft', title: 'Soft' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'flowbite',
    mode: 'light',
  },
  decorators: [withTheme],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    layout: 'fullscreen',
  },
};

export default preview;

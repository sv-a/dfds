module.exports = {
  stories: ['../src/**/**/*.stories.@(mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    "@storybook/addon-essentials",
    'storybook-dark-mode/register',
    'storybook-addon-themes',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
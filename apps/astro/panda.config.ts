import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';
import { theme } from './src/theme';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'cyan',
      grayColor: 'neutral',
      borderRadius: 'lg'
    })
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx,astro}'],

  // Files to exclude
  exclude: [],

  staticCss: {
    recipes: {
      // text: ['*']
    },
    // TODO: WORKAROUND
    css: [
      {
        properties: {
          listStyleType: ['none', 'disc', 'decimal'],
          fontWeight: ['bold'],
          fontSize: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']
        }
      }
    ]
  },
  // Useful for theme customization
  theme: {
    extend: theme
  },

  jsxFramework: 'react',

  // The output directory for your css system
  outdir: './styled-system',

  lightningcss: true
});

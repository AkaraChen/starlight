import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Starlight Docs',
  description: 'Docs for users, developer and maintainers.',
  themeConfig: {
    nav: [{ text: 'Home', link: '/' }],

    sidebar: [
      {
        text: 'User',
        link: '/user/',
        items: [
          {
            text: 'Get Started',
            link: '/user/get-started',
          },
        ],
      },
      {
        text: 'Developer',
        link: '/developer/',
        items: [
          {
            text: 'Get Started',
            link: '/developer/get-started',
          },
          {
            text: 'Concepts',
            link: '/developer/concepts',
          },
          {
            text: 'Life Cycle',
            link: '/developer/life-cycle',
          },
          {
            text: 'Commands',
            link: '/developer/commands',
          },
          {
            text: 'Views',
            link: '/developer/views',
          },
          {
            text: 'Persistence',
            link: '/developer/persistence',
          },
        ],
      },
      {
        text: 'Maintainer',
        link: '/maintainer/',
        items: [
          {
            text: 'Get Started',
            link: '/maintainer/get-started',
          },
          {
            text: 'Persistence',
            link: '/maintainer/persistence',
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    search: {
      provider: 'local',
    },
  },
})

const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid',
  'react-markdown', // Добавляем сюда для транспиляции
  '@uiw/react-markdown-preview', // Добавляем сюда для транспиляции
]);
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withImages = require('next-images');
const removeImports = require('next-remove-imports')();


const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards/healthcare',
        destination: '/dashboards/healthcare/doctor'
      },
      {
        source: '/dashboards',
        destination: '/dashboards/reports'
      },
      {
        source: '/applications',
        destination: '/applications/file-manager'
      },
      {
        source: '/blocks',
        destination: '/blocks/charts-large'
      },
      {
        source: '/management',
        destination: '/management/users'
      }
    ];
  }
};

module.exports = removeImports(
  withImages(
    calendarTranspile({
      i18n: {
        defaultLocale: 'en',
        locales: ['en'],
      },
      webpack: (config, options) => {
        if (!options.isServer) {
          config.plugins.push(new MonacoWebpackPlugin());
        }
        // Возможно, вам потребуется добавить дополнительные настройки webpack здесь
        return config;
      },
      experimental: {
        outputStandalone: true,
      },
      redirects,
    })
  )
);

// module.exports = {
//   experimental: {
//     outputStandalone: true,
//   },
// }


// module.exports = withImages(
//   calendarTranspile({
//     i18n: {
//       defaultLocale: 'en',
//       locales: ['en']
//     },
//     webpack: (config, options) => {
//       if (!options.isServer) {
//         config.plugins.push(new MonacoWebpackPlugin());
//       }

//       // Возможно, вам потребуется добавить дополнительные настройки webpack здесь
      
//       return config;
//     },
//     redirects
//   })
// );

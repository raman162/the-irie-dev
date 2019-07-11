function noWhiteSpace(strings, ...placeholders) {
  return strings.reduce((result, string, i) => (
    result + placeholders[i-1] + string
  )).replace(/\s\s+/g, ' ')
}

module.exports = {
  siteMetadata: {
    title: `The Irie Dev`,
    description: noWhiteSpace`The Irie Dev is a general blog about software
      development and random interesting things that I come accross in life`,
    author: `Raman Walwyn-Venguopal`,
    contactEmail: `raman.walwyn@gmail.com`,
    keywords: [
      'blog', 'caribbean', 'irie', 'antigua', 'dev', 'development', 'software',
      'irie'
    ]
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `The Irie Dev`,
        short_name: `Irie Dev`,
        start_url: `/`,
        background_color: `#0dcfff`,
        theme_color: `#0dcfff`,
        display: `minimal-ui`,
        icon: `src/images/irie-dev-facvicon.png`, // This path is relative to the root of the site.
        crossOrigin: `use-credentials`
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        commonmark: true,
        footnotes: true,
        pedantic: true,
        gfm: true,
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: `language-`,
              showLineNumbers: false,
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}

const { siteTitle, iconUrl, siteUrl } = require("./config");

module.exports = {
  pathPrefix: "/tool",
  siteMetadata: {
    title: siteTitle,
    favicon: iconUrl,
    headerTitle: siteTitle,
    siteUrl: siteUrl,
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-material-ui",
    "gatsby-plugin-image",
    /** gatsby-plugin-google-analyticsだとGA4が使えないので */
    {
      resolve: "gatsby-plugin-google-gtag",
      options: {
        trackingIds: ["G-27K27EFE9V"],
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteTitle,
        short_name: siteTitle,
        start_url: "/",
        background_color: "#333",
        theme_color: "#d23d29",
        display: "standalone",
        icon: iconUrl,
      },
    },
    "gatsby-plugin-offline",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
  ],
};

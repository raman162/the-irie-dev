/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import styles from "./layout.module.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className={styles.container}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className={styles.content}>
        <main>{children}</main>
      </div>
      <footer className={styles.footer}>
        © {new Date().getFullYear()} {data.site.siteMetadata.title}
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

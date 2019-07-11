import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import styles from "./header.module.css"
import Logo from "./logo.js"

const Header = ({ siteTitle }) => (
  <header className={styles.container}>
    <Link to="/">
      <div className={styles.logo}>
        <Logo/>
      </div>
    </Link>
    <Link to="/about/">About</Link>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

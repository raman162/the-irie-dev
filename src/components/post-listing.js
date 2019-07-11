import React from "react"
import { Link } from "gatsby"

import styles from './post-listing.module.css'

export default ({ post }) => (
  <div className={styles.container}>
    <Link to={post.fields.slug}>
      <h2 className={styles.title}>{post.frontmatter.title}</h2>
    </Link>
    <div>{post.frontmatter.date}</div>
    <div className={styles.excerpt}>
      {post.excerpt} -{' '}
      <em>{post.timeToRead} mins</em>
    </div>
  </div>
)

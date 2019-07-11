import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data, pageContext}) => {
  const post = data.markdownRemark
  const { nextPost, previousPost} = pageContext
  return (
    <Layout>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        keywords={post.frontmatter.tags}
      />
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.html}}/>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      timeToRead
      frontmatter {
        title
        description
        tags
        date
      }
    }
  }
`

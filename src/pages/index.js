import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PostListing from "../components/post-listing"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO/>
    <h1>Blog Posts</h1>
    {data.allMarkdownRemark.edges.map(({node}) => (
      <PostListing key={node.id} post={node}/>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {fields:  frontmatter___date, order: DESC},
      filter: {frontmatter: {published: {eq: true}}}
    ) {
      edges {
        node {
          id
          excerpt
          timeToRead
          fields {
            slug
          }
          frontmatter {
            title
            description
            tags
            published
            date(formatString: "MMMM Do YYYY")
          }
        }
      }
    }
  }
`

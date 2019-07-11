import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"

export default ({ data }) => (
  <Layout>
    {data.allMarkdownRemark.edges.map(({node}) => (
      <div key={node.id}>
        <h2>{node.frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{__html: node.html}}/>
      </div>
    ))}
  </Layout>
)

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: {fields:  frontmatter___date, order: DESC},
      filter: {frontmatter: {published: {eq: false}}}
    ) {
      edges {
        node {
          id
          html
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

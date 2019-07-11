import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import styles from './about.module.css'
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => (
  <Layout>
    <SEO title="About" />
    <h1>About</h1>
    <div>
      <div className={styles.img}>
        <Img fluid={data.imageRaman.childImageSharp.fluid} />
      </div>
      <p className={styles.text}>
        Hi! Thanks for visiting{' '}
        <strong>{data.site.siteMetadata.title}</strong>. My name is
        Raman and I'm originally from the beautiful country{' '}
        <a href='https://visitantiguabarbuda.com/'>
          Antigua & Barbuda
        </a>. I'm currently a fullstack software developer in the city of
        Chicago.  When I'm not writing code I enjoy cycling, seeing new places
        and spending time with family and friends{' '}
        <em>
          (especially over a good game of{' '}
          <a href='https://en.wikipedia.org/wiki/Dominoes'>
            dominoes
          </a>
          )
        </em>. If you would like to have a chat I can be reached via email
        at{' '}
        <a href={`mailto:${data.site.siteMetadata.contactEmail}`}>
          {data.site.siteMetadata.contactEmail}
        </a>.
      </p>
    </div>
  </Layout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        contactEmail
        title
      }
    }
    imageRaman: file(relativePath: {eq: "raman.jpg"}) {
      childImageSharp {
        fluid(maxWidth: 300) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`

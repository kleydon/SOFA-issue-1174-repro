import 'reflect-metadata'
import express from 'express'
import * as swaggerUi from 'swagger-ui-express'
import { useSofa, OpenAPI } from 'sofa-api'
import { graphqlHTTP } from 'express-graphql'
import * as tq from 'type-graphql'
import { context, prisma } from './context'
import { resolvers as crudResolvers } from "@generated/type-graphql"
import { resolvers as authResolvers } from './resolvers'

let app, schema;

async function startServer() {

  console.log(authResolvers)

  schema = await tq.buildSchema({ 
    resolvers: [ ...authResolvers, ...crudResolvers ],
    emitSchemaFile: './src/generated/gql-schema.graphql' 
  })

  app = express()


  // Enable request body-parsing
  app.use(express.json())


  // Graphql
  const gqlEndPt = '/graphql'
  app.use(
    gqlEndPt,
    graphqlHTTP({
      schema: schema,
      context: context,
      graphiql: true,
    }),
  )

  // Sofa + Swagger
  const restApiBasePath = '/rest'
  const openApi = OpenAPI({ schema, info: { title: "API Docs", version: "3.0.0" }  })
  app.use(
    restApiBasePath,
    useSofa({
      schema,
      basePath: restApiBasePath,
      context: (request: any) => {
        //Evidence that the request body is received properly:
        console.log('request:')
        console.log('  url:')
        console.log('    ', request.req.originalUrl)
        console.log('  body:')
        console.log('    ', request.req.body)
        return { ...request, prisma }
      },
      onRoute(info:any) {
        openApi.addRoute(info, {
          basePath: restApiBasePath
        })
      }
    })
  )
  const restDocsEndPt = '/rest-docs'
  app.use(restDocsEndPt, swaggerUi.serve, swaggerUi.setup(openApi.get()))

  const port = 3001
  
  app.listen(port)

  console.log('')
  console.log('Server up, on port: ' + port)
  console.log('  http://localhost:' + port + gqlEndPt)
  console.log('  http://localhost:' + port + restApiBasePath)
  console.log('  http://localhost:' + port + restDocsEndPt)
  console.log('')
}

startServer();

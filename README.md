# Repro for SOFA issue #1174

This project reproduces SOFA issue #1174: After SOFA v0.12.0 upgrade, "Variable X of required type String! not provided" errors for multiple mutations.

In this repro project, Express serves: A GraphQL API (through an interactive iGraphQL UI) and a (SOFA) REST API (with interactive Swagger docs/UI), for accessing data stored in an SQLite DB, via the Prisma ORM. CRUD resolvers for db models are auto-generated by Type-Graphql to `node_modules/@generated/type-graphql`, while custom resolvers are defined in `src/resolvers.ts`. The resulting schema can be found in *code* in `src/index.ts`, and in *text* at `src/generated/gql-schema.graphql`.


## Steps to reproduce:

## 1. Install required packages

```
npm install
```

## 2. Set up

```
npm run setup
```
This creates the Prisma (ORM) db client, generates the TypeGraphQl CRUD resolvers, and initializes the SQLite db.

## 3. Start the server

```
npm run dev
```

## 3. Request the endpoint: /rest/login-by-phone

From SwaggerUI (at http://localhost:3001/rest-docs) test the endpoint: /rest/login-by-phone.

With SOFA v0.12.0 (see `package.json`), this request results in the error:
```
Variable "$phone" of required type "String!" was not provided.
```
From server output (see `src/index.ts`), however, it is clear that the `phone` string parameter **has** been received by the server:
```
request:
  url:
     /rest/login-by-phone
  body:
     { phone: 'string' }
```

When the SOFA version is rolled back to v0.11.2 (by editing `package.json`'s "sofa" entry, removing `package-lock.json`, and re-doing steps 1-3 above) - the request above is handled perfectly.

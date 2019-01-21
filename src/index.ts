import {ApolloServer} from "apollo-server-express";
import "reflect-metadata";
import * as Express from "express";
import {buildSchema, formatArgumentValidationError} from 'type-graphql';
import {createConnection} from "typeorm";
import {RegisterResolver} from "./modules/user/Register"


//bootstrap typegraphql 
//https://19majkel94.github.io/type-graphql/docs/bootstrap.html
const main = async() => {

    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
      });
    
    const apolloServer = new ApolloServer({schema, formatError: formatArgumentValidationError});

    const app = Express()

    apolloServer.applyMiddleware({app});
    app.listen(4000, () => {
        console.log("Server started on localhost 4000/graphql")
    })
}

main();
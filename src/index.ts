import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import Express from "express";
import { buildSchema, formatArgumentValidationError } from 'type-graphql';
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from 'cors';

//bootstrap typegraphql 
//https://19majkel94.github.io/type-graphql/docs/bootstrap.html
const main = async () => {
    
    await createConnection();

    const schema = await buildSchema({
        resolvers: [__dirname + '/modules/**/*.ts']
    });

    const apolloServer = new ApolloServer({
        schema,
        formatError: formatArgumentValidationError,
        context: ({ req }: any) => ({ req })
    });

    const app = Express()
    const RedisStore = connectRedis(session);

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000'
        })
    );

    app.use(
        session({
            store: new RedisStore({
                client: redis as any
            }),
            name: "qid",
            secret: "asdfaskdfjasdfasdf",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
            },
        }) 
    );

    apolloServer.applyMiddleware({ app, });
    app.listen(4000, () => {
        console.log("Server started on localhost 4000/graphql")
        
    })
}

main();
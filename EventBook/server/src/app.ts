import express from 'express';
import bodyParser from 'body-parser';
import {graphqlHTTP} from 'express-graphql';
import { buildSchema } from 'graphql';
import schema from './schema.js';
import resolvers from './resolvers.js';
import mongoose from "mongoose";
import isAuth from "./middleware/auth.js";
import cors from "cors";

import {config} from 'dotenv';
config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue: resolvers,
    // graphiql: true // will be reomved when building the app for production
}))

mongoose.connect(process.env.MONGO_DB_URI)
.then(()=> app.listen(4000))
.catch(err=> console.log(err));


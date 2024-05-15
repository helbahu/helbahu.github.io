const express = require('express');
const ExpressError = require('./expressError')

const itemsRoute = require('./items')

const app = express();

app.use(express.json());

app.use('/items',itemsRoute);

app.use((err,req,res,next)=>{
    console.log(err.msg);
    res.status(err.status).send(err.msg)
})

module.exports = app;
const express = require('express');
const ExpressError = require('./expressError')

const router = new express.Router();

const items = require('./fakeDb');

router.get('/',(req,res,next)=>{
    res.json(items);
})

router.get('/:name',(req,res,next)=>{
    for(let i of items){
        if(i.name === req.params.name){
            return res.json(i);
        }
    }
    const e = new ExpressError('Item not found.',400);
    next(e);    
})

router.post('/',(req,res,next)=>{
    let newItem = req.body;
    console.log(newItem)
    items.push(newItem)
    res.send({added:newItem});
})

router.patch('/:name',(req,res,next)=>{
    let updateItem = req.body;
    
    for(let i of items){
        if(i.name === req.params.name){
            let item = i;
            updateItem.name ? item.name = updateItem.name : null;
            updateItem.price ? item.price = updateItem.price : null;
            return res.json({updated:i});
        }
    }
    const e = new ExpressError('Item not found.',400);
    next(e);    
})

router.delete('/:name',(req,res,next)=>{
    for(let i = 0; i<items.length;i++){
        if(items[i].name === req.params.name){
            items.splice(i,1);
            return res.json({message:"Deleted"});
        }
    }
    const e = new ExpressError('Item not found.',400);
    next(e);    
})



module.exports = router;
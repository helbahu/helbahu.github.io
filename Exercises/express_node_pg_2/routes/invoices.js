const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');
const axios = require('axios');

const router = new express.Router();

// GET /invoices : Return info on invoices: like {invoices: [{id, comp_code}, ...]}
router.get('/', async (req,res,next)=>{
    let results = await db.query(`SELECT id,comp_code FROM invoices`);
    return res.json({invoices: results.rows});
})

// GET /invoices/[id] : Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
router.get('/:id', async (req,res,next)=>{
    let results = await db.query(`SELECT id, amt, paid, add_date, paid_date,comp_code FROM invoices WHERE id=$1`,[req.params.id]);
    if(results.rows.length){
        let resultObj = results.rows[0];
        let company = await db.query(`SELECT code,name,description FROM companies WHERE code=$1`,[resultObj.comp_code]);
        delete resultObj.comp_code
        return res.json({invoice: {...resultObj, company: company.rows[0]}});
    }else{
        const err = new ExpressError(`Error: Invoice with id: '${req.params.id}' was not found.`,404)
        return next(err)
    }
})

// POST /invoices : Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.post('/', async (req,res,next)=>{
    const { comp_code, amt } = req.body;
    if(comp_code && amt){
        try{
            let results = await db.query(`INSERT INTO invoices (comp_code,amt)
            VALUES ($1,$2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [comp_code,amt]);

            return res.status(201).json({invoice: results.rows[0]});
        }catch(e){
            const err = new ExpressError(`Error: Invoice with id '${req.params.id}' was not found.`,404)
            return next(err)    
        }

    }else{
        const err = new ExpressError(`Error: Failed to create invoice. Request requires the following parameters: 'comp_code' and 'amt'.`,404)
        return next(err)
    }
})

// PUT /invoices/[id] : Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
router.put('/:id', async (req,res,next)=>{
    const { amt,paid } = req.body;
    console.log(amt,'0000000',paid);
    let queryStatement;    
    let queryList;
    if(amt && typeof(paid) === 'boolean'){
        queryStatement = "amt=$1,paid=$2,paid_date=$3 WHERE id=$4"
        let date = paid ? new Date() : null;
        queryList = [amt,paid,date,req.params.id];
    }else if (amt || typeof(paid) === 'boolean'){
        let date = paid ? new Date() : null;
        queryStatement = amt? "amt=$1 WHERE id=$2" : "paid=$1,paid_date=$2 WHERE id=$3";
        queryList = amt ? [amt,req.params.id] : [paid,date,req.params.id];
    }else{
        const err = new ExpressError(`Error: Failed to update invoice. Request requires the following parameters: 'amt' or 'paid'.`,404)
        return next(err)
    }

    let results = await db.query(`UPDATE invoices SET ${queryStatement} 
                                    RETURNING id,comp_code,amt,paid,add_date,paid_date`,
                                    queryList);

    if(results.rows.length){
        return res.status(201).json({invoice: results.rows[0]});
    }else{
        const err = new ExpressError(`Error: Invoice with id '${req.params.id}' was not found.`,404)
        return next(err)
    }
})

// DELETE /invoices/[id] : Returns: {status: "deleted"}
router.delete('/:id', async (req,res,next)=>{
    let results = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING id`,
    [req.params.id]);
    console.log('RESULTS',results.rows);
    if(results.rows.length === 0){
        const err = new ExpressError(`Error: Invoice with id: '${req.params.id}' was not found.`,404)
        return next(err)    
    }
    return res.status(201).json({status: "deleted"});
    
})


module.exports = router;
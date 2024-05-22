const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');
const axios = require('axios');

const router = new express.Router();


// GET /industries : Return info on invoices: like {industries: [{code, name,companies:[comp_code, ...]}, ...]}
router.get('/', async (req,res,next)=>{
    let results = await db.query(`SELECT i.code,i.name,ci.comp_code AS company_code FROM industries AS i
                                    LEFT JOIN companies_industries AS ci ON i.code = ci.industry_code`);

    let resObj = results.rows.reduce((acc,row)=>{
        if(acc[row.code]){
            row.company_code ? acc[row.code].companies.push(row.company_code) : null;
        }else{
            let company_arr = row.company_code ? [row.company_code] : [];
            acc[row.code] = {code:row.code, 
                            name:row.name, 
                            companies:company_arr};
        }
        return acc;
    },{});

    return res.json({industries: Object.values(resObj)});
})


// POST /industries : Returns: {industry: {code, name}}
router.post('/', async (req,res,next)=>{
    const { code, name } = req.body;
    if(code && name){
        try{
            let results = await db.query(`INSERT INTO industries (code,name)
            VALUES ($1,$2)
            RETURNING code,name`,
            [code,name]);

            return res.status(201).json({industry: results.rows[0]});
        }catch(e){
            return next(e);    
        }

    }else{
        const err = new ExpressError(`Error: Failed to add industry. Request requires the following parameters: 'code' and 'name'.`,404)
        return next(err)
    }
})

// POST /industries : Returns: {industry: {code, name}}
router.post('/:code/companies', async (req,res,next)=>{
    const { code } = req.body;
    if(code){
        try{
            let results = await db.query(`INSERT INTO companies_industries (comp_code,industry_code)
                                        VALUES ($1,$2)
                                        RETURNING comp_code,industry_code`,
                                        [code,req.params.code]);

            return res.status(201).json({added: results.rows[0]});
        }catch(e){
            return next(e);    
        }

    }else{
        const err = new ExpressError(`Error: Failed to add company to industry. Request requires a valid company 'code'.`,404)
        return next(err)
    }
})




module.exports = router;
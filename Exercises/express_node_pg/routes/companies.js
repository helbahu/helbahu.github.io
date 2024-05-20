const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

const router = new express.Router();


// GET /companies : Returns list of companies, like {companies: [{code, name}, ...]}
router.get('/', async (req,res,next)=>{
    let results = await db.query(`SELECT code,name FROM companies`);
    return res.json({companies: results.rows});
})

// GET /companies/[code] : Return obj of company: {company: {code, name, description, invoices: [id, ...]}} 
router.get('/:code', async (req,res,next)=>{
    let results = await db.query(`SELECT code,name,description FROM companies WHERE code=$1`,[req.params.code]);
    if(results.rows.length){
        let resultObj = results.rows[0];
        let invoices = await db.query(`SELECT id, amt, paid, add_date, paid_date FROM invoices WHERE comp_code=$1`,[resultObj.code]);

        return res.json({company: {...resultObj,invoices:invoices.rows}});
    }else{
        const err = new ExpressError(`Error: Company with code: '${req.params.code}' was not found.`,404)
        return next(err)
    }
})

// POST /companies : Returns: {company: {code, name, description}}
router.post('/', async (req,res,next)=>{
    const { code, name, description } = req.body;
    if(code && name && description){
        let results = await db.query(`INSERT INTO companies (code,name,description)
                                        VALUES ($1,$2,$3)
                                        RETURNING code,name,description`,
                                        [code,name,description]);

        return res.status(201).json({company: results.rows[0]});
    }else{
        const err = new ExpressError(`Error: Failed to create company. Request requires the following parameters: 'code', 'name' and 'description'.`,404)
        return next(err)
    }
})

// PUT /companies/[code] : Returns: {company: {code, name, description}}
router.put('/:code', async (req,res,next)=>{
    const { name, description } = req.body;
    let queryStatement;    
    let queryList;
    if(name && description){
        queryStatement = "name=$1,description=$2 WHERE code=$3"
        queryList = [name,description,req.params.code];
    }else if (name || description){
        queryStatement = name? "name=$1 WHERE code=$2" : "description=$1 WHERE code=$2";
        queryList = name ? [name,req.params.code] : [description,req.params.code];
    }else{
        const err = new ExpressError(`Error: Failed to update company. Request requires the following parameters: 'name' and/or 'description'.`,404)
        return next(err)
    }
    
    let results = await db.query(`UPDATE companies SET ${queryStatement}
                                    RETURNING code,name,description`,
                                    queryList);

    return res.status(201).json({company: results.rows[0]});

})


// DELETE /companies/[code] : Returns {status: "deleted"}
router.delete('/:code', async (req,res,next)=>{
        let results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code,name,description`,
        [req.params.code]);
        console.log('RESULTS',results.rows);
        if(results.rows.length === 0){
            const err = new ExpressError(`Error: Company with code: '${req.params.code}' was not found.`,404)
            return next(err)    
        }
        return res.status(201).json({status: "deleted"});
        
})




module.exports = router;
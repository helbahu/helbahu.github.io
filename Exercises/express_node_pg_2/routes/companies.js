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
    try{
        let results = await db.query(`SELECT c.code,c.name,c.description,i.name AS industry_name FROM companies AS c
        LEFT JOIN companies_industries AS ci
            ON c.code = ci.comp_code
        LEFT JOIN industries AS i
            ON ci.industry_code = i.code 
        WHERE c.code=$1`,[req.params.code]);

        if(results.rows.length){
            const {code,name,description} = results.rows[0];
            const industries = results.rows.map(i=>i.industry_name);
        
            let invoices = await db.query(`SELECT id, amt, paid, add_date, paid_date FROM invoices WHERE comp_code=$1`,[code]);
            const company = {code,name,description,industries,invoices:invoices.rows};
    
            return res.json({company});
        }else{
            const err = new ExpressError(`Error: Company with code: '${req.params.code}' was not found.`,404)
            return next(err)
        }
    

    }catch(e){
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
    if(results.rows.length === 0){
        const err = new ExpressError(`Error: Company with code: '${req.params.code}' was not found.`,404)
        return next(err)    
    }

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
process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
const db = require('../db');

const resetDB = ()=>{
    db.query('DROP TABLE IF EXISTS companies_industries') 
    db.query('DROP TABLE IF EXISTS invoices')
    db.query('DROP TABLE IF EXISTS companies') 
    db.query('DROP TABLE IF EXISTS industries') 

    db.query(`CREATE TABLE companies 
                (code text PRIMARY KEY, 
                name text NOT NULL UNIQUE, 
                description text)`)

    db.query(`CREATE TABLE invoices (
                id serial PRIMARY KEY,
                comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
                amt float NOT NULL,
                paid boolean DEFAULT false NOT NULL,
                add_date date DEFAULT CURRENT_DATE NOT NULL,
                paid_date date,
                CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
            )`)

    db.query(`CREATE TABLE industries (
                    code text PRIMARY KEY,
                    name text NOT NULL UNIQUE
            )`)

    db.query(`CREATE TABLE companies_industries (
                comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
                industry_code text NOT NULL REFERENCES industries ON DELETE CASCADE,
                PRIMARY KEY(comp_code,industry_code)
            )`)
            
}
const seedDB = ()=>{
    db.query(`INSERT INTO companies (code,name,description)
                VALUES  ('apple', 'Apple Computer', 'Maker of OSX.'),
                        ('ibm', 'IBM', 'Big blue.'),
                        ('hp', 'Hewlett Packard', 'Computers')`)

    db.query(`INSERT INTO invoices (comp_code, amt, paid, paid_date)
                VALUES  ('apple', 100, false, null),
                        ('apple', 300, true, '2018-01-01'),
                        ('hp', 400, false, null)
            `)  


    db.query(`INSERT INTO industries (code,name)
                VALUES  ('acct','Accounting'),
                        ('tech','Technology'),
                        ('cmp','Computers'),
                        ('appl','Appliances'),
                        ('comm','Communications'),
                        ('am','Automotive');
            `)

    db.query(`INSERT INTO companies_industries (comp_code,industry_code)
                VALUES  ('apple','tech'),
                        ('apple','cmp'),
                        ('ibm','cmp'),
                        ('ibm','comm');
            `)            


}

beforeEach(()=>{
    resetDB();
    seedDB();
})

afterEach(()=>{
    db.query(`DELETE FROM companies_industries`);
    db.query(`DELETE FROM invoices`);
    db.query(`DELETE FROM companies`);
    db.query(`DELETE FROM industries`);
    
})


describe(" GET /companies",()=>{
    test("Get all companies.",async()=>{
        const res = await request(app).get('/companies');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies:[
                                      {"code": "apple","name": "Apple Computer"},
                                      {"code": "ibm","name": "IBM"},
                                      {"code": "hp","name": "Hewlett Packard",}
                                    ]})

    })
})


describe("GET /companies/:code",()=>{
    test("Get a company by code.",async()=>{
        let company_code = 'hp';
        const res = await request(app).get(`/companies/${company_code}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            company: {  code:'hp',
                        name:'Hewlett Packard',
                        description:'Computers',
                        invoices: expect.any(Array),
                        industries: expect.any(Array)}
        })
        expect(res.body.company.invoices.length).toEqual(1)
        expect(res.body.company.invoices[0]).toEqual({
            id:expect.any(Number), amt:400, paid:false, add_date:expect.any(String),paid_date:null}
        )

    })

    test("Get a company by an invalid code.",async()=>{
        let company_code = 'xc';
        const res = await request(app).get(`/companies/${company_code}`);
        expect(res.statusCode).toBe(404);
    })
})


describe("POST /companies",()=>{
    test("Adding a new Company.",async()=>{
        const res = await request(app).post('/companies').send({code:'gm',name:'General Motors',description:"Vehicle company"});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company:{code:'gm',name:'General Motors',description:"Vehicle company"}})

        const res2 = await request(app).get('/companies');
        expect(res2.body.companies.length).toEqual(4);
    })

    test("Adding a new company but missing a parameter.",async()=>{
        const res = await request(app).post('/companies').send({name:'General Motors',description:"Vehicle company"});
        expect(res.statusCode).toBe(404);
    })

})


describe("PUT /companies/:code",()=>{
    test("Update a company by code.",async()=>{
        let company_code = 'hp';
        const res = await request(app).put(`/companies/${company_code}`).send({name:'HP Computers',description:'Describing the company'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: {code: 'hp',name:'HP Computers',description:'Describing the company'}
        })

    })

    test("Update a company by code. Only changing description or name.",async()=>{
        let company_code = 'hp';
        let res = await request(app).put(`/companies/${company_code}`).send({description:'Describing the company'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: {code: 'hp',name:'Hewlett Packard',description:'Describing the company'}
        })

        company_code = 'apple';
        res = await request(app).put(`/companies/${company_code}`).send({name:'Apple'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            company: {code: 'apple',name:'Apple',description:'Maker of OSX.'}
        })

    })

    test("Update a company by invalid code.",async()=>{
        let company_code = 'T';
        const res = await request(app).put(`/companies/${company_code}`).send({name:'Test Invalid Inc',description:'Describing the company'});
        expect(res.statusCode).toBe(404);

    })

})


describe("DELETE /companies/:code",()=>{
    test("Delete a company by code.",async()=>{
        let company_code = 'hp';
        const res = await request(app).delete(`/companies/${company_code}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            {status:'deleted'}
        )

    })

    test("Delete a company by invalid code.",async()=>{
        let company_code = 'T';
        const res = await request(app).delete(`/companies/${company_code}`);
        expect(res.statusCode).toBe(404);

    })

})
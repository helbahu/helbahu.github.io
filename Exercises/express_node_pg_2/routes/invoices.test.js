process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
const db = require('../db');
const { setDefaultHighWaterMark } = require('supertest/lib/test');

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

beforeAll(()=>{
    resetDB();
    seedDB();

})


describe(" GET /invoices",()=>{
    test("Get all invoices.",async()=>{
        const res = await request(app).get('/invoices');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices:[
                                      {id:expect.any(Number),comp_code: "apple"},
                                      {id:expect.any(Number),comp_code: "apple"},
                                      {id:expect.any(Number),comp_code: "hp"}
                                    ]})

    })
})


describe("GET /invoices/:id",()=>{
    test("Get an invoice by id.",async()=>{
        let id = 2;
        const res = await request(app).get(`/invoices/${id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            invoice: {  id: 2,
                        amt:300,
                        paid:true,
                        add_date:expect.any(String),
                        paid_date:expect.any(String),
                        company: expect.any(Object)
                    }
                })
        expect(res.body.invoice.company).toEqual(
            {code: 'apple', name: 'Apple Computer', description: 'Maker of OSX.'}
        )

    })

    test("Get an invoice by an invalid id.",async()=>{
        let id = 0;
        const res = await request(app).get(`/invoices/${id}`);
        expect(res.statusCode).toBe(404);
    })

})


describe("POST /invoices",()=>{
    test("Adding a new invoice.",async()=>{
        const res = await request(app).post('/invoices').send({comp_code:'ibm',amt:1500});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({invoice:{ id:4,
                                            comp_code:'ibm',
                                            amt:1500,
                                            paid:false,
                                            add_date:expect.any(String),
                                            paid_date:null}})

        const res2 = await request(app).get('/companies/ibm');
        expect(res2.body.company.invoices.length).toEqual(1);
    })

    test("Adding a new invoice but missing a parameter.",async()=>{
        const res = await request(app).post('/invoices').send({comp_code:'ibm'});
        expect(res.statusCode).toBe(404);
    })

    test("Adding a new invoice but invalid code.",async()=>{
        const res = await request(app).post('/invoices').send({comp_code:'x',amt:1000});
        expect(res.statusCode).toBe(404);
    })

})


describe("PUT /invoices/:id",()=>{
    test("Update an invoice by id.",async()=>{
        let id = 3;
        const res = await request(app).put(`/invoices/${id}`).send({amt:222,paid:true});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {id:3, comp_code: 'hp',amt:222,paid:true,add_date:expect.any(String),paid_date:expect.any(String)}
        })
    })

    test("Update an invoice by id. Only changing the amount",async()=>{
        let id = 3;
        const res = await request(app).put(`/invoices/${id}`).send({amt:500});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {id:3, comp_code: 'hp',amt:500,paid:true,add_date:expect.any(String),paid_date:expect.any(String)}
        })
    })

    test("Update an invoice by id. Only changing the paid status",async()=>{
        let id = 1;
        const res = await request(app).put(`/invoices/${id}`).send({paid:true});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {id:1, comp_code: 'apple',amt:100,paid:true,add_date:expect.any(String),paid_date:expect.any(String)}
        })
    })

    test("Update an invoice by id. Only changing the paid status to false",async()=>{
        let id = 1;
        const res = await request(app).put(`/invoices/${id}`).send({paid:false});
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            invoice: {id:1, comp_code: 'apple',amt:100,paid:false,add_date:expect.any(String),paid_date:null}
        })
    })

    test("Update an invoice by invalid id.",async()=>{
        let id = 0;
        const res = await request(app).put(`/invoices/${id}`).send({amt:222});
        expect(res.statusCode).toBe(404);
    })

})


describe("DELETE /invoices/:id",()=>{
    test("Delete an invoice by id.",async()=>{
        let id = 3;
        const res = await request(app).delete(`/invoices/${id}`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
            {status:'deleted'}
        )

    })

    test("Delete an invoice by invalid id.",async()=>{
        let id = 0;
        const res = await request(app).delete(`/invoices/${id}`);
        expect(res.statusCode).toBe(404);

    })

})
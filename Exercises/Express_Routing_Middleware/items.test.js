process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb')

beforeEach(()=>{    
    items.push({name:'Fridge',price:1299.99});
    items.push({name:'Table',price:225.50});
    items.push({name:'Chair',price:49.99});
})

afterEach(()=>{
    items.length = 0;
})

describe("GET /items",()=>{
    test("Get all items.",async()=>{
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Table',price:225.50},
            {name:'Chair',price:49.99}
        ])
        
    })
})

describe("POST /items",()=>{
    test("Creating an Item.",async()=>{
        const res = await request(app).post('/items').send({name:'Book',price:29.99});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({added:{name:'Book',price:29.99}})
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Table',price:225.50},
            {name:'Chair',price:49.99},
            {name:'Book',price:29.99}            
        ])
        
    })
})


describe("GET /items/:name",()=>{
    test("Get an item by name.",async()=>{
        let item = 'Table';
        const res = await request(app).get(`/items/${item}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            {name:'Table',price:225.50}
        )        
    })

    test("Get an item by invalid name.",async()=>{
        let item = 'Jacket';
        const res = await request(app).get(`/items/${item}`);
        expect(res.statusCode).toBe(400);
        
    })

})


describe("PATCH /items/:name",()=>{
    test("Update an item by name.",async()=>{
        let item = 'Table';
        const res = await request(app).patch(`/items/${item}`).send({name:'New-Table',price:199.99});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated:{name:'New-Table',price:199.99}
        })        
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'New-Table',price:199.99},
            {name:'Chair',price:49.99}
        ])

    })

    test("Update an item by name. Only changing the name.",async()=>{
        let item = 'Table';
        const res = await request(app).patch(`/items/${item}`).send({name:'New-Table'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated:{name:'New-Table',price:225.50}
        })        
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'New-Table',price:225.50},
            {name:'Chair',price:49.99}
        ])
    })

    test("Update an item by name. Only changing the price.",async()=>{
        let item = 'Table';
        const res = await request(app).patch(`/items/${item}`).send({price:199.99});
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated:{name:'Table',price:199.99}
        })        
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Table',price:199.99},
            {name:'Chair',price:49.99}
        ])

    })

    test("Update an item by invalid name.",async()=>{
        let item = 'Jacket';
        const res = await request(app).patch(`/items/${item}`).send({name:'New-Jacket',price:99.99});;
        expect(res.statusCode).toBe(400);  
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Table',price:225.50},
            {name:'Chair',price:49.99}
        ])
    })
})


describe("DELETE /items/:name",()=>{
    test("Delete an item by name.",async()=>{
        let item = 'Table';
        const res = await request(app).delete(`/items/${item}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
            {message:'Deleted'}
        )        
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Chair',price:49.99}
        ])

    })

    test("Delete an item by invalid name.",async()=>{
        let item = 'Jacket';
        const res = await request(app).delete(`/items/${item}`);
        expect(res.statusCode).toBe(400);
        expect(items).toEqual([
            {name:'Fridge',price:1299.99},
            {name:'Table',price:225.50},
            {name:'Chair',price:49.99}
        ])
        
    })

})


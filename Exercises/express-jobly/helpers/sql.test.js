const { sqlForPartialUpdate, sqlCompaniesFilter, sqlJobsFilter } = require("./sql");

const data = {
    username: 'testuser1',
    firstName: 'Joe',
    lastName: 'Smith',
    email: 'testuser1@testmail.com',
    isAdmin: false,    
};
const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin",
};

describe("Test data to sql function: sqlForPartialUpdate", function () {
  test("Successfully returns string and array", function () {
    const { setCols, values } = sqlForPartialUpdate(data,jsToSql);
    expect(setCols).toEqual('\"username\"=$1, \"first_name\"=$2, \"last_name\"=$3, \"email\"=$4, \"is_admin\"=$5');
    expect(values).toEqual(['testuser1','Joe','Smith','testuser1@testmail.com',false]);
  });

  test("Successfully returns string and array, when given 1 parameter to update", function () {
    const { setCols, values } = sqlForPartialUpdate({firstName: 'Joseph'},jsToSql);
    expect(setCols).toEqual('\"first_name\"=$1');
    expect(values).toEqual(['Joseph']);
  });

  test("Returns an error when data is empty", function () {
    try{
        const { setCols, values } = sqlForPartialUpdate({},jsToSql);
    }catch(e){
        expect(e.status).toEqual(400);
    }
  });

});

describe("Test the sqlCompaniesFilter.", function () {
    test("Successfully returns a sql filtering (WHERE) string. Uses all queries.", function () {
      const sqlString = sqlCompaniesFilter({name: 'company_name',minEmployees: 200, maxEmployees: 500});
      expect(sqlString).toEqual(`WHERE name ILIKE '%company_name%' AND num_employees >= 200 AND num_employees <= 500 `)
    });

    test("Successfully returns a sql filtering (WHERE) string. Uses some of the queries.", function () {
        let sqlString = sqlCompaniesFilter({name: 'company_name'});
        expect(sqlString).toEqual(`WHERE name ILIKE '%company_name%' `)

        sqlString = sqlCompaniesFilter({minEmployees: 200});
        expect(sqlString).toEqual(`WHERE num_employees >= 200 `)

        sqlString = sqlCompaniesFilter({maxEmployees: 500});
        expect(sqlString).toEqual(`WHERE num_employees <= 500 `)

        sqlString = sqlCompaniesFilter({name: 'company_name',maxEmployees:500});
        expect(sqlString).toEqual(`WHERE name ILIKE '%company_name%' AND num_employees <= 500 `)
        
      });

      test("Returns an error when minEmployees > maxEmployees.", function () {
        try{
            const sqlString = sqlCompaniesFilter({name: 'company_name',minEmployees: 800, maxEmployees: 500});
        }catch(e){
            expect(e.status).toBe(400)
            expect(e.message).toBe("Invalid query value: minEmployees must be less than maxEmployees")

        }
      });
        
      test("Returns an empty string when there are no queries.", function () {
        const sqlString = sqlCompaniesFilter({});
        expect(sqlString).toEqual('')        
      });

      test("Returns an error when an invalid query is included.", function () {
        try{
            const sqlString = sqlCompaniesFilter({name: 'company_name',minEmployees: 200, maxEmployees: 500, invalidQuery: 'Invalid query value'});
        }catch(e){
            expect(e.status).toBe(400)
            expect(e.message).toBe("Invalid query.")
        }
      });
        
});
  

describe("Test the sqlJobsFilter.", function () {
    test("Successfully returns a sql filtering (WHERE) string. Uses all queries.", function () {
      const sqlString = sqlJobsFilter({title: 'Software Engineer',minSalary: 70000, companyHandle: 'tech'});
      expect(sqlString).toEqual(`WHERE title ILIKE '%Software Engineer%' AND salary >= 70000 AND company_handle ILIKE '%tech%' `)
    });

    test("Successfully returns a sql filtering (WHERE) string. Uses some of the queries.", function () {
        let sqlString = sqlJobsFilter({title: 'software'});
        expect(sqlString).toEqual(`WHERE title ILIKE '%software%' `)

        sqlString = sqlJobsFilter({minSalary: 70000});
        expect(sqlString).toEqual(`WHERE salary >= 70000 `)

        sqlString = sqlJobsFilter({hasEquity: true});
        expect(sqlString).toEqual(`WHERE equity != '0' `)

        sqlString = sqlJobsFilter({companyHandle: 'tech'});
        expect(sqlString).toEqual(`WHERE company_handle ILIKE '%tech%' `)

        sqlString = sqlJobsFilter({title: 'software',minSalary: 70000});
        expect(sqlString).toEqual(`WHERE title ILIKE '%software%' AND salary >= 70000 `)
        
      });

      test("Returns an error when minSalary < 0 or not a number.", function () {
        try{
            const sqlString = sqlJobsFilter({title: 'software',minSalary: -800});
        }catch(e){
            expect(e.status).toBe(400)
            expect(e.message).toBe("Invalid query value: minSalary must be a number greater than or equal to 0.")
        }

        try{
            const sqlString = sqlJobsFilter({title: 'software',minSalary: 'money'});
        }catch(e){
            expect(e.status).toBe(400)
            expect(e.message).toBe("Invalid query value: minSalary must be a number greater than or equal to 0.")
        }
        
      });
        
      test("Returns an empty string when there are no queries.", function () {
        const sqlString = sqlJobsFilter({});
        expect(sqlString).toEqual('')        
      });

      test("Returns an error when an invalid query is included.", function () {
        try{
            const sqlString = sqlJobsFilter({title: 'software',minSalary: 70000, invalidQuery: 'Invalid query value'});
        }catch(e){
            expect(e.status).toBe(400)
            expect(e.message).toBe("Invalid query.")
        }
      });
        
});


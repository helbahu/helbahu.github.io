const { BadRequestError } = require("../expressError");


// This function helps to update rows in tables without requiring all fields. Returns an sql string and array of parameters to update. 
// The function takes a data object and a jsToSql object (used to convert js object key names to the appropriate sql column name).
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  //If there is no data, the update function will throw an error. 
  if (keys.length === 0) throw new BadRequestError("No data");

  // This will change the array of keys to sql parameters.
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

// This function is used for filtering for companies based on queries. If there are no queries it would return an empty string.
// Currently there are 3 permitted queries: name, minEmployees, and maxEmployees.
function sqlCompaniesFilter(queries) {
  if(!queries)return '';
  const queryKeys = Object.keys(queries);
  if(queryKeys.length === 0)return '';

  // If an invalid query is inputted, this will throw an error. 
  const queryInvalid = queryKeys.some(query => !['name','minEmployees','maxEmployees'].includes(query))
  if(queryInvalid){
    throw new BadRequestError("Invalid query.");
  }
  
  let sqlStr = 'WHERE ';
  if(queries.name){
    sqlStr += `name ILIKE '%${queries.name}%' `;
  }
  if(queries.minEmployees && queries.maxEmployees && queries.minEmployees > queries.maxEmployees){
    throw new BadRequestError("Invalid query value: minEmployees must be less than maxEmployees");
  }
  if(queries.minEmployees){
    sqlStr === 'WHERE ' ?
      sqlStr += `num_employees >= ${queries.minEmployees} `:
      sqlStr += `AND num_employees >= ${queries.minEmployees} `;
  }
  if(queries.maxEmployees){
    sqlStr === 'WHERE ' ?
      sqlStr += `num_employees <= ${queries.maxEmployees} `:
      sqlStr += `AND num_employees <= ${queries.maxEmployees} `;
  }
  
  return sqlStr;
}

// This function is used for filtering for jobs based on queries. If there are no queries it would return an empty string.
// Currently there are 2 permitted queries: title, minSalary, and companyHandle.
function sqlJobsFilter(queries) {
  if(!queries)return '';
  const queryKeys = Object.keys(queries);
  if(queryKeys.length === 0)return '';

  // If an invalid query is inputted, this will throw an error. 
  const queryInvalid = queryKeys.some(query => !['title','minSalary','hasEquity','companyHandle'].includes(query))
  if(queryInvalid){
    throw new BadRequestError("Invalid query.");
  }
  
  let sqlStr = 'WHERE ';
  if(queries.title){
    sqlStr += `title ILIKE '%${queries.title}%' `;
  }
  if((queries.minSalary && `${parseFloat(queries.minSalary)}` === 'NaN') || (queries.minSalary && queries.minSalary < 0)){
    throw new BadRequestError("Invalid query value: minSalary must be a number greater than or equal to 0.");
  }
  if(queries.minSalary){
    sqlStr === 'WHERE ' ?
      sqlStr += `salary >= ${queries.minSalary} `:
      sqlStr += `AND salary >= ${queries.minSalary} `;
  }
  if(queries.hasEquity){
    sqlStr === 'WHERE ' ?
      sqlStr += `equity != '0' `:
      sqlStr += `AND equity != '0' `;    
  }
  if(queries.companyHandle){
    sqlStr === 'WHERE ' ?
      sqlStr += `company_handle ILIKE '%${queries.companyHandle}%' `:
      sqlStr += `AND company_handle ILIKE '%${queries.companyHandle}%' `;
  }
  
  return sqlStr;
}


module.exports = { sqlForPartialUpdate, sqlCompaniesFilter, sqlJobsFilter };

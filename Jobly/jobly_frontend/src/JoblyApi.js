import axios from "axios";
//**************************************************************

const BASE_URL = process.env.REACT_APP_BASE_URL;

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  static filter (data) {
    let str = '?';
    for(let key of Object.keys(data)){
        if(data[key]){
            str = str + `${key}=${data[key]}&`;
        }
    }
    str = str.slice(0,str.length-1);
    return str;
  }

  //Company Paths
    /** Get details on a company by handle. */
    static async getCompany(handle) {
        let res = await this.request(`companies/${handle}`);
        return res.company;
    }

    /** Get companies. */
    static async getCompanies(filterData=null) {
        let filterStr='';
        if(filterData){
            filterStr = this.filter(filterData);
            console.log(filterStr);
        }

        let res = await this.request(`companies${filterStr}`);
        return res.companies;
    }

    // Add Company
    static async addNewcompany(data) {
        let res = await this.request(`companies`,data,'post');
        return res.company;
    }

    // Update Company
    static async updateCompany(handle,data) {
        let res = await this.request(`companies/${handle}`,data,'patch');
        return res.company;
    }

    // Delete Company
    static async deleteCompany(handle) {
        let res = await this.request(`companies/${handle}`,{},'delete');
        return res;
    }


  //Jobs Paths
    //Add New Job (only Admin)
    static async addNewJob(data) {
        let res = await this.request(`jobs`,data,'post');
        return res.job;
    }
    //Update Job (only Admin)
    static async updateJob(jobId,data) {
        let res = await this.request(`jobs/${jobId}`,data,'patch');
        return res.job;
    }
    //Delete Job (only Admin)
    static async deleteJob(jobId) {
        let res = await this.request(`jobs/${jobId}`,{},'delete');
        return res;
    }

    /** Get details on a Job by id */
    static async getJob(jobId) {
        let res = await this.request(`jobs/${jobId}`);
        return res.job;
    }

    /** Get Jobs */
    static async getJobs(filterData=null) {
        let filterStr='';
        if(filterData){
            filterStr = this.filter(filterData);
            console.log(filterStr);
        }
        let res = await this.request(`jobs${filterStr}`);
        return res.jobs;
    }


  //AUTH signup and login paths
    /** register new user */
    static async register(data) {
        let res = await this.request(`auth/register`,data,'post');
        return res.token;    
    }

    /** authenticate user */
    static async authenticate(data) {
        let res = await this.request(`auth/token`,data,'post');
        return res.token;
    }


  // USER paths
    // Get all Users
    static async getUsers(username) {
        let res = await this.request(`users`);
        return res.users;
    }

    // Get User
    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    // Update User
    static async updateUser(username,data) {
        let res = await this.request(`users/${username}`,data,'patch');
        return res.user;
    }

    // Add User (only admins)
    static async addUser(data) {
        let res = await this.request(`users`,data,'post');
        return res.user;
    }

    // Delete User
    static async deleteUser(username) {
        let res = await this.request(`users/${username}`,{},'delete');
        return res;
    }


  // Apply to job
  static async apply(username,jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`,{},'post')
    return res;
  }

}

export default JoblyApi;
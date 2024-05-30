/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");
const ExpressError = require("./expressError");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getformattedStartAt() {
    return moment(this.startAt).format('MMMM Do YYYY, h:mm a');
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
          `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }

  /** save this reservation. */

  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.customerId,this.numGuests,this.startAt,this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE reservations SET num_guests=$1, start_at=$2, notes=$3
             WHERE id=$4`,
        [this.numGuests, this.startAt,this.notes,this.id]
      );
    }
  }

  get notes(){
    return this._notes;
  }
  set notes(val){
    val ? this._notes = val : this._notes = "";
  }

  get numGuests(){
    return this._numGuests;
  }
  set numGuests(val){
    if(val < 1){
      throw new ExpressError("Number of guests must be at least 1.",404);
    }
    this._numGuests = val;
  }

  get startAt(){
    return this._startAt;
  }  
  set startAt(val){
    if(val instanceof Date){
      this._startAt = val;    
    }else{
      throw new ExpressError("Invalid input. Date and time required.",404);      
    }
  }

  get customerId(){
    return this._customerId;
  }
  set customerId(val){
    if(this._customerId){
      throw new ExpressError("Cannot change customer id for a reservation.",404);      
    }else{
      this._customerId = val;
    }
  }


}


module.exports = Reservation;

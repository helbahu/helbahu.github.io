
it('should calculate the monthly rate correctly', function () {
  let values = {
    amount:45000,
    years:4,
    rate:0.04
  }
  expect(calculateMonthlyPayment(values)).toEqual(`1016.06`);
  
  values.amount = 20000;
  values.years = 2;
  values.rate = 0.08;

  expect(calculateMonthlyPayment(values)).toEqual(`904.55`);
  
});


it("should return a result with 2 decimal places", function() {
  let values = {
    amount:95331,
    years:2,
    rate:0.024
  }

  let x = calculateMonthlyPayment(values);
  expect(x[x.length-3]).toEqual(`.`);

});

/// etc

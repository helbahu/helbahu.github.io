window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("calc-form");
  if (form) {
    setupIntialValues();
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      update();
    });
  }
});

function getCurrentUIValues() {
  return {
    amount: +(document.getElementById("loan-amount").value),
    years: +(document.getElementById("loan-years").value),
    rate: +(document.getElementById("loan-rate").value),
  }
}

// Get the inputs from the DOM.
// Put some default values in the inputs
// Call a function to calculate the current monthly payment
function setupIntialValues() {
    let amt = document.getElementById("loan-amount");
    let yrs = document.getElementById("loan-years");
    let rate = document.getElementById("loan-rate");
    amt.setAttribute(`value`,10000);
    yrs.setAttribute(`value`,1);
    rate.setAttribute(`value`,0.05);
    update();
}

// Get the current values from the UI
// Update the monthly payment
function update() {
    let vals = getCurrentUIValues();
    let monthlyPayment = calculateMonthlyPayment(vals);

    //This checks if there are invalid values:
    if(vals.years <= 0){
      return alert(`Please input a valid term (in years).`);
    }else if(vals.rate <= 0){
      return alert(`Please input a valid interest rate.`);
    }
    
    updateMonthly(monthlyPayment);
}

// Given an object of values (a value has amount, years and rate ),
// calculate the monthly payment.  The output should be a string
// that always has 2 decimal places.
function calculateMonthlyPayment(values) {
    //Loan amount (the principle)
    let P = values.amount;
    //Total number of payments
    let n = values.years*12;
    //Monthly interest rate
    let i = values.rate/12;

    //Monthly payment calculation:
    let monthlyPayment = (P*i)/(1 - (1+i)**(-n));
    return `${Math.round(monthlyPayment*100)/100}`;

}

// Given a string representing the monthly payment value,
// update the UI to show the value.
function updateMonthly(monthly) {
    document.getElementById(`monthly-payment`).innerText = `$${monthly}`;
}

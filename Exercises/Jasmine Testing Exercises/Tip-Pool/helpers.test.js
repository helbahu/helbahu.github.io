describe(`This JS file contains calculation functions`,function(){

    beforeEach(function () {
        billAmtInput.value = 260;
        tipAmtInput.value = 40;
        let curPayment = createCurPayment();

        paymentId += 1;
        allPayments['payment' + paymentId] = curPayment;
        appendPaymentTable(curPayment);
        updateSummary();

        //------------------------------

        billAmtInput.value = 190;
        tipAmtInput.value = 60;
        curPayment = createCurPayment();

        paymentId += 1;
        allPayments['payment' + paymentId] = curPayment;
        appendPaymentTable(curPayment);
        updateSummary();


    });


    it(`sumPaymentTotal(type) accepts 'tipAmt', 'billAmt', 'tipPercent' and sums total from allPayments objects`,function(){
        expect(sumPaymentTotal('tipAmt')).toEqual(100);
        expect(sumPaymentTotal('billAmt')).toEqual(450);
        expect(sumPaymentTotal('tipPercent')).toEqual(47);
        
    })

    it(`calculateTipPercent(billAmt, tipAmt) converts the bill and tip amount into a tip percent`,function(){
        billAmt =335;
        tipAmt =60;
        expect(calculateTipPercent(billAmt, tipAmt)).toEqual(18);

        billAmt =200;
        tipAmt =0;
        expect(calculateTipPercent(billAmt, tipAmt)).toEqual(0);

    })

    it(`appendTd(tr, value) expects a table row element, appends a newly created td element from the value`,function(){
        let serverTbody = document.querySelector('#serverTable tbody');
        let tr = document.createElement(`tr`);

        appendTd(tr, `test text`);
        serverTbody.append(tr);

        let x = document.querySelector(`#serverTable tbody tr td`).innerText;
        expect(x).toEqual(`test text`);

    })


    afterEach(function(){
        paymentId = 0;
        allPayments = {};
        paymentTbody.innerHTML = ``;
        for(let td of summaryTds){
            td.innerHTML = ``;
        }
        document.querySelector('#serverTable tbody').innerHTML = ``;

    })




})

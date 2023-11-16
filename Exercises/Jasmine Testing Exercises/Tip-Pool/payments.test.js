describe(`This will handle the submitted payment information.`,function(){

    beforeEach(function () {
        billAmtInput.value = 260;
        tipAmtInput.value = 40;

    });
    



    it(`createCurPayment() will make an object with 3 keys: billAmt, tipAmt, and tipPercent.`,function(){
        let paymentInfo = createCurPayment();
        expect(paymentInfo.billAmt).toEqual(`260`);
        expect(paymentInfo.tipAmt).toEqual(`40`);
        expect(paymentInfo.tipPercent).toEqual(15);
        
    })
    
    it(`createCurPayment() will not create an object if billAmtInput or tipAmtInput are invalid.`,function(){
        billAmtInput.value = 260;
        tipAmtInput.value = ``;
        let paymentInfo = createCurPayment();
        expect(paymentInfo).toEqual(undefined);

        billAmtInput.value = -60;
        tipAmtInput.value = 20;
        paymentInfo = createCurPayment();
        expect(paymentInfo).toEqual(undefined);        
    })

    it(`appendPaymentTable(curPayment) will append payment information to paymentTbody`,function(){
        let curPayment = createCurPayment();
        appendPaymentTable(curPayment);
        let tds = document.querySelectorAll(`#payment0 td`);
        expect(tds[0].innerText).toEqual(`$260`);
        expect(tds[1].innerText).toEqual(`$40`);
        expect(tds[2].innerText).toEqual(`15%`);

    })


    it(`updateSummary() creates a table row element to calculate the sum of all payment (bills and tips) and the average percentage of tips`,function(){
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

        expect(summaryTds[0].innerText).toEqual(`$450`);
        expect(summaryTds[1].innerText).toEqual(`$100`);
        expect(summaryTds[2].innerText).toEqual(`24%`);

    })



    afterEach(function(){
        paymentId = 0;
        allPayments = {};
        paymentTbody.innerHTML = ``;
        for(let td of summaryTds){
            td.innerHTML = ``;
        }

    })




})









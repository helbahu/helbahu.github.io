function createAccount(pin, amount=0) {
    return {
        accountPin: pin,
        balance: amount,
        checkBalance: function (pin) {
            if(pin !== this.accountPin) return "Invalid PIN.";
            return `$${this.balance}`;
        },
        deposit: function (pin,depositAmount) {
            if(pin !== this.accountPin) return "Invalid PIN.";
            this.balance += depositAmount; 
            return `Succesfully deposited $${depositAmount}. Current balance: $${this.balance}.`;
        },
        withdraw: function (pin,withdrawAmount) {
            if(pin !== this.accountPin) return "Invalid PIN.";

            if(this.balance >= withdrawAmount){
                this.balance -= withdrawAmount; 
                return `Succesfully withdrew $${withdrawAmount}. Current balance: $${this.balance}.`;
            }else{
                return `Withdrawal amount exceeds account balance. Transaction cancelled.`;
            }

        },
        changePin: function (pin,newPin) {
            if(pin !== this.accountPin) return "Invalid PIN.";
            this.accountPin = newPin;
            return "PIN successfully changed!";
        }

    }



}

module.exports = { createAccount };

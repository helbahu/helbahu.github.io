function curriedAdd(total) {
    if(total || total === 0){
        return (nextVal) => {
            if(nextVal !== undefined) return curriedAdd(nextVal+total)
            return total;
        };
    }else{
        return total || 0;
    }

}

module.exports = { curriedAdd };

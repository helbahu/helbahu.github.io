


function fetch_func(entry,link,callback){

    let obj = {
        method: "POST",
        credentials: "include", //Note : thsi just includes thigs like cookies in the response
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers ({
            "content-type": "application/json"
        })
    };

    fetch(`${window.origin}/${link}`, obj)
    .then(res => res.json()).then(r => {
        callback(r);
    })
};




async function getCupcakes(link,callback) {
    const response = await fetch(`${window.origin}/${link}`);
    const cupcakes = await response.json();
    callback(cupcakes);
}

getCupcakes('/api/cupcakes',function(c){

    c.cupcakes.forEach((cupcake)=>{
        console.log(cupcake);
        let str = `${cupcake.size} ${cupcake.flavor} cupcake, rating: ${cupcake.rating}`;
        
        let imgdiv = $('<div>').addClass('div1').css("background-image", `url(${cupcake.image})`);
        let textdiv = $('<div>').addClass('div2').text(str);
        let row_li = $('<div>').addClass('li_row').append(imgdiv).append(textdiv);

        let li = $('<li>').append(row_li);        
        li.appendTo($('.cupcakes_list'));
    })

})
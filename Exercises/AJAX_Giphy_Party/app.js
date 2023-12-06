console.log("Let's get this party started!");

let gifArr = [];
if(localStorage.getItem(`myGifs`)){
    gifArr = JSON.parse(localStorage.getItem(`myGifs`));
    gifArr.forEach(url =>{
        $(`<img>`).addClass("col-md-4 col-lg-3 mt-5").attr(`src`,url).appendTo(`#gifContainer`);
    })
}


function addGif(arr){
    let randomNum = Math.floor(Math.random()*arr.length);
    let url = arr[randomNum].images.original.url
    $(`<img>`).addClass("col-md-4 col-lg-3 mt-5").attr(`src`,url).appendTo(`#gifContainer`);
    saveGif(url);
}
function saveGif(url){
    gifArr.push(url);
    localStorage.setItem(`myGifs`,JSON.stringify(gifArr));
}


async function getGif(searchVal){
    try{
        let gif = await axios.get(`http://api.giphy.com/v1/gifs/search`,{params:{q: searchVal, "api_key": "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym"}});
        let arr = gif.data.data;
        addGif(arr);
    
    }catch(e){
        alert(`Gif not found. Try another prompt!`);
    }
}


$(`#gifForm`).on(`submit`,function(e){
    e.preventDefault();
    let searchVal = $(`#gifSearch`).val();

    getGif(searchVal);
    $(`#gifForm`).get(0).reset();

})

$(`#deleteAll`).on(`click`,function(){
    $(`#gifContainer`).empty();
    localStorage.removeItem(`myGifs`);
})
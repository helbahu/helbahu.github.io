let movieObj = {};
let num =0;

class AddMovie {
    constructor(title,rating,comments,id){
        this.title = title;
        this.rate = rating;
        this.com = comments;
        this.dropdown = $(`<span>`).addClass(`showDetails badge badge-primary`).css("background-color","rgb(94, 94, 94)").append("<span>&#11033</span>");
        this.removeMovie = `<span class="removeMovie badge badge-warning" style="background-color: rgb(255, 35, 35);">&#10005</span>`;
        this.id = id;
    }

    createLi(){
        let li = $(`<li>`).addClass("container alert alert-dark col-8 mx-auto mt-4 mb-4");
        li.attr('id', this.id);
        let div1 = $(`<div>`).addClass("row");
        div1.append(`<div class="col-5">${this.title}</div>`);
        div1.append(`<div class="col-5">Rating: ${this.rate}</div>`);
        let detailsSection = $(`<div>`).addClass("col-1").append(this.dropdown);        
        div1.append(detailsSection);
        let removeTarget = $(`<div>`).addClass("removeMovie col-1").append(this.removeMovie);
        div1.append(removeTarget);
        li.append(div1);
        let div2 = $(`<div>`).addClass("deetails col-11 mx-auto collapse").text(this.com);

        li.append(div2);
        $(`#movieList ul`).append(li);
    }

}
$(`#movieList`).on(`click`,`li .removeMovie`,function(e){
        $(this).closest(`li`).remove();
        delete movieObj[$(this).closest(`li`).attr(`id`)];
        localStorage.setItem(`savedMovies`,JSON.stringify(movieObj));

})

if(localStorage.getItem(`savedMovies`)){
    movieObj = JSON.parse(localStorage.getItem(`savedMovies`));
    for(let key in movieObj){
        [movieTitle,movieRating,comments] = movieObj[key];
        const newMovie = new AddMovie(movieTitle,movieRating,comments,key);
        newMovie.createLi();
    }
}

const testNum = num =>{
    while(movieObj[`movie${num}`] !== undefined){
        num++
    }
    return num;
};


$(`#addBtn`).on(`click`,function(){
    $(`#form-container`).toggleClass(`inactive`);
    $(`#form-container form`)[0].reset();
})

$(`#form-container form`).on(`submit`,function(e){
    e.preventDefault();
    const movieTitle = $(`#movieTitle`)[0].value;
    const movieRating = $(`#movieRating`)[0].value;
    const comments = $(`#addComments`)[0].value;
    let n = testNum(num);
    const newMovie = new AddMovie(movieTitle,movieRating,comments,`movie${n}`);
    newMovie.createLi();
    movieObj[`movie${n}`] =[movieTitle,movieRating,comments];
    localStorage.setItem(`savedMovies`,JSON.stringify(movieObj));
    $(`#form-container`).toggleClass(`inactive`);
    $(`#form-container form`)[0].reset();

})

$(`#movieList`).on(`mousedown`,`li .showDetails`,function(e){
    $(this).closest(`.row`).next().toggleClass(`collapse`).toggleClass(`collapse.show`);
})

$(`#sort`).on(`click`,function(e){
    let valu = e.target.value;
    $(`#movieList ul`).empty();
    let arr = Object.values(movieObj);
    let arrIdx = Object.keys(movieObj);

    const appendArr = (arr) =>{
        for(let movie of arr){
            const newMovie = new AddMovie(movie[0],movie[1],movie[2],arrIdx[arr.indexOf(movie)]);
            newMovie.createLi();
        }    
    }

    
    if(valu === `default`){
        appendArr(arr);
    }

    if(valu === `sort-AlphabeticalAtoZ`){
        let sorted = arr.sort((a,b) =>{
            let z;
            (a[0][0].toLowerCase()<b[0][0].toLowerCase())? z=-1:z=1;
            return z;
        })
        appendArr(sorted);
    }

    if(valu === `sort-AlphabeticalZtoA`){
        let sorted = arr.sort((a,b) =>{
            let z;
            (a[0][0].toLowerCase()<b[0][0].toLowerCase())? z=1:z=-1;
            return z;
        })
        appendArr(sorted);
    }

    if(valu === `sort-Rating10to0`){
        let sorted = arr.sort((a,b) =>{
            return b[1]-a[1];
        })
        appendArr(sorted);
    }

    if(valu === `sort-Rating0to10`){
        let sorted = arr.sort((a,b) =>{
            return a[1]-b[1];
        })
        appendArr(sorted);
    }


})

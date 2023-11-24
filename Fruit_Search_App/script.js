const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

//This function accepts a string and filters for all the elements in the fruit array that contain the string, returning the filtered array.
const search = str => {
	let results = fruit.filter(f => f.toLowerCase().includes(str));
	return results.sort((a , b)=> a.toLowerCase().indexOf(str) - b.toLowerCase().indexOf(str));
}

//This function gets the value of the input from the search bar, generates a sorted array by using the search function (above), and activates the showSuggestions function. 
const searchHandler = e => {
	let str = input.value.toLowerCase();
	let results = search(str);
	showSuggestions(results, str);
}

//The showSuggestions function accepts an array and a string, and appends each list element to the suggestions dropdown with the inputVal bold.
const showSuggestions = (results, inputVal) =>{	
	suggestions.innerHTML = ``;
	if(inputVal === ``)return;

	results.forEach(result =>{
		let li = document.createElement(`li`);
		let idx = result.toLowerCase().indexOf(inputVal);
		li.innerHTML = `${result.slice(0,idx)}<b>${result.slice(idx,idx+inputVal.length)}</b>${result.slice(idx+inputVal.length)}`;
		suggestions.append(li);
	})

}

//This function is activated once a suggestion is clicked. It will change the input value to the text of the selected input and it will clear the suggestions. 
function useSuggestion() {
	input.value = document.querySelector(`.selected`).innerText;
	suggestions.innerHTML = ``;
}


//Additional Functions

//This function highlights the item that is hovered over when the mouse is over.
const highlightSuggestion = e => {
	if(document.querySelector(`.selected`))highlight(document.querySelector(`.selected`),`remove`);
	highlight(e.target);
	suggestions.addEventListener('mouseout', e =>{
		highlight(e.target,`remove`);
	});
}
const highlight = (first,second) => {
	if(second === undefined){
		addHighlight(first);
	}else if(second === `remove`){
		removeHighlight(first);
	}else{
		removeHighlight(first);
		addHighlight(second);
	}
}
const addHighlight = li => {
	li.classList.add(`selected`);
	li.style.backgroundColor = `hsl(${n2*0.9}, 100%, 35%)`;
	li.style.border = `white solid 0.2vh`;
	li.style.color = `white`;
}
const removeHighlight = li => {
	li.classList.remove(`selected`);
	li.style.backgroundColor = ``;
	li.style.border = ``;
	li.style.color = ``;
}

//Scroll function
const scroll = (direction,arr,idx) => {
	let scroll = document.querySelector(`.suggestions`);
	let liHt = (arr[0].clientHeight)*(idx - 4);

	idx < (scroll.scrollTop/(arr[0].clientHeight))?scroll.scrollTo(0,(arr[0].clientHeight)*(idx)):null;
	idx > (scroll.scrollTop/(arr[0].clientHeight) + 5)?scroll.scrollTo(0,liHt):null;


	if((direction === `down`)&&(idx >=5)){
		(scroll.scrollTop/(arr[0].clientHeight) + 5) === idx ?scroll.scrollTo(0,liHt):null;
		(idx === arr.length-1)?scroll.scrollTo(0,0):null;
						
	}
	if(direction === `up`){
		(scroll.scrollTop/(arr[0].clientHeight)) === idx ? scroll.scrollTo(0,(arr[0].clientHeight)*(idx-1)):null;
		(idx === 0)? scroll.scrollTo(0,(arr[0].clientHeight)*(arr.length - 6)):null;
	}


}


//Event Listeners 
input.addEventListener('keyup',(e)=>{
	if((e.key !== `ArrowUp`)&&(e.key !== `ArrowDown`)&&(e.key !== `Enter`)){
		searchHandler(e);
	}
});
suggestions.addEventListener('mousedown', (e => useSuggestion()));
suggestions.addEventListener('mouseover', highlightSuggestion);
input.addEventListener(`keydown`,(e)=>{
	if((e.key === `ArrowUp`)||(e.key === `ArrowDown`)){
		let liList = [...document.querySelectorAll(`.suggestions ul li`)]; 
		if((e.key === `ArrowDown`)&&(liList.length > 0)){
			if(liList.every(li => !li.classList.contains(`selected`))){
				highlight(liList[0]);
			}else{
				let idx = liList.findIndex(li => li.classList.contains(`selected`));
				(idx < liList.length - 1) ? highlight(liList[idx],liList[idx+1]):highlight(liList[idx],liList[0]);

				scroll(`down`,liList,idx);
				

			}
		}else if((e.key === `ArrowUp`)&&(liList.length > 0)){
			if(liList.every(li => !li.classList.contains(`selected`))){
				highlight(liList[liList.length-1]);
				scroll(`down`,liList,liList.length-2);

			}else{
				let idx = liList.findIndex(li => li.classList.contains(`selected`));
				(idx > 0) ? highlight(liList[idx],liList[idx-1]):highlight(liList[idx],liList[liList.length-1]);
				scroll(`up`,liList,idx);

			}
		}	
	}

	if(e.key === `Enter`){
		useSuggestion();
	}

})



//Background Animation
let body = document.querySelector(`body`);
let n1 = 17;
let n2 = 70;
let rev;
setInterval(()=>{
	if(n1 === 17)rev = false;
	if(n1 === 117)rev = true;
	body.style.background = `linear-gradient(40deg,hsl(${n1}, 100%, 59%),hsl(${n2}, 100%, 59%))`;
	if(!rev){
		n1 +=2;
		n2 +=3;	
	}else{
		n1 -=2;
		n2 -=3;	
	}

},500)



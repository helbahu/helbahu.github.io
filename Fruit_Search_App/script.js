const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

//This function accepts a string and filters for all the elements in the fruit array that contain the string, returning the filtered array.
const search = str => {
	let results = fruit.filter(f => f.toLowerCase().includes(str))
	return sortArr(results,str);
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
function useSuggestion(e) {
	input.value = e.target.innerText;
	suggestions.innerHTML = ``;
}


//Additional Functions

//This function sorts the array to be in order of relevance (the earlier the string occurs in the element) to the typed string. 
const sortArr = (arr,str) => {
	let array = [];
	let n = 0;
	while (array.length !== arr.length){
		arr.forEach(fruit =>{
			if(fruit.toLowerCase().indexOf(str) === n){
				array.push(fruit);
			}
		})
		n++;
	}
	return array;
}

//This function highlights the item that is hovered over when the mouse is over.
const highlightSuggestion = e => {
	e.target.style.backgroundColor = `hsl(${n2*0.9}, 100%, 35%)`;
	e.target.style.color = `white`;
	suggestions.addEventListener('mouseout', e =>{
		e.target.style.backgroundColor = ``;		
		e.target.style.color = ``;
	});
}



//Event Listeners 
input.addEventListener('keyup', searchHandler);
suggestions.addEventListener('mousedown', useSuggestion);
suggestions.addEventListener('mouseover', highlightSuggestion);




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

},400)



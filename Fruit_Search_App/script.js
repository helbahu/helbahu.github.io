const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];

const search = str => {
	let results = fruit.filter(f => f.toLowerCase().includes(str))
	return sortArr(results,str);
}

const searchHandler = e => {
	let str = input.value.toLowerCase();
	let results = search(str);
	showSuggestions(results, str);
}

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

function useSuggestion(e) {
	input.value = e.target.innerText;
	suggestions.innerHTML = ``;
}

//Additional Functions
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

const highlightSuggestion = e => {
	e.target.style.backgroundColor = `hsl(${n2*0.9}, 100%, 35%)`;
	e.target.style.color = `white`;
	suggestions.addEventListener('mouseout', e =>{
		e.target.style.backgroundColor = ``;		
		e.target.style.color = ``;
	});
}




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



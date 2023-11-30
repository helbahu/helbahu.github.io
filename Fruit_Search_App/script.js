//-----------------------------------------------------------------------Global variables
const input = document.querySelector('#fruit');
const suggestions = document.querySelector('.suggestions ul');

const fruit = ['Apple', 'Apricot', 'Avocado 🥑', 'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry', 'Boysenberry', 'Currant', 'Cherry', 'Coconut', 'Cranberry', 'Cucumber', 'Custard apple', 'Damson', 'Date', 'Dragonfruit', 'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Gooseberry', 'Grape', 'Raisin', 'Grapefruit', 'Guava', 'Honeyberry', 'Huckleberry', 'Jabuticaba', 'Jackfruit', 'Jambul', 'Juniper berry', 'Kiwifruit', 'Kumquat', 'Lemon', 'Lime', 'Loquat', 'Longan', 'Lychee', 'Mango', 'Mangosteen', 'Marionberry', 'Melon', 'Cantaloupe', 'Honeydew', 'Watermelon', 'Miracle fruit', 'Mulberry', 'Nectarine', 'Nance', 'Olive', 'Orange', 'Clementine', 'Mandarine', 'Tangerine', 'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Plantain', 'Plum', 'Pineapple', 'Pomegranate', 'Pomelo', 'Quince', 'Raspberry', 'Salmonberry', 'Rambutan', 'Redcurrant', 'Salak', 'Satsuma', 'Soursop', 'Star fruit', 'Strawberry', 'Tamarillo', 'Tamarind', 'Yuzu'];



//-----------------------------------------------------------------------Classes and Functions 
//Dropdown Suggestions class
class Dropdown {
	constructor(arr,input,suggestions){
		this.arr = arr;
		this.input = input;
		this.suggestions = suggestions;

	}

	//This function accepts a string and filters for all the elements in the fruit array that contain the string, returning the filtered array.
	search(str){
		let results = this.arr.filter(f => f.toLowerCase().includes(str));
		return results.sort((a , b)=> a.toLowerCase().indexOf(str) - b.toLowerCase().indexOf(str));
	}

	//The showSuggestions function accepts an array and a string, and appends each list element to the suggestions dropdown with the inputVal bold.
	showSuggestions(results, inputVal){	
		this.suggestions.innerHTML = ``;
		if(inputVal === ``)return;

		results.forEach(result =>{
			let li = document.createElement(`li`);
			let idx = result.toLowerCase().indexOf(inputVal);
			li.innerHTML = `${result.slice(0,idx)}<b>${result.slice(idx,idx+inputVal.length)}</b>${result.slice(idx+inputVal.length)}`;
			this.suggestions.append(li);
		})

	}


	//This function gets the value of the input from the search bar, generates a sorted array by using the search function (above), and activates the showSuggestions function. 
	searchHandler(e){
		let str = this.input.value.toLowerCase();
		let results = this.search(str);
		this.showSuggestions(results, str);
	}

	//This function is activated once a suggestion is clicked. It will change the input value to the text of the selected input and it will clear the suggestions. 
	useSuggestion() {
		this.input.value = document.querySelector(`.selected`).innerText;
		this.suggestions.innerHTML = ``;
	}

	
	activateDropDown(){
		this.input.addEventListener('keyup',(e)=>{
			if((e.key !== `ArrowUp`)&&(e.key !== `ArrowDown`)&&(e.key !== `Enter`)){
				this.searchHandler(e);
			}
		});
		this.suggestions.addEventListener('mousedown', (e => this.useSuggestion()));
		
	}

}



//Additional Functions

//Highlighting class
class HighlightDropdown {
	constructor(dropdown,styleObj){
		this.dropdown = dropdown;
		this.styleObj = styleObj;
	}

	addHighlight(li){
		li.classList.add(`selected`);
		for(let key in this.styleObj){
			li.style[key] = this.styleObj[key];
		}
	}
	removeHighlight(li){
		li.classList.remove(`selected`);
		for(let key in this.styleObj){
			li.style[key] = ``;
		}
	}

	highlight(first,second){
		if(second === undefined){
			this.addHighlight(first);
		}else if(second === `remove`){
			this.removeHighlight(first);
		}else{
			this.removeHighlight(first);
			this.addHighlight(second);
		}
	}

	//This function highlights the item that is hovered over when the mouse is over.
	highlightSuggestion(e){
		if(document.querySelector(`.selected`))this.highlight(document.querySelector(`.selected`),`remove`);
		this.highlight(e.target);
		this.dropdown.addEventListener('mouseout', e =>{
			this.highlight(e.target,`remove`);
		});
	}

	activateHighlights(){
		this.dropdown.addEventListener('mouseover', this.highlightSuggestion.bind(this));
	}

}

//Scroll class
class ArrowScroll{
	constructor(input,scrollSection,highlightRef,dropdownRef){
		this.input = input;
		this.scroll = scrollSection;
		this.highlight = highlightRef.highlight.bind(highlightRef);
		this.useSuggestion = dropdownRef.useSuggestion.bind(dropdownRef);
	}

	scrollFunc(direction,arr,idx){
		(idx < (this.scroll.scrollTop/(arr[0].clientHeight)))||(idx > (this.scroll.scrollTop/(arr[0].clientHeight) + 6))? arr[idx].scrollIntoView():null;                      
	
		if((direction === `down`)&&(idx >=5)){
			Math.round(this.scroll.scrollTop/(arr[0].clientHeight) + 5) === idx ? arr[idx-4].scrollIntoView():null;
			(idx === arr.length-1)?this.scroll.scrollTo(0,0):null;
							
		}
		if(direction === `up`){
			(Math.round(this.scroll.scrollTop/(arr[0].clientHeight)) === idx)&&(idx !== 0) ? arr[idx-1].scrollIntoView():null; 
			(idx === 0)? this.scroll.scrollTo(0,(arr[0].clientHeight)*(arr.length - 6)):null;
		}
		
	}

	activateScroll(){
		this.input.addEventListener(`keydown`,(e)=>{
			if((e.key === `ArrowUp`)||(e.key === `ArrowDown`)){
				let liList = [...document.querySelectorAll(`.suggestions ul li`)]; 
				if((e.key === `ArrowDown`)&&(liList.length > 0)){
					if(liList.every(li => !li.classList.contains(`selected`))){
						this.highlight(liList[0]);
						this.scrollFunc(null,liList,0);
					}else{
						let idx = liList.findIndex(li => li.classList.contains(`selected`));
						(idx < liList.length - 1) ? this.highlight(liList[idx],liList[idx+1]):this.highlight(liList[idx],liList[0]);
		
						this.scrollFunc(`down`,liList,idx);
		
					}
				}else if((e.key === `ArrowUp`)&&(liList.length > 0)){
					if(liList.every(li => !li.classList.contains(`selected`))){
						this.highlight(liList[liList.length-1]);
						this.scrollFunc(`down`,liList,liList.length-2);
		
					}else{
						let idx = liList.findIndex(li => li.classList.contains(`selected`));
						(idx > 0) ? this.highlight(liList[idx],liList[idx-1]):this.highlight(liList[idx],liList[liList.length-1]);
						this.scrollFunc(`up`,liList,idx);
		
					}
				}	
			}
		
			if(e.key === `Enter`){
				this.useSuggestion();
			}
		
		})

	}

}


//Background and highlight Animation function
const colorHighlight = (a,b,callback) => {
	let rev;
	let x = setInterval(()=>{
		if(a === 17)rev = false;
		if(a === 117)rev = true;
		callback(a,b);
		if(!rev){
			a +=2;
			b +=3;	
		}else{
			a -=2;
			b -=3;	
		}
	},500);
}


//------------------------------------------------------------------Executed Functions-------------------------------------------------------------

//Enable Dropdown Suggestions
const fruitDropDown = new Dropdown(fruit,input,suggestions);
fruitDropDown.activateDropDown();


//Activate Highlighting functionality
const fruitHighlightStyleObj = {
	border: `white solid 0.2vh`,
	color: `white`
}
colorHighlight(17,63,function(a,b){
	fruitHighlightStyleObj.backgroundColor = `hsl(${b}, 100%, 35%)`;
});
const highlightFruitDropdown = new HighlightDropdown(suggestions,fruitHighlightStyleObj);
highlightFruitDropdown.activateHighlights();


//Enable Arrow Scrolling
let scrollSection = document.querySelector(`.suggestions`);
const scrollSuggestions = new ArrowScroll(input,scrollSection,highlightFruitDropdown,fruitDropDown);
scrollSuggestions.activateScroll();



//Background Animation
const bgColor = (a,b) => {
	let body = document.querySelector(`body`);
	return body.style.background = `linear-gradient(40deg,hsl(${a}, 100%, 59%),hsl(${b}, 100%, 59%))`;
}
colorHighlight(17,70,bgColor);


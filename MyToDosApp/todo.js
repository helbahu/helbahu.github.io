let numItems = 0;
let todoObj = {};
let themeObj =["light1","light2","dark1","dark2"];

//Functions

    //Create Item Function
    function createItem(item,n){
        let todoItem = document.createElement(`div`);
        todoItem.setAttribute(`class`,`todoItem`);
        let check = document.createElement(`input`);
        check.setAttribute(`type`,`checkbox`);
        check.setAttribute(`class`,`checkBox`);
        let titleElement = document.createElement(`h2`);
        titleElement.innerText = item.title;
        titleElement.setAttribute(`class`,`titleElement`);

        if(item.completed === true){
            titleElement.classList.add(`completed`);
            check.checked = true;
        } 

        let dropDown = document.createElement(`button`);
        dropDown.innerHTML = `<span>&#11206</span>`;
        dropDown.setAttribute(`class`,`dropDown`);
        dropDown.setAttribute(`value`,`dropDown`);
        let deleteItem = document.createElement(`button`);
        deleteItem.innerHTML = `<span>&#11199</span>`;
        deleteItem.setAttribute(`class`,`deleteItem`);
        deleteItem.setAttribute(`value`,`deleteItem`);
        todoItem.append(check);
        todoItem.append(titleElement);
        todoItem.append(dropDown);
        todoItem.append(deleteItem);

        let section = document.querySelector(item.priority);
        section.append(todoItem);
        
        todoItem.setAttribute(`data-num`,n);

        let dropDownBox = document.createElement(`div`);
        dropDownBox.classList.add(`inactiveDropDownBox`);
        dropDownBox.innerText = item.details;
        todoItem.append(dropDownBox);
        
        todoItem.addEventListener(`click`,function(event){
        
            if((event.target.value === `dropDown`)||(event.target.parentElement.value === `dropDown`)){
                console.log(`DropDown WORKS`);
                dropDown.innerHTML = `<span>&#11205</span>`
                dropDown.setAttribute(`value`, `dropUp`);
                dropDownBox.classList.toggle(`inactiveDropDownBox`);
                dropDownBox.classList.toggle(`dropDownBox`);
            }
            if((event.target.value === `dropUp`)||(event.target.parentElement.value === `dropUp`)){
                console.log(`DropDown WORKS`);
                dropDown.innerHTML = `<span>&#11206</span>`
                dropDown.setAttribute(`value`, `dropDown`);
                dropDownBox.classList.toggle(`inactiveDropDownBox`);
                dropDownBox.classList.toggle(`dropDownBox`);
            }
    
            if((event.target.value === `deleteItem`)||(event.target.parentElement.value === `deleteItem`)){
                todoObj = JSON.parse(localStorage.getItem(`todoObj`));
                console.log(todoItem.getAttribute(`data-num`));
                delete todoObj[parseFloat(todoItem.getAttribute(`data-num`))];
                console.log(todoObj);
                localStorage.setItem(`todoObj`,JSON.stringify(todoObj));        
                todoItem.remove();
            }
            if(event.target.value === `on`){
                titleElement.classList.toggle(`completed`);
                let x = item.completed;            
                x === true? x = false:x=true;
                todoObj = JSON.parse(localStorage.getItem(`todoObj`));
                todoObj[todoItem.getAttribute(`data-num`)].completed = x;
                localStorage.setItem(`todoObj`,JSON.stringify(todoObj));        

            }
            
    
        })
    }

    // localStorage Info
    function saveItem(todo,num){
        if(localStorage.getItem(`todoObj`)){
             todoObj = JSON.parse(localStorage.getItem(`todoObj`));
             todoObj[num] = todo;
             num++;
             localStorage.setItem(`numItems`, num);
             localStorage.setItem(`todoObj`,JSON.stringify(todoObj));
             console.log(todo);
         }else{
             todoObj[num] = todo;
             num++;
             localStorage.setItem(`numItems`, num);
             localStorage.setItem(`todoObj`,JSON.stringify(todoObj));
             console.log(todo);
         }
     }
 

//These conditionals check if there is a saved value for numItems and todoObj.
    if(localStorage.getItem(`numItems`)){
        numItems = localStorage.getItem(`numItems`);
        console.log(`We have store numItems`);
    }

    if(localStorage.getItem(`todoObj`)){
        console.log(`We have store todoObj`);
        console.log(`YAHOO`);
        todoObj = JSON.parse(localStorage.getItem(`todoObj`));
        for(let key in todoObj){
            let singleTodo = todoObj[key];
            createItem(singleTodo,key);
        }
    }

//These conditionals check if a name and theme are saved to localStorage.
    if(localStorage.getItem(`theme`)){
        let body = document.querySelector(`body`);
        body.setAttribute(`class`,localStorage.getItem(`theme`));
    }
    if(localStorage.getItem(`name`)){
        let nameHeading = document.querySelector(`.mainHeading`);
        nameHeading.innerText = `Welcome ${localStorage.getItem(`name`)}!`;
        let formBox = document.querySelector(`.activeForm`);
        formBox.setAttribute(`class`,`inactiveForm`);
    }


//This looks for any buttons clicked in the app.
document.addEventListener(`click`,function(event){
    let valu = event.target.value; 
    //This checks for if one of the theme options are selected. If so, it will change the class of the body (thus changing the style). 
    if(themeObj.indexOf(valu) > -1){
        let body = document.querySelector(`body`);
        body.setAttribute(`class`,valu);
    
    }
    //This checks when the changePreferences button is pressed. This will activate the preference form to change name or theme. 
    if(valu === "changePreferences"){
        let formBox = document.querySelector(`#preferenceFormBox`);
        console.log(formBox);
        formBox.classList.toggle(`inactiveForm`);
        formBox.classList.toggle(`activeForm`);
        let form = document.querySelector(`#preferenceForm`);
        form.reset();
    }
    //This checks when the add Item is clicked. This will open the todoForm. 
    if(valu === "addItem"){
        let itemForm = document.querySelector(`#todoForm`);
        let form = document.querySelector(`#todoForm form`);
        itemForm.classList.toggle(`inactiveFormToDo`);
        form.reset();
    }

})

//This executes when the preferenceForm is submitted. It will save the theme and name to localStorage.
let form =document.querySelector(`#preferenceForm`);
form.addEventListener(`submit`,function(event){
    event.preventDefault();
    let theme = document.querySelector(`body`).getAttribute(`class`);
    let name = document.querySelector(`#name`).value;
    let nameHeading = document.querySelector(`.mainHeading`);
    nameHeading.innerText = `Welcome ${name}!`;
    localStorage.setItem(`theme`,theme);    
    localStorage.setItem(`name`,name);
    let formBox = document.querySelector(`.activeForm`);
    formBox.setAttribute(`class`,`inactiveForm`);

})

//This executes when the todoForm is submitted. It will add a todo Item to the list and save it to localStorage. 
let addTodoForm = document.querySelector(`.todoForm`);
addTodoForm.addEventListener(`submit`,function(event){
    event.preventDefault();
    let singleTodo = {};
    let title = document.querySelector(`#titleToDo`).value;
    singleTodo.title = title;
    let details = document.querySelector(`#otherDetails`).value;
    singleTodo.details = details;
    let priority = document.querySelector(`#priority`).value;
    singleTodo.priority = priority;
    singleTodo.completed = false;

    let itemForm = document.querySelector(`#todoForm`);
    itemForm.classList.add(`inactiveFormToDo`);

    createItem(singleTodo,numItems);
    saveItem(singleTodo,numItems);
    addTodoForm.reset();

})


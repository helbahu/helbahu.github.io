setTimeout(() => {
    document.querySelector('.flash_messages').innerHTML = "";
}, 5000);


document.querySelector('.tagscontainer').addEventListener('click',function(e){
    let tag = e.target
    let t = tag.classList.contains('clickedTag')
    let data = tag.dataset.input;

    if(!data)return;
    if(t){
        tag.classList.remove('clickedTag');
        let id = tag.dataset.input;
        document.getElementById(id).checked = false;

    }else{
        tag.classList.add('clickedTag');
        let id = tag.dataset.input;
        document.getElementById(id).checked = true;
    }
})
$(`button[name = selected_survey]`).on(`click`,function(e){
    valu = e.target.value;
    $(`#startsurvey`).val(valu);

})

const form = $(`.select_survey_form`)
form.on(`submit`,function(e){
    v = $(`#startsurvey`).val(); 
    if(v == ``){
        e.preventDefault();
        alert(`Please select a survey.`);
    }

})


class SelectedStyle{
    constructor(btngroup,style){
        this.btngroup = `[data-btngroup = ${btngroup}]`;
        this.style = style;
    }
    set(){
        let style = this.style;
        let btns =  $(this.btngroup);
        $(`body`).on(`click`,this.btngroup,function(e){
            [...btns].forEach(btn =>{
                $(btn).css("background-color",``).removeClass(`selectedLvl`);
            })
            $(e.target).css("background-color",style).addClass(`selectedLvl`);
        })
    }

}

const selectSurvey = new SelectedStyle("select_survey","#7575cc")
selectSurvey.set()


// FLASH MESSAAGES timer
setTimeout(() => {
    $('.rightnav').empty()
}, 5000);

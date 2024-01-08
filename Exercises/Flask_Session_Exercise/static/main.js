//Global vars
let timeId;

$(`button[name = selected_survey]`).on(`click`,function(e){
    valu = e.target.value;
    $(`#startsurvey`).val(valu);

})

const form = $(`.select_survey_form`)
form.on(`submit`,function(e){
    v = $(`#startsurvey`).val(); 
    if(v == ``){
        e.preventDefault();
        if(timeId){
            clearTimeout(timeId);
            $(`.info1` ).remove();
        }
        $(`<p>`).addClass(`warning info1`).text(`Please select a survey.`).appendTo($(".flashmessage"));
        timeId = setTimeout(() => {
            $(".flashmessage").empty()
        }, 5000);
        
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
    $(".flashmessage").empty()
}, 5000);

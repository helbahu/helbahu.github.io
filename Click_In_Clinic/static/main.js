let api_link = 'https://api.endlessmedical.com/v1/dx'
let App_Id;
let App_Key;
let SessionID = "6I9BoQHKXuMHJ3oh";

if($('.flash_messages p').get().length > 0){
    setTimeout(() => {
        console.log($('.flash_messages p').get())
        console.log('CLEARED MESSAGES!!!!!!!!!!!!!!!!')
        $('.flash_messages').empty();
    }, 5000);    
}








function fetch_func(entry,link,callback){

    let obj = {
        method: "POST",
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers ({
            "content-type": "application/json",
        })
    };

    fetch(`${api_link}/${link}`, obj)
    .then(res => res.json()).then(r => {
        callback(r);
    })

}

function flashMessage(msg){
    let flash_message = $('<p>').addClass('alert alert-success').text(msg)

    $('.flash_messages').append(flash_message);
    setTimeout(() => {
        $('.flash_messages').empty();
    }, 5000);
}


function fetch_item(entry,link,callback){

    let obj = {
        method: "POST",
        credentials: "include", //Note : thsi just includes thigs like cookies in the response
        body: JSON.stringify(entry),
        cache: "no-cache",
        headers: new Headers ({
            "content-type": "application/json"
        })
    };

    fetch(`${window.origin}/${link}`, obj)
    .then(res => res.json()).then(r => {
        callback(r);
    })

}
// $('symptomform').on('submit',(e)=>{
//     e.preventDefault()
//     console.log('testtt')
// })

function current_question(){
    console.log('CURR ---------------------------------------------------')

    let curr_question = $('#questions').val()

    let entry = {
        "name": curr_question        
    };
    fetch_item(entry,"get_question_details",(resp)=>{
        let question = resp.result_question;
        if(question){
            console.log(question);
            console.log($('#answer').attr('type'));

            if(question["type"] === "categorical"){
                $('#answer').remove();
                let select_input = $('<select>').addClass("form-control").attr('id','answer').attr('name','answer');
                for(let choice of question["choices"]){
                    let newopt = $('<option>').attr("value",choice['value']).text(choice['laytext']);
                    select_input.append(newopt);
                };
                $('.answer-parent').append(select_input);
            }else if(question["type"] === "integer" || question["type"] === "double"){
                $('#answer').remove();
                let attr_obj = {
                    "class":"form-control",
                    "type":"number",
                    "id": "answer",
                    "name": "answer",
                    "min":question["min"],
                    "max":question["max"],
                };
                if(question["type"] === "double"){
                    attr_obj['step'] = question["step"];
                };
                let int_input = $('<input>').attr(attr_obj);
                $('.answer-parent').append(int_input);

            };



        }else{
            $('#answer').remove();
            let select_input = $('<select>').addClass("form-control").attr('id','answer').attr('name','answer');
            let newopt = $('<option>').attr("value","None").text("None");
            select_input.append(newopt);
            $('.answer-parent').append(select_input);

        };

    })



}

current_question();


$('#symptomList').on("click",(e)=>{
    console.log('SYMPTOMLIST ---------------------------------------------------')

    let label = e.target.value;

    if(label !== "Other"){
        $('.otherInput').remove();

        let entry = {
            "filter_query": label        
        };

        fetch_item(entry,"filter_questions",(resp)=>{
            // console.log(resp.message);

            let x = $("#questions");
            if(resp.result_questions){
                x.empty();
                for(let [v,q] of resp.result_questions){
                    let newopt = $('<option>').attr("value",v).text(q);
                    x.append(newopt);
        
                };
        
            };
            current_question();

        })

    }else{
        let l = $('#symptomList');
        $('.otherInput').remove();
        let div = $('<div>').addClass('row otherInput mx-1');
        let inp = $('<input>').addClass('form-control col-10').attr('placeholder','Type your symptom if not found').attr('name','other_input');
        let button = $('<button>').addClass('btn btn-success col-2 searchBtn').attr('type','button').text('Search')
        div.append(inp);
        div.append(button);
        l.after(div);

    };


    
});

$('form').on('click','.searchBtn',(e)=>{
    console.log('FORM CLICK ---------------------------------------------------')

    let label = $('#symptomList').val();
    let input_val = $('.otherInput input').val();

    let entry = {
        "filter_query": label,
        "search_phrase": input_val
    };

    fetch_item(entry,"filter_questions",(resp)=>{
        // console.log(resp.message);
        let x = $("#questions");
        if(resp.result_questions){
            x.empty();
            if(resp.result_questions.length === 0){
                let noneOpt = $('<option>').attr("value","None").text("None");
                x.append(noneOpt);    
            }else{
                for(let [v,q] of resp.result_questions){
                    let newopt = $('<option>').attr("value",v).text(q);
                    x.append(newopt);
        
                };
            };
            current_question();

        };

    })



});

$('#questions').on("click",(e)=>{

    current_question();
});


// ADD PATIENT OR DOCTOR POPUP FORMS
const addDoctorPatient = (path,add_user_type='patient') => {
    let other_user_type;

    add_user_type === 'patient' ? other_user_type = 'doctor' : other_user_type = 'patient';

    $(`.add_${add_user_type}`).on("click",(e)=>{

        let css_obj = {
            "position": "absolute",
            "top": '5vh',
            "left": '20vw',
            "z-index": 2,
    
        };

        // Checks if the form is active so you won't get two of the same form.
        $(`#add_${add_user_type}_pop_up`).remove()

        let add_user_pop_up = $('<div>').attr("id",`add_${add_user_type}_pop_up`).css(css_obj).addClass('alert col-11 col-md-6');
        let form = $('<form>').addClass('row flex-column align-items-center').attr("id",`add_${add_user_type}_to_${other_user_type}_form`);
        let label = $('<p>').text(`Select a ${add_user_type} to add`).attr('for',`add_new_${add_user_type}`);
        let select_input = $('<select>').addClass("form-control").attr('id',`add_new_${add_user_type}`);

        fetch_item({},`get_${add_user_type}s`,(resp)=>{
            add_user_pop_up.addClass(`alert-${resp.theme}`)
            
            let all_users;
            if(add_user_type === 'patient'){
                all_users = resp.all_patients;
                element_type = 'Birthdate'
            }else if(add_user_type === 'doctor'){
                all_users = resp.all_doctors;
                element_type = 'License'
            }

            

            for(let [username,name,element] of all_users){
                let user = $('<option>').attr("value",username).text(`${name} (${element_type}: ${element})`);
                select_input.append(user);
    
            };
            let form_group = $('<p>').addClass('form-group');
            form_group.append(label);
            form_group.append(select_input);
            form.append(form_group);
            let btn_group =  $('<div>').addClass('row col-8 col-md-6 justify-content-between');
            let submit_btn = $('<button>').text(`Add ${add_user_type}`).addClass('btn btn-success');        
            let cancel_btn = $('<button>').text('Cancel').addClass(`btn btn-danger cancel_add_${add_user_type}`).attr('type','button');        
            btn_group.append(submit_btn).append(cancel_btn);
            form.append(btn_group);
            add_user_pop_up.append(form);
            $('.main_container').append(add_user_pop_up);
        })
        
        form.on('submit',(e)=>{
            e.preventDefault();

            let entry;

            if(add_user_type === 'patient'){
                entry = {
                    'patient': select_input.val()
                };    
            }else if(add_user_type === 'doctor'){
                entry = {
                    'doctor': select_input.val()
                };
    
            }
    
            fetch_item(entry,path,(resp)=>{
                let message = resp.message;
                console.log(message);
                let user_list;
                let element_type;
                if(add_user_type === 'patient'){
                    user_list = resp.hcp_patients;
                    element_type = 'Birthdate'
                }else if(add_user_type === 'doctor'){
                    user_list =resp.patient_doctors;
                    element_type = 'License'
                }
    
                if(user_list){            
                    $(`#${add_user_type}_name`).empty();
    
                    for(let [username,name,element] of user_list){
                        let user = $('<option>').attr("value",username).text(`${name} (${element_type}: ${element})`);
                        $(`#${add_user_type}_name`).append(user);
            
                    };
                };

                flashMessage(message);
                    
            })
        
    
            add_user_pop_up.remove();
        })
        
    });
    
}



// ADD PATIENT
addDoctorPatient('add_patient_to_hcp_list');

// ADD DOCTOR
addDoctorPatient('add_hcp_to_patient_list',add_user_type='doctor');



$('.main_container').on('click','.cancel_add_patient',(e)=>{
    $("#add_patient_pop_up").remove();
});
$('.main_container').on('click','.cancel_add_doctor',(e)=>{
    $("#add_doctor_pop_up").remove();
});



$('#symptomform').on('submit',(e)=>{
    let curr_question = $('#questions').val();
    if(curr_question == "None"){
        e.preventDefault();
    };

})

$('#added_all_symptoms_checkbox').on('click',(e)=>{
    let box_checked = e.target.checked; 
    if(box_checked){
        $('#submit_button').removeClass('disabled');
        $('#submit_button').prop('disabled', false);

    }else{
        $('#submit_button').addClass('disabled');
        $('#submit_button').prop('disabled', true);
    }

})


// ASSESSMENT CARD
$('.assessment_card').on('click',(e)=>{
    let assessment_id = $(e.target).closest('.card').attr('id');
    window.location =`/assessment/${assessment_id}`
})


// DELETE QUESTION
$('.deleteQuestion').on('click',(e)=>{
    let path = e.target.value;
    let li_id = path.split('/')[3];

    fetch_item({'delete_question':true},path,(resp)=>{
        let message = resp.message;
        if(resp.deleted){            
            $(`#${li_id}`).remove();
            flashMessage(message)
            
        };
    })

})


// ADMIN FUNCTIONS
const adminFetchRequests = (button_class,path) => {
    $(button_class).on('click',(e)=>{
        let username = e.target.id;
        let type = e.target.dataset.type
    
        let entry = {
            "username": username,
            "type": type
        }
    
        fetch_item(entry,path,(resp)=>{
            let message = resp.message;
    
            flashMessage(message);
            $(`#${username}-container`).remove()
        })
    
    })
    
}

// Verify HCP
adminFetchRequests('.verify_hcp_btn','verification');

// MAKE ADMIN 
adminFetchRequests('.make_admin_btn','make_admin');

// DELETE USER BY USERNAME
adminFetchRequests('.delete_user_btn','delete_users');

// DELETE INSTITUTION BY ID
adminFetchRequests('.delete_institution_btn','delete_institution');


// Add Follow Up Question
$('.add_follow_up_question').on('click',(e)=>{

    let question = $('.questions_input').val();

    let assessment_id = e.target.id;

    let entry = {
        "assessment_id": assessment_id,
        "question": question
    };

    
    fetch_item(entry,"/review_assessment/add_follow_up_question",(resp)=>{
        let message = resp.message;
        let follow_up_questions = resp.follow_up_questions

        let $ul = $('.follow_up_questions_display');
        $ul.empty()
        for(let q of follow_up_questions){
            let li = $('<li>').addClass("row justify-content-between flex-nowrap mb-2").attr('id',q[0]);            
            let text_div = $('<div>').addClass('col-9').text(q[1]);
            let btn_div = $('<div>').addClass('col-2');
            let btn = $('<button>').attr('type','button').addClass("col btn btn-danger btn-sm deleteFollowUpQuestion").text('Del').val(assessment_id);
            btn_div.append(btn);
            li.append(text_div).append(btn_div);
            $ul.append(li);
        }

    })


})

// Remove Followup Question
$('.follow_up_questions_display').on('click','.deleteFollowUpQuestion',(e)=>{

    let question = $(e.target).closest('li').attr('id');

    console.log('XASSSSSSSSSSSSSSSSS')
    console.log('XASSSSSSSSSSSSSSSSS')
    console.log(question)
    console.log('XASSSSSSSSSSSSSSSSS')
    console.log('XASSSSSSSSSSSSSSSSS')

    let entry = {
        "assessment_id": e.target.value,
        "question": question
    };
    console.log(entry);
    
    fetch_item(entry,"/review_assessment/remove_follow_up_question",(resp)=>{
        let message = resp.message;
        console.log(message);

        let $li = $(`.follow_up_questions_display #${question}`);
        $li.empty()

    })


})



// JQUERY FUNCTIONALITY
if($('#submit_button').hasClass('disabled')){
    $('#submit_button').prop('disabled', true);
};

for (let btn of $('.nav-link.disabled').get()){
    $(btn).prop('disabled', true);
}

for (let btn of $('a.nav-link').get()){
    let link = btn.href;
    link = link.split('?')[0]
    if(link === window.location.href){
        $(btn).closest('.nav-item').addClass('active');
    }
}


$('*[data-toggle="collapse"]').on('click',(e)=>{
    let target = e.target.dataset.target
    $(target).collapse()

});


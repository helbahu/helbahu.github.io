// Messages will dissapear after 5 seconds.
setTimeout(() => {
    if($('.msg_box').get()){
        $('.msg_box').remove()
    }
}, 5000);



function fetch_func(entry,link,callback){

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


// Manages requests for liking and unliking messages
$( ".likes-form" ).on('submit',(e)=>{
    e.preventDefault();
    let remove = $(e.target).hasClass('remove-like');
    let add = $(e.target).hasClass('add-like');

    if(remove){

        let id = $(e.target).find("button").attr("id");
        let link = `users/remove_like/${id}`;

        fetch_func({"submit":true},link,function(m){

            if(m.message){
                $(e.target).find("button").removeClass('btn-primary').addClass('btn-secondary');
                $(e.target).removeClass('remove-like').addClass('add-like');
 
                if($(`#li-${id}`).get()){
                    $(`#li-${id}`).remove();
                    let likes_num = $('.stat-likes');
                    let txt = likes_num.text();
                    txt --;
                    likes_num.text(txt);
                };

            };
        })

    }else if(add){
        let id = $(e.target).find("button").attr("id");
        let link = `users/add_like/${id}`;

        fetch_func({"submit":true},link,function(m){

            if(m.message){
                $(e.target).find("button").removeClass('btn-secondary').addClass('btn-primary')
                $(e.target).removeClass('add-like').addClass('remove-like');
            };

        })

    };
    
})

// Manages requests for following and unfollowing users
$( ".follow-form" ).on('submit',(e)=>{
    e.preventDefault();

    let unfollow = $(e.target).hasClass('unfollow');
    let follow = $(e.target).hasClass('follow');

    if(unfollow){
        let id = $(e.target).find("button").attr("id");
        let link = `users/stop-following/${id}`;

        fetch_func({"submit":true},link,function(m){

            if(m.message){
                $(e.target).find("button").removeClass('btn-primary').addClass('btn-outline-primary').text('Follow');
                $(e.target).removeClass('unfollow').addClass('follow');
 
                if($(`#li-${id}`).get()){
                    $(`#li-${id}`).remove()
                    let following_num = $('.stat-following');
                    let txt = following_num.text();
                    txt --;
                    following_num.text(txt);

                };
            };
        })

    }else if(follow){
        let id = $(e.target).find("button").attr("id");
        let link = `users/follow/${id}`;

        fetch_func({"submit":true},link,function(m){

            if(m.message){
                $(e.target).find("button").removeClass('btn-outline-primary').addClass('btn-primary').text('Unfollow');
                $(e.target).removeClass('follow').addClass('unfollow');
            };

        })

    };
    
})

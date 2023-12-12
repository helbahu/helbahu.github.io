"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  try{
    currentUser = await User.login(username, password);
    $loginForm.trigger("reset");
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
    start();  
  }catch(e){
    alert(`Invalid Username or Password`);
  }

}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  try{
    currentUser = await User.signup(username, password, name);

    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  
    $signupForm.trigger("reset");
    start();
  
  }catch(e){
    alert(e.response.data.error.message);
  }

}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
  $allStoriesList.show();

  updateNavOnLogin();
}

// -------------------------------------------Add Story Event Listener function
async function addNewStory(evt){
  console.debug("addNewStory", evt);
  evt.preventDefault();

  const title = $(`#story-title`).val(); 
  const url = $(`#story-url`).val();
  await storyList.addStory(currentUser,{title,url});
  $addStoryForm.trigger("reset");
  $addStoryForm.hide();
  start();
}
$addStoryForm.on(`submit`,addNewStory);

//-------------------------------------------Add Favorites
async function addOrRemoveFavorites(evt){
  if(!currentUser)return;
  let storyId = $(this).closest(`li`).attr(`id`);
  let fav = currentUser.favorites.find(story => story.storyId === storyId);
  if(!fav){
    await axios.post(`${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,{"token":currentUser.loginToken});
    start();

  }else{
    await axios.delete(`${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,{params:{"token":currentUser.loginToken}});
    start();

  };
  
}
$(`body`).on(`click`,`#star`,addOrRemoveFavorites);



//-------------------------------------------Delete Article
async function deleteStory(evt){
  if(!currentUser)return;
  let storyId = $(this).closest(`li`).attr(`id`);
  const del = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`,{params:{"token":currentUser.loginToken}});
  start();
}
$(`body`).on(`click`,`#deleteStory`,deleteStory);

//-----------------------------------------------Change Profile Name or Password 
async function changeProfileNameOrPassword(evt){
  let valu = evt.target.value;
  if(valu === `changeName`){
    let name = $(`#profile-name`).val();
    if(name === currentUser.name)return;
    if((name.length < 1)||(name.length > 55)){
      alert(`Your name must be between 1 and 55 characters long.`);
      return;
    }
    let response = await axios.patch(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}`,{
      "token":currentUser.loginToken,
      "user":{
        "name": name,
      }
    })
    start();
  }else if(valu === `changePW`){
    let pw = $(`#profile-password`).val();
    let pw2 = $(`#profile-retype-password`).val();
    if((pw.length < 8)||(pw.length > 55)){
      alert(`Your password must be between 8 and 55 characters long.`);
      return;
    }
    if(pw2.length === 0){
      alert(`Plese re-enter your password.`);
      return;
    }
    if(pw !== pw2){
      alert(`You've incorrectly re-entered your password.`);
      return;
    }
    let resp = await axios.patch(`https://hack-or-snooze-v3.herokuapp.com/users/${currentUser.username}`,{
      "token":currentUser.loginToken,
      "user":{
        "password": pw,
      }
    })
    start();
  }

}
$myProfile.on(`click`,`.profileBtn`,changeProfileNameOrPassword);

//------------------------------------------------Get list of stories
async function getListOfStories(){
  let num = storyList.stories.length;
  let $li = $(`#all-stories-list li`).last().get(0);

  if(num%25 !== 0)return;
  console.log(`OKAY`);
  let response = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/stories`,{params:{
    "skip": num,
    "limit": 25
  }})
  let {stories} = response.data;
  stories = stories.map(story => new Story(story));
  if(stories.length > 0){
    storyList.stories.push(...stories);
    await putStoriesOnPage();
  }else{
    return;
  }
  if(currentUser){
    $(`.starContainer`).show();
  }
  $li.scrollIntoView();
}

$(`.stories-container`).on("scrollend",function(e){
  getListOfStories();
})


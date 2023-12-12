"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  if(currentUser){
    $addStoryForm.get(0).reset();
    $(`.starContainer`).show();
  }

}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();

  // Show add story, Favorites, and My Stories buttons in nav
  $navAddStory.show();
  $navFavStories.show();
  $navMyStories.show();

  $navUserProfile.text(`${currentUser.username}`).show();
  $(`.starContainer`).show();
}

//-------------------------------------------------Navigate to Add Story Form 
/** Show Add Story Form on click on "Add Story" */

function navAddStoryClick(evt) {
  console.debug("navAddStoryClick", evt);
  hidePageComponents();
  $addStoryForm.get(0).reset();
  $addStoryForm.show();
}
$navAddStory.on("click", navAddStoryClick);

//-------------------------------------------------Show Fav stories
function navFavStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  putFilteredStoriesOnPage(`Favorite`);
  if(currentUser){
    $addStoryForm.get(0).reset();
    $(`.starContainer`).show();
  }

}

$body.on("click", "#favStories", navFavStories);

//-------------------------------------------------Show My stories
function navMyStories(evt) {
  console.debug("navFavStories", evt);
  hidePageComponents();
  putFilteredStoriesOnPage(`MyStories`);
  if(currentUser){
    $addStoryForm.get(0).reset();
    $(`.starContainer`).show();
  }

}

$body.on("click", "#myStories", navMyStories);

//-----------------------------------------------------------User profile
function navToUserProfile(evt){
  console.debug("navToUserProfile", evt);
  hidePageComponents();
  $myProfile.show();
  $myProfile.trigger(`reset`);
  $(`#profile-name`).val(currentUser.name);
}
$navUserProfile.on(`click`,navToUserProfile);
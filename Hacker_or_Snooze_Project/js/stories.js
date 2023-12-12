"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;


/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  //Favorite Star Symbol and Delete Button 
  let star = `<span id="star">&#9734</span>`;
  let del = ``;
  
  if(currentUser){
    let fav = currentUser.favorites.find(s => s.storyId === story.storyId);
    if(fav){
      star = `<span id="star" class="starFav">&#9733</span>`;
    }else{
      star = `<span id="star">&#9734</span>`;
    }
  
    let myStories = currentUser.ownStories.find(s => s.storyId === story.storyId);
    if(myStories){
      del = `<span id="deleteStory">&#9249</span>`;
    }else{
      del = ``;
    }
  }

  return $(`
      <li id="${story.storyId}">
        <div class="list-item">
          <div class = "starContainer hidden">
            ${star}      
          </div>
          <div>
            <a href="${story.url}" target="a_blank" class="story-link">
              ${story.title}
            </a>
            <small class="story-hostname">(${hostName})</small>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </div>
          <div class = "delContainer">
            <a id="deleteStory" href="#">${del}</a>
          </div>

        </div>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//----------------------------------------------------------Fav stories and Own Stories 
function putFilteredStoriesOnPage(filter) {
  console.debug("putFilteredStoriesOnPage");

  $allStoriesList.empty();

  if(filter === `Favorite`){
    // loop through all of our Favorite stories and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }

  }else if(filter === `MyStories`){
    // loop through all of your stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }

  }

  $allStoriesList.show();
}



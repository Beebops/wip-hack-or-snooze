'use strict'

// This is the global list of the stories, an instance of StoryList
let storyList

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories()
  $storiesLoadingMsg.remove()

  putStoriesOnPage()
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  //console.debug('generateStoryMarkup', story)

  const hostName = story.getHostName()
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `)
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage')

  $allStoriesList.empty()

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story)
    $allStoriesList.append($story)
  }

  $allStoriesList.show()
}

//* Write a function in stories.js that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page. */

async function submitNewStory(e) {
  e.preventDefault()
  // get the input values from the form
  const author = $('#get-author').val()
  const title = $('#get-title').val()
  const url = $('#get-url').val()
  // need to get current user
  const username = currentUser.username
  const storyData = { author, title, url, username }
  // call addStory method
  const story = await storyList.addStory(currentUser, storyData)
  // show the new story at top of list on page
  console.log(story)
  const $story = generateStoryMarkup(story)
  $allStoriesList.prepend($story)
  // hide the new form
  $storyForm.hide()
}

$storyForm.on('submit', submitNewStory)

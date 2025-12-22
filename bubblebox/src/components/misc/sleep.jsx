// Source - https://stackoverflow.com/a
// Posted by Ronit Roy, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-11, License - CC BY-SA 4.0

function sleep(delay) {
  return new Promise(res => setTimeout(res, delay)) // was originally written in typescript - I changed to JS
}

export default sleep

//I decided to add this to be used with redirects -> an instant redirect feels like the user isn't in control, and feels a bit daunting
// allows me to add a "login success" message that the user can read in time, so they feel more informed 
// also makes it feel like the system is doing more lol

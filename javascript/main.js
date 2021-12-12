function loadingfun(){
  var loader=document.getElementById("loading");
  loader.style.display="none";
}
var UI = {};
// Taking input from user
// when input is entered by clicking on button

UI.click = function () {
  document.querySelector(".js-submit").addEventListener("click", function () {
    var userinput = document.querySelector("input").value;
    console.log(userinput);
    soundCloud_API.getTracks(userinput);
  });
};

//  when user enter the input using enter key
UI.enter = function () {
  document.querySelector("input").addEventListener("keyup", function (event) {
    console.log(event);
    if (event.code === "Enter") {
      var userinput = document.querySelector("input").value;
      console.log(userinput);
      soundCloud_API.getTracks(userinput);
    }
  });
};

UI.clear = function () {
  var searchResults = document.querySelector(".js-search-results");
  searchResults.innerHTML = "";
};

UI.clearQueue = function () {
  var clear = document.querySelector(".container-button");
  var player = document.querySelector(".js-playlist");
  clear.addEventListener("click", function () {
    localStorage.removeItem("track_key");
    player.innerHTML = "";
  });
};
UI.clearQueue();

//API WRAPPER OBJECT
var soundCloud_API = {};

soundCloud_API.init = function () {
  // initialise the object with api client_id
  SC.initialize({
    client_id: "cd9be64eeb32d1741c17cb39e41d254d",
  });
};
soundCloud_API.init();
UI.click();
UI.enter();
soundCloud_API.getTracks = function (inputvalue) {
  SC.get("/tracks", {
    q: inputvalue
  }).then(function (tracks) {
    UI.clear();
    console.log(tracks);
    soundCloud_API.renderTracks(tracks);
  });
};

soundCloud_API.renderTracks = function (tracks) {
  tracks.forEach(function (track) {
    var resultbox = document.querySelector(".js-search-results");
    //MAKING CARDS FOR EACH TRACK
    var card_container=document.createElement("div");
    card_container.classList.add("card-container");

    var card = document.createElement("div");
    card.classList.add("card");

    var card_img = document.createElement("div");
    card_img.classList.add("image");
    var img_image = document.createElement("img");
    img_image.classList.add("image_img");
    var randomurl = "https://source.unsplash.com/random?music/";
    img_image.src = track.artwork_url || randomurl;

    card_img.classList.add("image");

    var content = document.createElement("div");
    content.classList.add("content");
    var header = document.createElement("div");
    header.classList.add("header");
    var a_tag = document.createElement("a");
    a_tag.setAttribute("href", track.permalink_url);

    a_tag.setAttribute("target", "_blank");

    a_tag.innerHTML = track.title;

    
    var button = document.createElement("div");
    button.classList.add("ui", "bottom", "attached", "button", "js-button");

    button.addEventListener("click", function () {
      soundCloud_API.getEmbed(track.permalink_url);
    });

    var icon = document.createElement("i");
    icon.classList.add("add", "icon");
    button.appendChild(icon);
    var addtext = document.createElement("span");
    addtext.innerHTML = "Add to playlist";
    button.appendChild(addtext);
    card.appendChild(button);
    card_img.appendChild(img_image);
    card.appendChild(card_img);
    
    card.appendChild(content);
    header.appendChild(a_tag);
    content.appendChild(header);
    button.appendChild(addtext);
    card.appendChild(button);
    card_container.appendChild(card);
    resultbox.appendChild(card);

  });
};

//PLAYING SONGS
soundCloud_API.getEmbed= function (track) {
  SC.oEmbed(track, {
    auto_play: true,
  }).then(function (embed) {
    console.log("oEmbed response: ", embed);

    // CREATING PLAYLIST
    var sidebar = document.querySelector(".js-playlist");
    var box = document.createElement("div");
    
    // <iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F334588914&show_artwork=true"></iframe>
    // var embed_html=embed.html.split("src=").join('allow="autoplay" src=');
    
    // console.log(embed_html);
    
    box.innerHTML = embed.html;
    
    sidebar.insertBefore(box, sidebar.firstChild);
    localStorage.setItem("track_key", sidebar.innerHTML);
});
}
var sidebar = document.querySelector('.js-playlist'); 
sidebar.innerHTML = localStorage.getItem("track_key");
   

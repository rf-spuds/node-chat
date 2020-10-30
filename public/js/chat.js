const socket = io();

// *Message Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = document.getElementById("content");
const $sendMessage = document.getElementById("sendMessage");
const $messages = document.getElementById("messages");

// * Location Elements
const $sendLocation = document.getElementById("sendLocation");

// *Templates
const messageTemplate = document.getElementById("msgTemplate").innerHTML;
const locationTemplate = document.getElementById("locTemplate").innerHTML;

// *Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.url,
    createdAt: moment(url.createdAt).format("hh:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // * disable on send
  $sendMessage.setAttribute("disabled", "disabled");
  const message = $messageFormInput.value;

  socket.emit("sendMessage", message, (message) => {
    // *enable
    $sendMessage.removeAttribute("disabled", "disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    console.log("Message delivered successfully client side ||", message);
  });
});

$sendLocation.addEventListener("click", () => {
  $sendLocation.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by this browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    $sendLocation.removeAttribute("disabled", "disabled");
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (location) => {
        console.log("Location Sent Client side ||", location);
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

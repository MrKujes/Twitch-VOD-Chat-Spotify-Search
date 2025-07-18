const CHAT_CONTAINER_SELECTOR = 'div.video-chat__message-list-wrapper';

let currentArtist = null;
let currentSong = null;
let trigger = "gerade läuft:";

chrome.storage.local.get(["triggerWord"], (data) => {
  if (data.triggerWord) {
    trigger = data.triggerWord.toLowerCase();
  }
});

function parseSongInfo(text) {
  const lowerText = text.toLowerCase();
  if (!lowerText.includes(trigger)) return null;

  const parts = text.split(new RegExp(trigger, "i"));
  if (parts.length < 2) return null;

  const info = parts[1].trim();
  const splitIndex = info.indexOf(" - ");
  if (splitIndex === -1) return null;

  const artist = info.substring(0, splitIndex).trim();
  const song = info.substring(splitIndex + 3).trim();

  return { artist, song };
}

function scanMessages() {
  const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
  if (!chatContainer) {
    console.warn("Chat Container nicht gefunden");
    return;
  }

  const messages = chatContainer.querySelectorAll("li");
  messages.forEach(msg => {
    const spans = msg.querySelectorAll("span");
    spans.forEach(span => {
      const text = span.textContent;
      if (text && text.toLowerCase().includes(trigger)) {
        const songInfo = parseSongInfo(text);
        if (songInfo) {
          if (songInfo.artist !== currentArtist || songInfo.song !== currentSong) {
            currentArtist = songInfo.artist;
            currentSong = songInfo.song;
            console.log("Neuer Song erkannt:", currentArtist, "-", currentSong);

            chrome.runtime.sendMessage({
              type: "playSong",
              artist: currentArtist,
              song: currentSong
            });
          }
        }
      }
    });
  });
}

setInterval(scanMessages, 3000);
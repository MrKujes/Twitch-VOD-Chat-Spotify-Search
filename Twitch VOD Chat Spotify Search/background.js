function openSpotifySearch(artist, song) {
  const query = encodeURIComponent(`${artist} ${song}`);
  const url = `https://open.spotify.com/search/${query}`;

  chrome.storage.local.get(["popupPosition"], (data) => {
    const position = data.popupPosition || { left: 100, top: 100, width: 500, height: 700 };

    chrome.windows.create({
      url,
      type: "popup",
      left: position.left,
      top: position.top,
      width: position.width,
      height: position.height
    }, (createdWindow) => {
      chrome.windows.onBoundsChanged.addListener(function onChange(window) {
        if (window.id === createdWindow.id) {
          chrome.windows.get(window.id, (win) => {
            chrome.storage.local.set({
              popupPosition: {
                left: win.left,
                top: win.top,
                width: win.width,
                height: win.height
              }
            });
          });
        }
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "playSong" && message.artist && message.song) {
    openSpotifySearch(message.artist, message.song);
    sendResponse({ status: "opened" });
  }
});
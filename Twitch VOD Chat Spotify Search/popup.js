document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("trigger");
  const saveBtn = document.getElementById("save");

  chrome.storage.local.get(["triggerWord"], (data) => {
    input.value = data.triggerWord || "gerade läuft:";
  });

  saveBtn.onclick = () => {
    const val = input.value.trim();
    chrome.storage.local.set({ triggerWord: val }, () => {
      saveBtn.textContent = "Gespeichert!";
      setTimeout(() => (saveBtn.textContent = "Speichern"), 1000);
    });
  };
});
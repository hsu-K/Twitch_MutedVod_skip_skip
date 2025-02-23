chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
  if (tab.url && tab.url.includes("twitch.tv/videos")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});

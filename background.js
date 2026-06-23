console.log("Ageverif bypass script is running");
browser.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log("Request intercepted:", details.url);

        const filter = browser.webRequest.filterResponseData(details.requestId);

        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();

        filter.onstop = async () => {
            // Replace the original age verif popup with this one
            const modifiedResponse = encoder.encode(`(function (w) {
  const config = w.AgeCheckerConfig || {};

  function complete() {
    // Redirect takes priority
    if (config.redirect_url) {
      w.location.href = config.redirect_url;
      return;
    }

    // Otherwise trigger onclosed callback
    if (typeof config.onclosed === 'function') {
      config.onclosed();
    }
  }

  // Expose API expected by the loader
  w.AgeCheckerAPI = {
    show: function () {
      complete();
    },

    close: function () {
      complete();
    }
  };

  // Notify loader that the script is ready
  if (typeof config.onready === 'function') {
    config.onready();
  }
})(window);`);
            filter.write(modifiedResponse);
            filter.close()
        }

    },
    { urls: ["https://cdn.agechecker.net/static/popup/v1/popup.js"]},
    ["blocking"]
);
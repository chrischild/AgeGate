//This page interacts with the content script and chrome app
vars = {};

document.addEventListener('DOMContentLoaded', function () {


    var button = document.getElementById('sendInfo');

    button.addEventListener('click', function () {

        var approved = ($('#approved').val() == 'true');
        if (approved) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.storage.local.get(["user"], function (data) {
                    data.user.approved = approved;
                    chrome.storage.local.set({ user: data.user });
                });
                chrome.tabs.update(tabs[0].id, { url: vars["previousPage"] });
            });
        } else {
             location.reload(true);
        }
    });
});

function getUrlVars() {
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
}

getUrlVars();
// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "redirect") {
    chrome.tabs.update(sender.tab.id, { url: request.redirect });
  } else if (request.type == "find") {
	  
	  console.log("find");
	  console.log(request.elements);
    if (request.elements.length > 0) {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/dictionaryservice/dictionary/find',
        crossDomain: true,
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify({ elements: request.elements }),
        success: function (data) {
          sendResponse({ found: data.found });
        }
      });
    } else {
      sendResponse({ found: true });
    }
  } else if (request.type == "expiry") {
    var localUser = request.user;
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8080/userservice/user/expiry',
      crossDomain: true,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify({ username: localUser.username, token: localUser.token, approved: localUser.approved }),
      success: function (user) {
        if (user.expired) {
          localUser.expired = true;
        }
        sendResponse({ user: localUser });
      }
    });
  } else if (request.type == "token") {

    $.ajax({
      type: "POST",
      url: "http://localhost:8080/userservice/user/token",
      crossDomain: true,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify({ username: "cchild" }),
      success: function (data) {
        sendResponse({ user: data });
      }
    });
  }

  return true;
});

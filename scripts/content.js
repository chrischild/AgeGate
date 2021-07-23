//This page interacts with both the chrome app and web page
// chrome.storage.local.remove('user');

function search() {
	var elementsToCheck = [];

	$('input[id*=Age]').each(function() {
		elementsToCheck.push($(this).attr('id'));
	});
	$('input[id*=age]').each(function() {
		elementsToCheck.push($(this).attr('id'));
	});

	$('input[name*=Age').each(function() {
		elementsToCheck.push($(this).attr('name'));
	});
	$('input[name*=age').each(function() {
		elementsToCheck.push($(this).attr('name'));
	});

	$('select[id*=age').each(function() {
		elementsToCheck.push($(this).attr('id'));
	});

	$('select[name*=age').each(function() {
		elementsToCheck.push($(this).attr('name'));
	});

	$('[class*=Age').each(function() {
		elementsToCheck.push($(this).attr('class'));
	});
	$('[class*=age').each(function() {
		elementsToCheck.push($(this).attr('class'));
	});
	
	if (elementsToCheck.length > 0) {
		chrome.runtime.sendMessage({
			type : "find",
			elements : elementsToCheck
		}, function(response) {
			ageGate(response.found);
		});
	}
}

// Getting
function ageGate(found) {
	if (!found) {
		chrome.storage.local.get([ "user" ], function(local) {
			if ($.isEmptyObject(local) || local == undefined) {
				local.user = {
					approved : false,
					expired : false,
					token : "",
					username : ""
				}
				chrome.runtime.sendMessage({
					type : "token",
					user : local.user
				}, function(response) {
					redirect(found, local.user, response.user);
				});
			} else {
				chrome.runtime.sendMessage({
					type : "expiry",
					user : local.user,
					redirect : "../agegate.html?previousPage="
							+ window.location.toString()
				}, function(response) {
					var user = response.user;
					if (user.expired) {
						user.expired = false;
						user.approved = false;
						chrome.storage.local.set({
							user : user
						});
						chrome.runtime.sendMessage({
							type : "token",
							user : user
						}, function(response) {
							redirect(found, local.user, response.user);
						});
					}
				});
			}
		});
	}
}

function redirect(found, user, updatedUser) {
	user.approved = updatedUser.approved;
	user.expired = updatedUser.expired;
	user.token = updatedUser.token;
	user.username = updatedUser.username;
	chrome.storage.local.set({
		user : user
	});
	if (!found && !user.approved) {
		chrome.runtime.sendMessage({
			type : "redirect",
			redirect : "../agegate.html?previousPage="
					+ window.location.toString()
		});
	}
}
search();

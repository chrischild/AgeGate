// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var submitted = false;
var disable = false;
var currentQuestion = 0;
var correct = 0;
var question = '';
var answers = {
	answerA : '',
	answerB : '',
	answerC : '',
	answerD : '',
	questionId : ''
};

document.addEventListener('DOMContentLoaded', function() {
	getQuestion();
}, false);

function getQuestion() {
	$.post("http://localhost:8080/questionservice/questions/question",
			function(data) {
				question = data.question;
				answers.answerA = data.answers[0];
				answers.answerB = data.answers[1];
				answers.answerC = data.answers[2];
				answers.answerD = data.answers[3];
				answers.questionId = data.id;

				$('#question span').text(question);
				$('#answerA input').val(answers.answerA);
				$('#answerA input').prop('checked', false);
				$('#answerA span').text(answers.answerA);

				$('#answerB input').val(answers.answerB);
				$('#answerB input').prop('checked', false);
				$('#answerB span').text(answers.answerB);

				$('#answerC input').val(answers.answerC);
				$('#answerC input').prop('checked', false);
				$('#answerC span').text(answers.answerC);

				$('#answerD input').val(answers.answerD);
				$('#answerD input').prop('checked', false);
				$('#answerD span').text(answers.answerD);

				$('#progress').css('width', '100%');
				$('#countdown').text('5');
				$('input:radio').attr('disabled', false);

				progress();
			});
}

var progessFunction;

function progress() {

	var currentTime = 1000 * 5;
	var currentPercent = 100;
	var removePercent = currentPercent / 5;
	var counterBack = setInterval(
			function() {

				currentTime = (currentTime - 1000);
				currentPercent = currentPercent - removePercent;
				if (currentTime > 0) {
					var countdown = $('#countdown').text();
					countdown = countdown - 1;
					$('#progress').css('width', currentPercent + '%');
					$('#countdown').text(countdown);
				} else {
					disableInputs();
					$('#progress').css('width', '0%');
					$('#countdown').text('0');
					clearInterval(counterBack);
					var extraTime = setInterval(
							function() {
								clearInterval(extraTime);
								if (!submitted) {
									$
											.post(
													"http://localhost:8080/questionservice/questions/question",
													function(data) {
														next(data);
													});
								}
							}, 500);
				}
			}, 995);
	progessFunction = counterBack;
}

function disableInputs() {
	$('input:radio').attr('disabled', true);
}

$(function() {

	$('input:radio')
			.change(
					function() {

						$('#checkboxes input:checked')
								.each(
										function() {
											if ($(this).prop('checked')) {
												submitted = true;
												var info = {
													answer : $(this).attr(
															'value'),
													questionId : answers.questionId
												}
												$
														.ajax({
															type : "POST",
															url : "http://localhost:8080/questionservice/questions/answer",
															crossDomain : true,
															processData : false,
															contentType : 'application/json',
															data : JSON
																	.stringify(info),
															success : function(
																	data) {
																next(data);
															}
														});
											}
										});
					});
});

function next(newQuestion) {

	if (!newQuestion.previousAnswerCorrect) {
//		$('#question' + currentQuestion).css('color', '#ff0000');
		$('#question' + currentQuestion).attr('class', 'fas fa-times-circle col-md-2');
	} else {
//		$('#question' + currentQuestion).css('color', '#33cc33');
		$('#question' + currentQuestion).attr('class', 'fas fa-check col-md-2');
		correct++;
	}

	clearInterval(progessFunction);
	currentQuestion++;

	if (currentQuestion < 5) {

		var setupNext = setInterval(function() {

			question = newQuestion.question;
			answers.answerA = newQuestion.answers[0];
			answers.answerB = newQuestion.answers[1];
			answers.answerC = newQuestion.answers[2];
			answers.answerD = newQuestion.answers[3];
			answers.questionId = newQuestion.id;

			$('#question span').text(question);
			$('#answerA input').val(answers.answerA);
			$('#answerA input').prop('checked', false);
			$('#answerA span').text(answers.answerA);

			$('#answerB input').val(answers.answerB);
			$('#answerB input').prop('checked', false);
			$('#answerB span').text(answers.answerB);

			$('#answerC input').val(answers.answerC);
			$('#answerC input').prop('checked', false);
			$('#answerC span').text(answers.answerC);

			$('#answerD input').val(answers.answerD);
			$('#answerD input').prop('checked', false);
			$('#answerD span').text(answers.answerD);

			$('#progress').css('width', '100%');
			$('#countdown').text('5');
			$('input:radio').attr('disabled', false);

			progress();
			submitted = false;
			clearInterval(setupNext);

		}, 100);
	} else {
		if (correct / currentQuestion >= 0.5) {
			$('#approved').val(true);
		}
		var button = document.getElementById('sendInfo');
		button.click();
	}
}

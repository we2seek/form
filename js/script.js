"use strict";

var step = 0,
    nextStep,
    maxStep,
    currentFieldset,
    nextFieldset,
    form = $('#mform'),
    btnSubmit = $('#mform input[type=submit]'),
    btnPrev = $('#mform input.prev'),
    btnNext = $('#mform input.next'),
    fieldsets = $('#mform fieldset'),
    progressbar = $('#progressbar');

function showStep(nextStep) {

    if (nextStep < 0) {
        nextStep = maxStep;
    }

    if (nextStep > maxStep) {
        nextStep = 0;
    }

    currentFieldset = fieldsets.eq(step);
    nextFieldset = fieldsets.eq(nextStep);

    currentFieldset.hide();
    nextFieldset.show();

    showButtons(nextStep);
    step = nextStep;
}

function showButtons(step) {
    if (step == 0) {
        btnPrev.hide();
    }

    if (step == maxStep) {
        btnNext.hide();
        btnSubmit.show();
    }

    if (step > 0) {
        btnPrev.show();
    }
    
    if (step < maxStep && btnSubmit.is(':visible')) {
        btnSubmit.hide();
        btnNext.show();
    }
}

$(document).ready(function () {

    // Temporary prevent form submit
    form.submit(function (e) {
        e.preventDefault();
        return false;
    });

    // Hide buttons
    btnSubmit.hide();
    btnPrev.hide();

    btnNext.click(function () {
        showStep(step + 1);
    });

    btnPrev.click(function () {
        showStep(step - 1);
    });

    maxStep = fieldsets.length - 1;

});
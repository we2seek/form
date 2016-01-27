"use strict";

var currentStep = 0,
    nextStep,
    maxStep,
    currentFieldset,
    nextFieldset,
    form = $('#mform'),
    btnSubmit = $('#mform input[type=submit]'),
    btnPrev = $('#mform input.prev'),
    btnNext = $('#mform input.next'),
    fieldsets = $('#mform fieldset'),
    progressbar = $('#progressbar li');

function showStep(nextStep) {

    if (nextStep < 0) {
        nextStep = maxStep;
    }

    if (nextStep > maxStep) {
        nextStep = 0;
    }

    currentFieldset = fieldsets.eq(currentStep);
    nextFieldset = fieldsets.eq(nextStep);

    currentFieldset.hide();
    nextFieldset.show();

    showButtons(nextStep);
    
    if (nextStep > currentStep) {
        progressbar.eq(currentStep).removeClass('active');
        progressbar.eq(currentStep).addClass('pass');
        progressbar.eq(nextStep).addClass('active');
    } else {
        progressbar.eq(currentStep).removeClass('active');
        progressbar.eq(nextStep).removeClass('pass');
        progressbar.eq(nextStep).addClass('active');
    }
    
    currentStep = nextStep;
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

function showProgress (step) {
    progressbar.eq(step).addClass('active');
}

function hideProgress (step) {
    progressbar.eq(step).removeClass('active');
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
        showStep(currentStep + 1);
    });

    btnPrev.click(function () {
        showStep(currentStep - 1);
    });

    maxStep = fieldsets.length - 1;

});
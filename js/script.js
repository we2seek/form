"use strict";

var currentStep = 0,
    nextStep,
    maxStep,
    stepStack = [],
    currentFieldset,
    nextFieldset,
    form = $('#mform'),
    btnSubmit = $('#mform input[type=submit]'),
    btnPrev = $('#mform input.prev'),
    btnNext = $('#mform input.next'),
    fieldsets = $('#mform fieldset'),
    progressbar = $('#progressbar li'),
    radioProd = $('#mform input[name="prod"]'),
    radioProdType = $('#mform input[name="prodType"]');

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
    
    if (nextStep == 1) {
        progressbar.eq(1).show();
    }
    
    if (nextStep == 0) {
        progressbar.eq(1).hide();
    }

    // Do not remeber last step if we go back 
    // to prevent loop between steps
    if (nextStep > currentStep) {
        stepStack.push(currentStep);
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

function showProgress(step) {
    progressbar.eq(step).addClass('active');
}

function hideProgress(step) {
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
    
    // Hide second step on progressbar
    progressbar.eq(1).hide();

    btnNext.click(function () {
        showStep(currentStep + 1);
    });

    btnPrev.click(function () {
        showStep(stepStack.pop());
    });

    radioProd.click(function () {
        // Deselect productType checked if there
        radioProdType.filter(':checked').prop('checked', false);

        showStep(currentStep + 1);
    });

    radioProdType.click(function () {
        if (currentStep == 0) {
            // Deselect product checked if there
            radioProd.filter(':checked').prop('checked', false);
            progressbar.eq(1).hide();
            showStep(currentStep + 2);
        } else {
            showStep(currentStep + 1);
        }
    });

    maxStep = fieldsets.length - 1;

});
"use strict";

var currentStep = 0,
    maxStep,
    stepStack = [],
    currentFieldset,
    nextFieldset,
    form = $('#mform'),
    btnSubmit = $('#mform .btnSubmit'),
    btnPrev = $('#mform .prev'),
    btnNext = $('#mform .next'),
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

    // Remember steps history. Do not remember last step if we go back
    // to prevent loop between steps
    if (nextStep > currentStep) {
        stepStack.push(currentStep);
    }

    // Add info to right panel (Summary)
    //$('.right-content');

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

$(document).ready(function () {

    // One click form
    $('#sendOneClick').click(function (e) {
        var inputPhone = $('#onePhone2');
        var userPhone = inputPhone.val();
        var regEx = /^\+380\d{9}$/;
        if (!userPhone || userPhone == '+380' || !regEx.test(userPhone)) {
            inputPhone.addClass('err').delay(1000).removeClass('err', 1000).focus();
        } else {
            $('#oneClickModal').hide();
            //showPreloader(true);
            $.ajax({
                method: "post",
                url: HTTP_HOST + 'Request/ajax',
                data: {
                    method: 'saveForm',
                    form: {user: {phone: userPhone}}
                },
                success: function (r) {
                    showPreloader(false);
                    alert("Ваша заявка принята. Наш сотрудник свяжется с Вами в ближайшее время");
                    setTimeout(function () {
                        window.location.replace(HTTP_HOST);
                    }, 3000);
                },
                error: function (e) {
                    showPreloader(false);
                    console.log(e.status + ': ' + e.statusText + '; ' + e.responseText);
                    alert("Произошла ошибка. Пожалуйста, перезвоните нам.");
                    setTimeout(function () {
                        window.location.replace(HTTP_HOST);
                    }, 3000);
                }
            });
        }
    });

//    $("#onePhone2").keydown(filterKeyPresses);

    // Temporary prevent form submit
    form.submit(function (e) {
        e.preventDefault();
        return false;
    });

    // Hide buttons
    //btnSubmit.hide();
    //btnPrev.hide();

    // Hide second step on progressbar
    progressbar.eq(1).hide();

    //Hide main form 
    //form.hide();

    $('#btnShowForm').click(function () {
        $('.preForm').hide();
        form.show();
    });

    btnNext.click(function () {
        showStep(currentStep + 1);
    });

    btnPrev.click(function () {
        showStep(stepStack.pop());
    });

    /*radioProd.click(function () {
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
    });*/

    maxStep = fieldsets.length - 1;
});


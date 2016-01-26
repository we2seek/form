/* TODO: try use http://www.codeproject.com/Tips/855277/JQuery-Image-Slider-Tutorial-for-Beginners */
var current_fs, next_fs, prev_fs;
var form = $('#mform');
var fieldsets = $('#mform fieldset');
var progressbar = $('#progressbar li');
var btnSubmit = $('#mform input[type=submit]');
var btnPrev = $('#mform .prev');
var btnNext = $('#mform .next');
var dl = $('#mform .right > dl');
var radioProd = $('input[name="product"]');
var radioProdType = $('input[name="productType"]');

var step = 0; // current step
var nextStep = 0;
var stepStack = [];
var max_step = fieldsets.length - 1;

$(document).ready(function () {
    btnPrev.prop('disabled', true);
    progressbar.eq(1).hide();
    btnNext.click(function () {
        if (
            step == 0 &&
            radioProdType.filter(':checked').length > 0 &&
            radioProd.filter(':checked').length == 0
        ) {
            showStep(step + 2)
        } else {
            showStep(step + 1);
        }
    });

    btnPrev.click(function () {
        showStep(stepStack.pop());
    });

    radioProd.click(function () {
        // Deselect productType checked if there
        radioProdType.filter(':checked').prop('checked', false);

        showStep(step + 1);
    });

    radioProdType.click(function () {
        // Escape step with prodType selection
        if (step == 0) {
            // Deselect product checked if there
            radioProd.filter(':checked').prop('checked', false);
            progressbar.eq(1).hide();
            showStep(step + 2);
        } else {
            showStep(step + 1);
        }
    });

});

$.validator.addMethod('radiosRequired', function (value, element, options) {
    // Page, where this method must work
    var page = parseInt(options);

    // Do not check if steps back
    if (nextStep < step) {
        return true;
    }

    // Do not check if another page
    if (step != page) {
        return true;
    }

    var len = radioProdType.filter(':checked').length;
    return len > 0;
}, 'Please select product type!');

$.validator.addMethod('inputRequired', function (value, element, options) {
    // Page, where this method must work
    var page = parseInt(options);

    // Do not check if steps back
    if (nextStep < step) {
        return true;
    }

    // Do not check if another page
    if (step != page) {
        return true;
    }

    // True - test passed, False - test not passed
    return (value.trim()).length > 0;
}, 'Please fill this field');

form.validate({
    // debug: true,
    ignore: [], // to validate hidden inputs, etc my hidden radios

    rules: {
        productType: {
            radiosRequired: 1, // step number (0-based) where this field required
        },

        inputStep3: {
            inputRequired: 2, // step number (0-based)
        },

        inputStep4: {
            inputRequired: 3, // step number (0-based)
        },

    },

    errorPlacement: function (error, element) {
        if (element.is(radioProdType)) {
            // error.appendTo( element.parents('.container') );
            alert(error[0].textContent);
        } else { // This is the default behavior 
            error.insertAfter(element);
        }

    },

});

function showStep(next) {
    nextStep = next;

    if (!form.valid()) {
        return false;
    }

    current_fs = fieldsets.eq(step);
    next_fs = fieldsets.eq(nextStep);

    current_fs.hide();
    next_fs.show();

    // Show/hide buttons
    if (nextStep === 0) {
        btnPrev.prop('disabled', true);
    } else {
        btnPrev.prop('disabled', false);
    }

    if (nextStep === max_step) {
        btnNext.hide();
        btnSubmit.show();
    } else if (btnNext.is(':visible') === false) {
        btnNext.show();
        btnSubmit.hide();
    }

    // Progressbar
    if (nextStep == 1) {
        progressbar.eq(1).show();
    }
    
    if (nextStep == 0) {
        progressbar.eq(1).hide();
    }
    
    var i = 0;

    for (i = 0; i < nextStep; i++) {
        progressbar.eq(i).addClass('pass');
    }

    for (i = nextStep; i < max_step; i++) {
        progressbar.eq(i).removeClass('pass');
    }

    progressbar.eq(step).removeClass('active');
    progressbar.eq(nextStep).addClass('active');

    // Right panel with <dl>
    if (nextStep > step) {
        dl.eq(step + 1).show();
    } else {
        dl.eq(step).hide();
    }

    // Do not remeber last step if we go back 
    // to prevent loop between steps
    if (nextStep > step) {
        stepStack.push(step);
    }
    step = nextStep;
}
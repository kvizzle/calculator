



$(document).ready(function() {
  var counter = 0;
  var mainScreen = "";
  var key = "";

  eraseKeys();
  keyboardInput();
  clickInput();

  function eraseKeys() {
    $(document).keyup(function(event) {
      if (event.which == 27) {
        clear();
      } else if (event.which == 8) {
        deleteLastChar();
      }
    });
  }

  function keyboardInput() {
    console.log("keyb");
    $(document).keypress(function(event) {
      key = String.fromCharCode(event.which);
      mainScreen = viewOnlyTwelve(mainScreen);

      if (event.which == 13 && mainScreen.length >= 1) {
        $(".mainScreen").focus();
        calculate();
      } else {
        mainScreen += key;
        $("#view").val(mainScreen);
        errorCheck();
      }
    });
  }

  function clickInput() {
  

    $(".button").click(function() {
            console.log("clickb");
      $(".mainScreen").focus();
      mainScreen = viewOnlyTwelve(mainScreen);
      console.log($(this).val());

      if ($(this).val() == "=" && mainScreen.length >= 1) {
        calculate();
      } else if ($(this).val() == "AC") {
        clear();
      } else if ($(this).val() == "CE") {
        deleteLastChar();
      } else {
        mainScreen += $(this).val();
        $("#view").val(mainScreen);
        errorCheck();
      }
    });
  }

  function viewOnlyTwelve(val) {
    if (val.length > 30) {
      $("#view").css("font-size", "0.6em");
    } else if (val.length > 23) {
      $("#view").css("font-size", "0.8em");
    } else {
      $("#view").css("font-size", "1em");
    }
    return val;
  }

  function calculate() {
    mainScreen = percentSymbolConvert(mainScreen);
    checkDivideZero(mainScreen);
    $("#view").val(mainScreen);
    mainScreen = eval($("#view").val()).toString();
    mainScreen = viewOnlyTwelve(mainScreen);
    $("#view").val(mainScreen);
  }

  function percentSymbolConvert(val) {
    for (var j = 0; j < val.length; j++) {
      if (val[j] == "%") {
        val = val.substr(0, j) + "/100" + val.substr(j + 1);
      }
    }
    return val;
  }

  function checkDivideZero(val) {
    for (var j = 0; j < val.length; j++) {
      if (val[j] == "/" && val[j + 1] == "0") {
        console.log("yo");
        mainScreen = "err";
      }
    }
  }

  function clear() {
    $("#view").val("");
    mainScreen = "";
  }

  function errorCheck() {
    initialValueCheck(mainScreen[0]);
    noInvalidKeypress(mainScreen);

    for (var i = 0; i < mainScreen.length; i++) {
      noConsecutiveOperands(mainScreen[i], mainScreen[i + 1]);
      negativeVals(mainScreen[i], mainScreen[i + 1]);
      noMultipleDecimals(mainScreen[i]);
      noIncorrectPercent(mainScreen[i], mainScreen[i + 1]);
      checkZero(mainScreen[i - 1], mainScreen[i], mainScreen[i + 1]);
    }
    resetCounter();
  }

  function initialValueCheck(firstVal) {
    var reg = /^[\+\/\*\%]/;
    if (reg.test(firstVal) == true) {
      clear();
    }
  }

  function noInvalidKeypress(val) {
    var reg = /^[\d\%\/\*\-\+\.]/;
    if (reg.test(val[val.length - 1]) == false) {
      deleteLastChar();
    }
  }

  function noConsecutiveOperands(currentVal, nextVal) {
    var reg = /^[\+\/\*]/;
    var regNext = /^[\+\/\*\%]/;
    if (reg.test(currentVal) == true && regNext.test(nextVal) == true) {
      replaceLastChar();
    }
  }

  function negativeVals(currentVal, nextVal) {
    var reg = /^[\-]/;
    var regNext = /^[\+\-\/\*]/;
    if (reg.test(currentVal) == true && regNext.test(nextVal) == true)
      replaceLastChar();
  }

  function noMultipleDecimals(currentVal) {
    var reg = /^[\+\%\-\/\*]/;
    if (currentVal == ".") {
      counter++;
    }
    if (reg.test(currentVal) == true) {
      counter = 0;
    }
  }

  function noIncorrectPercent(currentVal, nextVal) {
    var reg = /^[\%]/;
    var regNext = /^[\%\d\.]/;

    if (reg.test(currentVal) == true && regNext.test(nextVal) == true) {
      deleteLastChar();
    }
  }

  function checkZero(prevVal, currentVal, nextVal) {
    var reg = /[\\0]/;
    var dig = /[\d]/;
    var divide = /[\/]/;

    if (
      reg.test(currentVal) == true &&
      dig.test(nextVal) == true &&
      dig.test(prevVal) == false
    ) {
      replaceLastChar();
    }
  }

  function resetCounter() {
    if (counter > 1) {
      deleteLastChar();
    }
    counter = 0;
  }

  function replaceLastChar() {
    var replace = mainScreen.substring(
      mainScreen.length - 1,
      mainScreen.length
    );
    mainScreen = mainScreen.substring(0, mainScreen.length - 2) + replace;
    $("#view").val(mainScreen);
  }

  function deleteLastChar() {
    mainScreen = mainScreen.substring(0, mainScreen.length - 1);
    $("#view").val(mainScreen);
  }
});



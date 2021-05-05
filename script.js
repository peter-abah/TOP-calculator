"use strict";

function evaluate(expr) {
    console.log(expr);
    if (expr.length !== 3) {
        return;
    }
    let operator = operators[expr[1]];
    return operator(expr[0], expr[2]);
}

function clear() {
    expression = [];
    currentNo = null;
}

function equals() {
    if (currentNo) {
        currentNo = parseInt(currentNo);
        expression = expression.concat(currentNo);
    }
    let result = evaluate(expression);
    clear();
    return result;
}

function updateNumber(input) {
    if (currentNo) {
        currentNo += input;
    } else if (input.match(/[^0]/)) {
        if (expression.length === 1) {
            clear();
        }
        currentNo = input;
    }
}

function updateOperator(input) {
    if (currentNo) {
        currentNo = parseInt(currentNo);
        if (expression.length === 0) {
            expression = expression.concat(currentNo, input);
            currentNo = null;
        } else if (expression.length === 2) {
            result = equals();
            expression = [result, input];
        }
    }
    else if (expression.length === 1) {
        expression = expression.concat(input);
    }
}

function action(e) {
    let input = this.getAttribute("data-value");

    if (input === "clear") {
        clear();
    }
    else if (input === "=") {
        result = equals();
        expression = [result]
    }
    else if (regexpNumber.test(input)) {
        updateNumber(input);
    }
    else if (regexpOperator.test(input)) {
        updateOperator(input);
    }

    updateDisplay();
}

function updateDisplay() {
    let exp = "";
    exp += expression.join(" ");
    exp += ` ${currentNo? currentNo: ""}`;
    document.querySelector(".input").textContent = exp;
    document.querySelector(".result").textContent = result ? result : "";
}

const regexpNumber = /\d/;
const regexpOperator = /[\/\*\+-]/;

let expression = [];
let currentNo;
let result;
let operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => {
        if (b === 0) return 0;
        return a / b;
    }
}

const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener("click", action));
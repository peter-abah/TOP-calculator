"use strict";

function evaluate(expr) {
    if (expr.length !== 3) {
        return expr[0] ? expr[0] : null;
    }
    let operator = operators[expr[1]];
    let result = operator(expr[0], expr[2]);
    return (Math.round(result * 1e15) / 1e15)
}

function clear() {
    expression = [];
    currentNo = null;
}

function equals() {
    if (currentNo) {
        currentNo = parseFloat(currentNo);
        expression = expression.concat(currentNo);
    }
    let result = evaluate(expression);
    clear();
    return result;
}

function del() {
    if (currentNo) {
        currentNo = currentNo.slice(0, -1);
    } else {
        expression.pop();
    }
}

function updateNumber(input) {
    if (currentNo) {
        if (currentNo.length > 15) return;
        if (currentNo === "0" && input !== ".") return;
        if (input === "." && currentNo.indexOf(input) !== -1) return;
        currentNo += input;
    } else {
        if (input === ".") return;
        if (expression.length === 1) {
            clear();
        }
        currentNo = input;
    }
}

function updateOperator(input) {
    if (currentNo) {
        currentNo = parseFloat(currentNo);
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

function action(input) {
    result = "";

    if (input === "clear") {
        clear();
    }
    if (input === "del") {
        del();
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
    document.querySelector(".exp").textContent = exp;
    document.querySelector(".result").textContent = result ? result : "";
}

const regexpNumber = /[\d\.]/;
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
buttons.forEach(button => button.addEventListener("click", e => {
    let input = button.getAttribute("data-value");
    action(input);
}));

window.addEventListener("keydown", e => {
    let key = e.key;
    switch(key) {
        case "Enter":
            key = "=";
            break;
        case "Backspace":
            key = "del";
    }
    action(key);
});
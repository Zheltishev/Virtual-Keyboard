import { keyboardLayout } from './keyboardLayout.js';

const app = document.querySelector('.app');
const textArea = document.createElement('textarea');
const keyboard = document.createElement('div');
let lang = 'ru';
let shiftState = false;
let altState = false;
let capsState = false;
let tabState = false;
let enterState = false;
let backspaceState = false;
let deleteState = false;
let upState = false;
let downState = false;
let leftState = false;
let rightState = false;
let spaceState = false;

textArea.classList.add('text-area');
keyboard.classList.add('keyboard');
app.insertAdjacentElement('afterbegin', textArea);
app.insertAdjacentElement('beforeend', keyboard);

function generateKeyboard() {
    keyboard.innerHTML = '';

    keyboardLayout.forEach(str => {
        const keyboardString = document.createElement('div');

        keyboardString.classList.add('keyboard-string');
        keyboard.insertAdjacentElement('beforeend', keyboardString)

        str.forEach(key => {
            const keyboardButton = document.createElement('button');

            keyboardButton.classList.add('keyboard-button')
            keyboardButton.innerText = key[`${lang}`];
            keyboardButton.dataset.code = key.code;
            keyboardButton.dataset.type = key.type;
            keyboardString.insertAdjacentElement('beforeend', keyboardButton);
        })
    })

    document.querySelectorAll('.keyboard-button').forEach(e => {
        switch (e.textContent) {
            case 'Space': 
                e.style.flexGrow = 8; 
                break;
            case 'Shift': 
                e.style.flexGrow = 2; 
                break;
        }
    })
}

document.addEventListener('DOMContentLoaded', generateKeyboard());

document.addEventListener('keydown', key => {
    key.preventDefault();

    document.querySelectorAll('.keyboard-button').forEach(e => {
        if (key.code == e.dataset.code) {
            workWithCharacter(e, 'down');
        }
    })
})

document.addEventListener('keyup', key => {
    key.preventDefault();

    document.querySelectorAll('.keyboard-button').forEach(e => {
        if (key.code == e.dataset.code && key.code != 'CapsLock') {
            workWithCharacter(e, 'up');
        }
    })
})

document.addEventListener('mousedown', key => {
    textArea.focus();
    
    if (key.target.classList.contains('keyboard-button')) {
        workWithCharacter(key.target, 'down');
    }
})

document.addEventListener('mouseup', key => {
    let keyCode = key.target.dataset.code;

    if (key.target.classList.contains('keyboard-button') && keyCode != 'CapsLock') {
        workWithCharacter(key.target, 'up');
    }
})

function workWithCharacter(elem, eventDirection){
    const elemCode = elem.dataset.code;
    const elemType = elem.dataset.type;
    const eventType = eventDirection;

    changeButtonStyle(elemCode, eventType)

    if (elemType == 'simple' && eventType == 'down') {
        changeTextAtCursor(elem)
    }

    if (elemType == 'func') {
        switch (elemCode) {
            case 'ShiftLeft': 
                changeLanguage(elemCode, eventType);
                break;
            case 'ShiftRight': 
                changeLanguage(elemCode, eventType);
                break;
            case 'AltLeft': 
                changeLanguage(elemCode, eventType);
                break;
            case 'CapsLock': 
                changeCaps();
                break;
            case 'Space': 
                pressedSpace();
                break;
            case 'Tab': 
                pressedTab();
                break;
            case 'Enter': 
                pressedEnter();
                break;
            case 'Backspace': 
                pressedBackspace();
                break;
            case 'Delete': 
                pressedDelete();
                break;
            case 'ArrowUp': 
            case 'ArrowDown': 
            case 'ArrowLeft': 
            case 'ArrowRight': 
                arrow(elemCode);
                break;
        }
    }
}

function changeButtonStyle(elemCode, type) {
    document.querySelectorAll('.keyboard-button').forEach(e => {
        if (e.dataset.code == elemCode && type == 'down' && elemCode != 'CapsLock') {
            e.classList.add('press')
        }
        
        if (e.dataset.code == elemCode && type == 'up' && elemCode != 'CapsLock') {
            e.classList.remove('press')
        }
    })
}

function changeLanguage(elemCode, eventType) {
    if (eventType == 'down' && (elemCode == 'ShiftLeft' || elemCode == 'ShiftRight')) {
        shiftState = true;
    }

    if (eventType == 'down' && elemCode == 'AltLeft') {
        altState = true;
    }
    
    if (eventType == 'up' && (elemCode == 'ShiftLeft' || elemCode == 'ShiftRight')) {
        shiftState = false;
    }

    if (eventType == 'up' && elemCode == 'AltLeft') {
        altState = false;
    }

    if (shiftState) {
        lang.includes('ru') ? lang = 'ruShift' : lang = 'enShift';
        generateKeyboard();
    }

    if (!shiftState) {
        lang.includes('ru') ? lang = 'ru' : lang = 'en';
        generateKeyboard();
    }

    if (shiftState && altState) {
        lang.includes('ru') ? lang = 'en' : lang = 'ru';
        generateKeyboard();
    }
}

function changeTextAtCursor(elem) {
    const textValue = textArea.value;
    let startIndex = textArea.selectionStart;
    let endIndex = textArea.selectionEnd;

    if (capsState || shiftState) {
        textArea.value = textValue.slice(0, startIndex) + elem.textContent.toUpperCase() + textValue.slice(endIndex);
    } else {
        textArea.value = textValue.slice(0, startIndex) + elem.textContent + textValue.slice(endIndex);
    }

    textArea.selectionStart = textArea.selectionEnd = startIndex + 1;
}

function changeCaps() {
    capsState ? capsState = false : capsState = true;

    document.querySelectorAll('.keyboard-button').forEach(e => {
        if (e.dataset.code == 'CapsLock') {
            e.classList.toggle('press');
        } 
    })
}

function pressedSpace() {
    if (!spaceState) {
        const textValue = textArea.value;
        let startIndex = textArea.selectionStart;
        let endIndex = textArea.selectionEnd;

        spaceState = true;
        textArea.value = textValue.slice(0, startIndex) + ' ' + textValue.slice(endIndex);
        textArea.selectionStart = textArea.selectionEnd = startIndex + 1;
    } else {
        spaceState = false;
    }
}

function pressedTab() {
    if (!tabState) {
        let textValue = textArea.value;
        let endIndex = textArea.selectionEnd;

        tabState = true;
        textArea.value = textValue.slice(0, endIndex) + '\t' + textValue.slice(endIndex);
        textArea.selectionStart = textArea.selectionEnd = endIndex + 1;
    } else {
        tabState = false;
    }
}

function pressedEnter() {
    if (!enterState) {
        let textValue = textArea.value;
        let endIndex = textArea.selectionEnd;

        enterState = true;
        textArea.value = textValue.slice(0, endIndex) + '\n' + textValue.slice(endIndex);
        textArea.selectionStart = textArea.selectionEnd = endIndex + 1;
    } else {
        enterState = false;
    }
}

function pressedBackspace() {
    if (!backspaceState) {
        let textValue = textArea.value;
        let startIndex = textArea.selectionStart;
        let endIndex = textArea.selectionEnd;

        backspaceState = true;

        if (endIndex - startIndex > 0) {
            textArea.value = textValue.slice(0, startIndex) + textValue.slice(endIndex);
            textArea.selectionStart = textArea.selectionEnd = startIndex;
        } else {
            textArea.value = textValue.slice(0, endIndex - 1) + textValue.slice(endIndex);
            textArea.selectionStart = textArea.selectionEnd = endIndex - 1;
        }
    } else {
        backspaceState = false;
    }
}

function pressedDelete() {
    if (!deleteState) {
        let textValue = textArea.value;
        let startIndex = textArea.selectionStart;
        let endIndex = textArea.selectionEnd;

        deleteState = true;

        if (endIndex - startIndex > 0) {
            textArea.value = textValue.slice(0, startIndex) + textValue.slice(endIndex);
            textArea.selectionStart = textArea.selectionEnd = startIndex;
        } else {
            textArea.value = textValue.slice(0, startIndex) + textValue.slice(endIndex + 1);
            textArea.selectionStart = textArea.selectionEnd = endIndex;
        }
    } else {
        deleteState = false;
    }
}

function arrow(e) {
    let startIndex = textArea.selectionStart;
    let endIndex = textArea.selectionEnd;

    if (e == 'ArrowLeft' && !leftState) {
        leftState = true;

        if (endIndex - startIndex > 0) {
            textArea.selectionStart = textArea.selectionEnd = startIndex;
        } else {
            textArea.selectionStart = textArea.selectionEnd = startIndex - 1;
        }
    } else {
        leftState = false;
    }

    if (e == 'ArrowRight' && !rightState) {
        rightState = true;

        if (endIndex - startIndex > 0) {
            textArea.selectionStart = textArea.selectionEnd = endIndex;
        } else {
            textArea.selectionStart = textArea.selectionEnd = endIndex + 1;
        }
    } else {
        rightState = false;
    }

    if (e == 'ArrowUp' && !upState) {
        upState = true;
        textArea.selectionStart = textArea.selectionEnd = 0
    } else {
        upState = false;
    }

    if (e == 'ArrowDown' && !downState) {
        downState = true;
        textArea.selectionStart = textArea.selectionEnd = textArea.value.length
    } else {
        downState = false;
    }
}
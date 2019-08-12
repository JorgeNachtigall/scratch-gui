import io from "socket.io-client";

let socket = null;

window.addEventListener("load", () => {
    socket = io("https://elimu-analyzer.herokuapp.com/");
    let codeClass = "";
    while (!codeClass)
        codeClass = prompt("Insira o código da sua turma:");

    socket.emit('setClass', codeClass);
});

let eventWrapper = function (eventName) {
    return function () {
        newState(eventName, this);
    }
}

let newState = function (event, vm) {
    window.vmScratch = vm;
    if (socket) {
        socket.emit('newState', {
            event,
            state: vm.toJSON()
        });
    }
}

export default {
    bindEvents(vm) {
        vm.on("MONITORS_UPDATE", eventWrapper("MONITORS_UPDATE"));
        vm.on("BLOCK_DRAG_UPDATE", eventWrapper("BLOCK_DRAG_UPDATE"));
        vm.on("TURBO_MODE_ON", eventWrapper("TURBO_MODE_ON"));
        vm.on("TURBO_MODE_OFF", eventWrapper("TURBO_MODE_OFF"));
        vm.on("PROJECT_RUN_START", eventWrapper("PROJECT_RUN_START"));
        vm.on("PROJECT_RUN_STOP", eventWrapper("PROJECT_RUN_STOP"));
    }
}

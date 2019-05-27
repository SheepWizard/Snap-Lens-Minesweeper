// -----JS CODE-----
//@input Component.ScriptComponent cellMessage

function touchEnd(event){
    script.cellMessage.api.cellClickedEnd(event);
}

function touchStart(event){
    script.cellMessage.api.cellClickedStart(event);
}

var touchEndEvent = script.createEvent("TouchEndEvent");
touchEndEvent.bind(touchEnd);

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(touchStart);



chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if(request.todo == 'appendHTML'){
        fetch('../graph.html')
            .then(response => response.text())
            .then(text => sendResponse({htmlResponse : text}))
        return true;
    }
});
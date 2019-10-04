function setURLArg(arg, val) {
    if (window.location.href.match(arg + '=([^&]*)')) {
        window.location.href = window.location.href.replace(eval('/(' + arg + '=)([^&]*)/gi'), arg + '=' + val)
    } else {
        window.location.href += (window.location.href.match('[\?]') ? '&' : '?') + (arg + '=' + val)
    }
}

function getURLArg(arg) {
    let result = window.location.search.substr(1).match(new RegExp("(^|&)" + arg + "=([^&]*)(&|$)", "i"))
    return result ? unescape(result[2]) : null
}

function makeOrderTopic(mapName, id) {
    return `/order/${mapName}/${id}`
}

function makeStatusTopic(mapName, id) {
    return `/status/${mapName}/${id}`
}

function splitTopic(topic) {
    let s = topic.toString().split("/").filter(t => t !== "")
    return {type: s[0], mapName: s[1], id: s[2]}
}
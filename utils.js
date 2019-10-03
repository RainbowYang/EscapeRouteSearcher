Date.prototype.Format = function (format) {
    let o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o)
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    return format
}

module.exports = {
    info(name) {
        return (...rest) =>
            console.log(`[${new Date().Format("yyyy/MM/dd hh:mm:ss.S")}]`, `[${name.toString()}]`, ...rest)
    },
    getMqttAddress() {
        let info = require("./config.json")
        return `mqtt://${info.mqtt.ip}:${info.mqtt.port}`
    },
    makeOrderTopic(mapName, id) {
        return `/order/${mapName}/${id}`
    },
    makeStatusTopic(mapName, id) {
        return `/status/${mapName}/${id}`
    },
    splitTopic(topic) {
        let s = topic.toString().split("/").filter(t => t !== "")
        return {type: s[0], mapName: s[1], id: s[2]}
    }
}
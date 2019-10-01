class DataManagerProxy {
    constructor(metadata, callback) {
        this.metadata = metadata

        this.proxy = mqtt.connect(`mqtt://95.169.7.185:9001`, {clientId: "1111"})
        this.proxy.on('connect', () =>
            this.metadata.nodes.forEach(node => {
                this.proxy.subscribe(`/status/${metadata.map_name}/${node.id}`, {qos: 1})
            }))
        this.proxy.on('message', (topic, payload) => {
            let data = topic.split("/").filter(t => t !== "")
            let id = data[2]
            switch (data[0]) {
                case 'status':
                    console.log(this.metadata.nodes, data[1])
                    this.metadata.nodes.filter(node => node.id.toString() === id).forEach(node => node.status = payload.toString())
                    break
                case 'order':
                    this.metadata.nodes.filter(node => node.id.toString() === id).forEach(node => node.order = payload.toString())
                    break
            }
            callback()
        })
    }
}
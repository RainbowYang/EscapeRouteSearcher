class MapManager {
    constructor(map, callback) {
        this.map = map
        this.name = "MapManager"
        this.callback = () => callback(this.getData())
        this.changed = true
        this.render = new MapManager.Render(this)
        this.proxy = new MapManager.Proxy(this, () => {
            this.changed = true
            this.callback()
        })

        this.map.nodes.forEach(node => node.isExit = map.exits.indexOf(node.id) !== -1)
        this.callback()
    }

    // 得到能用于G6的数据
    getData() {
        if (this.changed) {
            this.changed = false
            this.data = {
                nodes: this.map.nodes.map(MapManager.Render.renderNode),
                edges: this.map.edges.map(MapManager.Render.renderEdge)
            }
        }
        return this.data
    }
}

MapManager.Render = class MapManagerRender {
    static renderNode(node) {
        let res = Object.assign({}, node, {
            id: node.id.toString(),
            shape: 'background-animate',
            color: '#909399',
            size: 20,
            label: node.isExit ? "EXIT" : node.id,
            labelCfg: {
                position: 'right'
            }
        })

        if (node.status) {
            switch (node.status) {
                case '0':
                    res.color = '#67c23a'
                    break
                case '1':
                    res.color = '#E6A23C'
                    break
                case '2':
                    res.color = '#F56C6C'
            }
        }

        return res
    }

    static renderEdge(edge) {
        return {
            source: edge.source.toString(),
            target: edge.target.toString(),
            label: edge.distance.toString()
        }
    }
}

MapManager.Proxy = class MapManagerProxy {
    constructor(manager, callback) {
        this.manager = manager

        this.proxy = mqtt.connect(`mqtt://95.169.7.185:9001`, {clientId: "WebMapManager_" + manager.name})
        this.proxy.on('connect', () =>
            this.manager.map.nodes.forEach(node => {
                this.proxy.subscribe(makeStatusTopic(this.manager.map.name, node.id), {qos: 1})
            })
        )
        this.proxy.on('message', (topic, payload) => {
            let {type, id} = splitTopic(topic)
            this.manager.map.nodes.filter(node => node.id.toString() === id).forEach(node => {
                if (node[type] !== payload.toString()) {
                    node[type] = payload.toString()
                    callback()
                }
            })
        })
    }
}
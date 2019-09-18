/**
 * DataProcessor用于根据节点的状态，计算节点的指令
 */
const DijkstraGraph = require("./dijkstra-graph")

class DataProcessor {
    constructor(data) {
        this.data = data

        this.graph = new DijkstraGraph(data.nodes.length)
        data.edges.forEach(edge => {
            this.graph.setEdge(edge.source, edge.target, edge.distance)
        })

        this.exits = data.nodes.filter(node => node.isExit).map(node => node.id)
    }

    updateStatus(id, status) {
        this.data.nodes.filter(node => node.id === id).forEach(node => node.status = status.toString())
    }

    getOrder(id) {
        return this.graph.Dijkstra(id, this.exits)
    }

    updateStatusAndGetOrder(id, status) {
        this.updateStatus(id, status)
        return this.getOrder(id)
    }
}

module.exports = DataProcessor

/**
 * DataProcessor用于根据节点的状态，计算节点的指令
 */
class DataProcessor {
    constructor(data) {
        this.data = data
    }

    updateStatus(id, status) {
        this.data.nodes.filter(node => node.id === id).forEach(node => node.status = status.toString())
    }

    getOrder(id) {
        //TODO 就是这里
        return "OK"
    }

    updateStatusAndGetOrder(id, status) {
        this.updateStatus(id, status)
        return this.getOrder(id)
    }
}

module.exports = DataProcessor

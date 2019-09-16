/**
 *
 * @param data 节点
 * @returns {{data: *, updateStatus: updateStatus, getOrder: (function(*): string)}}
 */
module.exports = function (data) {
    return {
        //节点数据
        data: data,
        //更新节点数据
        updateStatus: (id, status) => data.nodes.filter(node => node.id === id).forEach((node) => node.status = status.toString()),
        //返回节点应该指示的方向
        getOrder: function (id) {
            //TODO 就是这里
            return "OK"
        }
    }
}
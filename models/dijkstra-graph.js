const MAX = 1E100

class DijkstraGraph {
    //初始化地图
    constructor(vertex) {
        this.vertex = vertex

        //创建和初始化二维邻接矩阵
        this.arc = []
        for (let i = 0; i < this.vertex; i++) {
            this.arc.push([])
            for (let j = 0; j < this.vertex; j++) {
                this.arc[i].push(i === j ? 0 : MAX)
            }
        }
    }

    setEdge(source, target, weight) {
        this.arc[source][target] = weight
    }

    getPath(begin, ends) {
        //创建dis对象数组, 并初始化以这个begin为起点的dis数组
        //dis对象包含value（最短的路径值），path（最短的路径信息），visited（是否遍历）
        let dis = []
        for (let i = 0; i < this.vertex; i++) {
            dis.push({
                value: this.arc[begin][i],
                path: [begin, i],
                visited: begin === i, //将begin这个节点标记为已遍历
            })
        }

        for (let cnt = 1; cnt < this.vertex; cnt++) {
            //temp用于保存当前dis数组中值最小的下标
            let temp = 0
            //min记录当前的最小值
            let min = MAX
            for (let i = 0; i < this.vertex; i++) {
                if (!dis[i].visited && dis[i].value < min) {
                    min = dis[i].value
                    temp = i
                }
            }
            //标记遍历过的节点
            dis[temp].visited = true
            //把temp对应的节点加入到已经找到的最短路径中（更新value和path）
            for (let i = 0; i < this.vertex; i++) {
                let temp_i_dis = dis[temp].value + this.arc[temp][i]
                if (!dis[i].visited && temp_i_dis < dis[i].value && this.arc[temp][i] < MAX) {
                    dis[i].value = temp_i_dis
                    dis[i].path = dis[temp].path.concat(i)
                }
            }
        }
        //有多个end时，返回最短的路径
        return dis[ends[ends.reduce((tmp, cur, i) => dis[i].value < dis[tmp].value ? i : tmp, 0)]].path
    }
}

module.exports = DijkstraGraph
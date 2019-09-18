class DijkstraGraph {
    //初始化地图
    constructor(vertex) {
        this.vertex = vertex

        //创建和初始化二维邻接矩阵
        this.arc = []
        for (let i = 0; i < this.vertex; i++) {
            this.arc.push([])
            for (let j = 0; j < this.vertex; j++) {
                this.arc[i].push(i === j ? 0 : Number.MAX_VALUE)
            }
        }
    }

    setEdge(source, target, weight) {
        //其实也可以直接存所有的edge，不存在的就返回无穷大
        // 感觉二维矩阵有点浪费
        this.arc[source][target] = this.arc[target][source] = weight
    }

    Dijkstra(begin, end) {
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
            let min = Number.MAX_VALUE
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
                if (!dis[i].visited && temp_i_dis < dis[i].value && this.arc[temp][i] < Number.MAX_VALUE) {
                    dis[i].value = temp_i_dis
                    dis[i].path = dis[temp].path.concat(i)
                }
            }
        }

        if (dis[end].value < Number.MAX_VALUE) {
            return dis[end].path
        } else {
            return []
        }
    }
}

module.exports = DijkstraGraph

// let graph = new DijkstraGraph(10)
// //初始化，以后还要加一些判断边数和顶点数是否合法，关系如下：
// //顶点数和边数的关系是：((vertex*(vertex - 1)) / 2) < edge
// //创建领接矩阵先用前端布好的位置,以后可以用前端的数据来更新领接矩阵
// graph.setEdge(1, 3, 100)
// graph.setEdge(1, 6, 100)
// graph.setEdge(2, 4, 100)
// graph.setEdge(3, 8, 100)
// graph.setEdge(2, 5, 200)
// graph.setEdge(5, 8, 100)
// graph.setEdge(4, 7, 100)
// graph.setEdge(6, 7, 250)
//
// //将节点1作为起点,将节点8作为终点
// console.log(graph.Dijkstra(1, 8))

//然后把最短路径经过的节点，在前端亮起来， 把shape的 'circle-animate'属性改成 'background-animate',再加上color: '#40a9ff'
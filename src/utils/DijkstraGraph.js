const MAX = Number.MAX_SAFE_INTEGER
const repeat = (count) => '0'.repeat(count).split('')

class DijkstraGraph {

  //初始化地图
  constructor (vertex = 16) {
    this.vertex = vertex

    // 将外部使用的任意node_id，映射到邻接矩阵的下标node_index
    this.nodeMap = []

    //初始化二维邻接矩阵
    this.matrix =
      repeat(vertex).map((_, i) =>
        repeat(vertex).map((_, j) =>
          //邻接矩阵的对角线为0，其余默认最大
          i === j ? 0 : MAX))
  }

  indexOf (node_id) {
    if (this.nodeMap.indexOf(node_id) === -1) {
      this.nodeMap.push(node_id)
    }
    return this.nodeMap.indexOf(node_id)
  }

  /**
   * 添加一些边并设置权重，所有未添加的边的权重默认为最大
   * @param {*} from_id - 起点的id
   * @param {*} to_id - 终点的id
   * @param {number} weight - 边的权重
   * @param {boolean} [both=false] - 是否同时添加反向的边，默认为false
   */
  setEdge (from_id, to_id, weight, both = false) {
    let [from_index, to_index] = [this.indexOf(from_id), this.indexOf(to_id)]
    this.matrix[from_index][to_index] = weight
    if (both) {
      this.matrix[to_index][from_index] = weight
    }
  }

  /**
   * 获取从begin到ends的
   * @param {*} begin_id - 起点的id
   * @param {Array.<*>} ends_id - 所有终点的id
   * @returns {Array.<*>} 返回所有路径中最短一条，格式为沿途的所有节点的id的Array
   */
  getPath (begin_id, ends_id) {
    let begin_index = this.indexOf(begin_id)

    //创建dis对象数组, 并初始化以这个begin为起点的dis数组
    //dis对象包含value（最短的路径值），path（最短的路径信息），visited（是否遍历）
    let dis = repeat(this.matrix.length).map((_, i) => ({
      value: this.matrix[begin_index][i],
      path: [begin_index, i],
      visited: begin_index === i, //将begin这个节点标记为已遍历
    }))

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
        let temp_i_dis = dis[temp].value + this.matrix[temp][i]
        if (!dis[i].visited && temp_i_dis < dis[i].value && this.matrix[temp][i] < MAX) {
          dis[i].value = temp_i_dis
          dis[i].path = dis[temp].path.concat(i)
        }
      }
    }

    let end_index = Array.isArray(ends_id) ?
      //有多个end时，返回最短的路径
      ends_id.map(this.indexOf.bind(this)).reduce(
        (min, now) => dis[now].value < dis[min].value ? now : min)
      : this.indexOf(ends_id)

    // console.log(dis)
    return dis[end_index].path.map(value => this.nodeMap[value])
  }
}

module.exports = { DijkstraGraph }

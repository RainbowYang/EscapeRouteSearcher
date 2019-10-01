# Escape-route-searcher

## 后端
broker已经搭建在服务器上

### data-processor
用于根据节点的状态，计算节点的指令 
#### data-processor-proxy
为 data-processor 完成mqtt通信
### door-node
用于模拟一个门锁火灾检测节点

## 前端
暂无 

## 数据解释
### data.json
+ maps
  + map
    + name
    + nodes
    + edges 
    + exits
#### node
|  name  |  type |
|:------:|:-----:|
|   id   |  int  |
|  label | string|
|   x    |  int  |
|   y    |  int  |
| isExit |boolean|
#### edge
|  name  |  type |
|:------:|:-----:|
| source |  int |
| target |  int |
|distance|  int |
### 主题
#### 状态
/status/[map_name]/[node_id] 
#### 指示
/order/[map_name]/[node_id] 
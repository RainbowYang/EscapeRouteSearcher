# Escape-route-searcher

## 使用
nodejs 运行 app.js 

## 前端
访问 localhost:3000 => 主管理页面 

## 后端
### mqtt主题
+ 状态 /status/[map_name]/[node_id] 
+ 指示 /order/[map_name]/[node_id] 

### map数据
来自mongodb
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

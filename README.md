# Escape Route Searcher

## 前端
前端见 [EscapeRouteSearcher_Web](https://github.com/RainbowYang/EscapeRouteSearcher_Web)

## 后端

### 与嵌入式模块的连接
主要使用Mqtt协议进行数据传输。

#### topic 规定
+ status/{map_id}/{node_id}

    该主题用来传输节点的状态。
    
    目前状态规定正常为0，异常为1，紧急为2，越严重数字越大

+ order/{map_id}/{node_id}

    该主题用来传输节点的指令，为由该节点到出口的最短安全路径。
    
    由路径上所有节点的 id 拼接而成，以空格间隔。

### RESTful API

#### 关于Map 

#### 获取地图（或其部分参数）
`GET` /api/maps?id={id}&want={want}

#### 添加（或更新）地图
`POST` /api/maps

body最好是json，格式见下

#### 删除地图
`DELETE`  /api/maps?id={id}

#### 获取节点实时状态
`GET` /api/nodes?map_id={map_id}&node_id={node_id}

```js
const MapSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String }, // 用于显示，如果不存在则显示id
  nodes: [{
    id: { type: String, required: true },
    name: { type: String }, // 用于显示，如果不存在则显示id
    location: {
      type: { x: Number, y: Number }, required: true
    },
    isExit: { type: Boolean, required: true, default: false },
  }],
  edges: [{
    source: { type: String, required: true, },
    target: { type: String, required: true },
    distance: { type: Number, required: true, min: 0 }
  }],
  updated: { type: Date, default: Date.now },
})
```

```js
const NodeStatusSchema = new Schema({
  map_id: { type: String, required: true },
  id: { type: String, required: true },
  status: { type: Number, default: 0, min: 0 }, // 目前用数字表示，越大表示越严重
  path: [String], // 路径为同一个地图的节点的id的数组
  updated: { type: Date, default: Date.now },
})
```


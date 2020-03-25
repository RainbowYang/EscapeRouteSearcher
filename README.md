# Escape Route Searcher

## 前端
前端见 [EscapeRouteSearcher_Web](https://github.com/RainbowYang/EscapeRouteSearcher_Web)

## 后端

### 与嵌入式模块的连接

主要使用Mqtt协议进行数据传输。

#### topic 规定
+ /status/`{map_name}/{node_id}

    该主题用来传输节点的状态。
    
    目前状态规定正常为0，异常为1，紧急为2，越严重数字越大


+ /order/{map_name}/{node_id}

    该主题用来传输节点的指令，为由该节点到出口的最短安全路径。
    
    由路径上所有节点的 id 拼接而成，以空格间隔。

### RESTful API

#### 获取地图（或其部分参数）
`GET` /api/maps?name={name}&require={require}

#### 添加（或更新）地图
`POST` /api/maps

#### 删除地图
`DELETE`  /api/maps?name={name}

#### 获取节点实时状态

`GET` /api/nodes?map_name={map_name}&id={id}

```js
let MapType = {
    name: String,
    nodes: [{
        id: String,
        x: Number,
        y: Number,
        isExit: Boolean
    }],
    edges:[{
        source: String,
    	target: String,
    	distance: Number	
    }],
    updated: Date
}
```

```js
let NodeType = {
	map_name: String,
    id: String,
    status: Number,
    path: [String],
    updated: Date
}
```


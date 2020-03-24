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


#### 节点实时状态


#### Maps
定义Map类型为
```javascript
return  {
   name: String,
   nodes: [{
       id: String,
       x: Number,
       y: Number
   }],
   edges: [{
       source: String,
       target: String,
       distance: Number
   }],
   updated: Date
}
```

+ GET /api/maps 

获取所有地图名字

```javascript
return [String]
```

+ GET   /api/maps/{name}

获取指定地图当前信息

```javascript
return Map
```

+ GET   /api/maps/{name}/history
获取指定地图所有历史信息
```javascript
return [Map]
```

+ POST   /api/maps   添加指定地图

需要json，格式见Map

+ DELETE  /api/maps/{name}   删除指定地图

#### Node_status
```js
let node_status = {
    map_name: String,
    id: String,
    status: Number,
    order: [String],
}
```


+ GET    /api/nodes/{map_name} 获取指定地图所有节点信息

```javascript
return [node_status]
```

+ GET    /api/nodes/{map_name}/{id} 获取指定地图指定节点信息

```javascript
return node_status
```



## 前端

访问 localhost:3000 => 主管理页面 

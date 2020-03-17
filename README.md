# Escape-route-searcher

## 后端

### MQTT

#### /status/{name}/{id}

格式：正常为0，越严重数字越大

嵌入式 通过主题 发布该节点状态

后端 订阅该主题 获取节点状态

#### /order/{name}/{id}

格式：路径，以空格间隔的节点id组成

嵌入式 通过主题 获取该节点通知

后端 发布该主题 通知节点




### REST接口
#### Maps
定义Map类型为
```javascript
let Map = {
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
   exits: [String],
   updated: {type: Date, default: Date.now},
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

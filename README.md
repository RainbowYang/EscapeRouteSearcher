## Escape-route-searcher

### 后端

#### MQTT

##### /status/{name}/{id}

格式：正常为0，越严重数字越大

嵌入式 通过主题 发布该节点状态

后端 订阅该主题 获取节点状态

##### /order/{name}/{id}

格式：路径，以空格间隔的节点id组成

嵌入式 通过主题 获取该节点通知

后端 发布该主题 通知节点




#### REST接口
##### /api/maps  
+ GET 

获取所有地图名字

```typescript
return [String]
```

#####  /api/maps/{name}

+ GET   

获取指定地图当前信息

```typescript
return {
    name:String,
    nodes:[{id:String, x:Number, y:Number}],
    edges:[{source:String, target:String, distance:Number}],
    exits:[String]
}
```

+ POST    创建指定地图

+ PUT    更新指定地图

+ ~~DELETE    删除指定地图~~

##### /api/nodes/{name}

+ GET    

获取指定地图所有节点信息

```typescript
return [{id:String, status:Number, order:[String]}]
```



### 前端

访问 localhost:3000 => 主管理页面 
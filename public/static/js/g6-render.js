class G6Render {
    constructor() {
        let Util = G6.Util
        G6.registerNode('background-animate', {
            afterDraw: function afterDraw(cfg, group) {
                let r = cfg.size / 2
                let back1 = group.addShape('circle', {
                    zIndex: -3,
                    attrs: {
                        x: 0,
                        y: 0,
                        r: r,
                        fill: cfg.color,
                        opacity: 0.6
                    }
                })
                let back2 = group.addShape('circle', {
                    zIndex: -2,
                    attrs: {
                        x: 0,
                        y: 0,
                        r: r,
                        fill: cfg.color, // 为了显示清晰，随意设置了颜色
                        opacity: 0.6
                    }
                })

                let back3 = group.addShape('circle', {
                    zIndex: -1,
                    attrs: {
                        x: 0,
                        y: 0,
                        r: r,
                        fill: cfg.color,
                        opacity: 0.6
                    }
                })
                group.sort() // 排序，根据zIndex 排序
                back1.animate({ // 逐渐放大，并消失
                    r: r + 10,
                    opacity: 0.1,
                    repeat: true // 循环
                }, 3000, 'easeCubic', null, 0) // 无延迟

                back2.animate({ // 逐渐放大，并消失
                    r: r + 10,
                    opacity: 0.1,
                    repeat: true // 循环
                }, 3000, 'easeCubic', null, 1000) // 1 秒延迟

                back3.animate({ // 逐渐放大，并消失
                    r: r + 10,
                    opacity: 0.1,
                    repeat: true // 循环
                }, 3000, 'easeCubic', null, 2000) // 2 秒延迟
            }
        }, 'circle')
        G6.registerNode('inner-animate', {
            afterDraw: function afterDraw(cfg, group) {
                let size = cfg.size
                let width = size[0] - 12
                let height = size[1] - 12
                let image = group.addShape('image', {
                    attrs: {
                        x: -width / 2,
                        y: -height / 2,
                        width: width,
                        height: height,
                        img: cfg.img
                    }
                })
                image.animate({
                    onFrame: function onFrame(ratio) {
                        let matrix = Util.mat3.create()
                        let toMatrix = Util.transform(matrix, [['r', ratio * Math.PI * 2]])
                        return {
                            matrix: toMatrix
                        }
                    },
                    repeat: true
                }, 3000, 'easeCubic')
            }
        }, 'rect')
        G6.registerEdge('circle-running', {
            afterDraw(cfg, group) {
                // 获得当前边的第一个图形，这里是边本身的 path
                const shape = group.get('children')[0]
                // 边 path 的起点位置
                const startPoint = shape.getPoint(0)

                // 添加红色 circle 图形
                const circle = group.addShape('circle', {
                    attrs: {
                        x: startPoint.x,
                        y: startPoint.y,
                        fill: '#1890ff',
                        r: 3
                    }
                })

                // 对红色圆点添加动画
                circle.animate({
                    // 动画重复
                    repeat: true,
                    // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
                    onFrame(ratio) {
                        // 根据比例值，获得在边 path 上对应比例的位置。
                        const tmpPoint = shape.getPoint(ratio)
                        // 返回需要变化的参数集，这里返回了位置 x 和 y
                        return {
                            x: tmpPoint.x,
                            y: tmpPoint.y
                        }
                    }
                }, 3000) // 一次动画的时间长度
            }
        }, 'line')
        const dashArray = [
            [0, 1],
            [0, 2],
            [1, 2],
            [0, 1, 1, 2],
            [0, 2, 1, 2],
            [1, 2, 1, 2],
            [2, 2, 1, 2],
            [3, 2, 1, 2],
            [4, 2, 1, 2]
        ]

        const lineDash = [4, 2, 1, 2]
        const interval = 9 // lineDash 的和
        G6.registerEdge('line-dash', {
            afterDraw(cfg, group) {
                // 获得该边的第一个图形，这里是边的 path
                const shape = group.get('children')[0]
                // 获得边的 path 的总长度
                const length = shape.getTotalLength()
                let totalArray = []
                // 计算出整条线的 lineDash
                for (let i = 0; i < length; i += interval) {
                    totalArray = totalArray.concat(lineDash)
                }

                let index = 0
                // 边 path 图形的动画
                shape.animate({
                    // 动画重复
                    repeat: true,
                    // 每一帧的操作，入参 ratio：这一帧的比例值（Number）。返回值：这一帧需要变化的参数集（Object）。
                    onFrame() {
                        const cfg = {
                            lineDash: dashArray[index].concat(totalArray)
                        }
                        // 每次移动 1
                        index = (index + 1) % interval
                        // 返回需要修改的参数集，这里只修改了 lineDash
                        return cfg
                    }
                }, 3000)  // 一次动画的时长为 3000
            }
        }, 'line')

        this.graph = new G6.Graph({
            container: 'mountNode',
            width: window.innerWidth,
            height: window.innerHeight,
            edgeStyle: {
                default: {
                    lineWidth: 2,
                    stroke: '#b41400'
                }
            },
            defaultEdge: {
                shape: 'line',
                style: {
                    lineWidth: 2,
                    stroke: '#67c23a'
                }
            }
        })
    }

    renderMap(data) {
        this.graph.data(data)
        this.graph.render()
    }
}
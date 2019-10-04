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

        this.graph = new G6.Graph({
            container: 'mountNode',
            width: window.innerWidth,
            height: window.innerHeight,
            edgeStyle: {
                default: {
                    lineWidth: 1,
                    stroke: '#b5b5b5'
                }
            }
        })
    }

    renderMap(data) {
        this.graph.changeData(data)
        this.graph.render()
    }
}
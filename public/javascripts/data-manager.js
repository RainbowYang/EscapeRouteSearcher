class DataManager {
    constructor(callback) {
        this.callback = callback
        $.getJSON('/static/data.json', data => {
            this.metadata = data.test //TODO 暂时使用test
            this.changed = true
            this.callback(this.getData())

            this.proxy = new DataManagerProxy(this.metadata, () => {
                this.changed = true
                this.callback(this.getData())
            })
        })
    }

    // 得到能用于G6的数据
    getData() {
        if (this.changed) {
            this.changed = false
            this.data = {
                nodes: this.metadata.nodes.map(this.generateNode),
                edges: this.metadata.edges.map(this.generateEdge)
            }
        }
        return this.data
    }

    generateNode(node) {
        if (node.isExit) {
            return Object.assign({}, node, {
                id: node.id.toString(),
                size: [40, 40],
                shape: 'inner-animate',
                img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAByUlEQVR4Xu2b0U3DMBRFbzdgA2ACugEwCWwATFCYAJgAmASYgBVgAzYAPcmRkIXi2LdxU+lE6p+dlxyfd/vheCWuUQIr+IwTAFDBEAAByAsRDOpk0Km3TrPNfnfv7Bq0kXQt6cB9kBnnP0i6ab2/A+hJ0mVr4c7zHtNCVpdtBbSW9JGqRfFbSd/V1eedEFbHc12lMseSPmtLtgKKtrqX9CXpqLZo5/EB5TC1WbRb1dUKKFYm8idC8CxVfK2qPP/g81TiTVL8idwlo6oqbxPQT1Xl+QcP77Y4QC8tvb4lXtHuF+leiwUUaseq7eKKdh9aHUD/rACACloCCEBecmEQBmGQRwCDPH5kEAZhkEcAgzx+ZBAGYZBHAIM8fmQQBmGQRwCDPH5kEAZNMyjfgxs2BTEo8QPQhFaKIbHXfvJnWxmDMnD5tjKAADQtpIdRGFTgFRkUH3M9px8tNiG8+XhhBBIGYVBdSOejMQiDMMgjgEEePzIIgzDII4BBHj8yCIMwyCOAQR4/MgiDMMgjgEEev8VlkPc6fWfv5Mxq31f0qnUFFGdDl34cPMcZx8O7nZv31nKPZrceC9+jV/QeFUAFfgACEC3mESjM/gUDfYpYai4DdAAAAABJRU5ErkJggg==',
                label: "EXIT",
                labelCfg: {
                    position: 'top'
                }
            })
        }

        let n = Object.assign({}, node, {
            id: node.id.toString(),
            shape: 'background-animate',
            color: '#909399',
            size: 20,
            label: node.id,
            labelCfg: {
                position: 'right'
            }
        })

        if (node.status) {
            switch (node.status) {
                case '0':
                    n.color = '#67c23a'
                    break
                case '1':
                    n.color = '#E6A23C'
                    break
                case '2':
                    n.color = '#F56C6C'
            }
        }

        return n
    }

    generateEdge(edge) {
        return {
            source: edge.source.toString(),
            target: edge.target.toString(),
            label: edge.distance.toString()
        }
    }
}

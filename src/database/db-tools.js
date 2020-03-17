const {maps_coll, nodes_coll} = require("./db")

async function getAllMaps() {
    return (await maps_coll()).find().toArray()
}

async function getMap(name) {
    return (await maps_coll()).findOne({name})
}

async function addMap(map) {
    return (await maps_coll()).insertOne(map)
}

async function updateMap(name, map) {
    return (await maps_coll()).updateOne({name}, map)
}

async function deleteMap(name, map) {
    return (await maps_coll()).deleteOne({name})
}

async function getNodes(name){
    (await nodes_coll()).findOne({name})
}

module.exports = {
    maps: {
        getAll: getAllMaps,
        get: getMap,
        add: addMap,
        update: updateMap,
        delete: deleteMap,
    },
    nodes: {
        get: async (name) => (await nodes_coll()).findOne({name}),
        put:
            async (name, nodes) => (await nodes_coll()).insertOne({name}),
    }
}
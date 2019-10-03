/**
 * for get/delete maps data from mongodb
 * @param db
 * @returns {Maps}
 */
class Maps {
    constructor(db) {
        this.coll = db.collection("maps")
    }

    getAll() {
        return this.coll.find().toArray()
    }

    get(name) {
        return this.coll.findOne({name})
    }

    delete(name) {
        return this.coll.deleteOne({name})
    }
}

module.exports = (db) => new Maps(db)
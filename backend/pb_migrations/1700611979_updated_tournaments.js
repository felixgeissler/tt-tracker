/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iijv57ckr97x2dg")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ah1sxp6w",
    "name": "createdBy",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("iijv57ckr97x2dg")

  // remove
  collection.schema.removeField("ah1sxp6w")

  return dao.saveCollection(collection)
})

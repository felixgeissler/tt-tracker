/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("odueutk8p81av6c")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_mY8w5U9` ON `tournament_holes` (\n  `orderIndex`,\n  `tournament`\n)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("odueutk8p81av6c")

  collection.indexes = [
    "CREATE INDEX `idx_mY8w5U9` ON `tournament_holes` (\n  `orderIndex`,\n  `tournament`\n)"
  ]

  return dao.saveCollection(collection)
})

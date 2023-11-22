/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "vcqt42iq82tcm06",
    "created": "2023-11-22 00:24:26.219Z",
    "updated": "2023-11-22 00:24:26.219Z",
    "name": "tournament_hole_runs",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "qweeuvpr",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "kusijdh7",
        "name": "hole",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "odueutk8p81av6c",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "bqkkgd9o",
        "name": "attempts",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "cbxadkgb",
        "name": "finishedAt",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_DEEDjnY` ON `tournament_hole_runs` (\n  `user`,\n  `hole`\n)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("vcqt42iq82tcm06");

  return dao.deleteCollection(collection);
})

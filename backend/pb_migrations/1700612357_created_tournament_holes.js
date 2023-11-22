/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "odueutk8p81av6c",
    "created": "2023-11-22 00:19:17.897Z",
    "updated": "2023-11-22 00:19:17.897Z",
    "name": "tournament_holes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ap9gsumm",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rqbawnzu",
        "name": "description",
        "type": "editor",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "convertUrls": false
        }
      },
      {
        "system": false,
        "id": "cboiik3d",
        "name": "startLocation",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "03gtxnue",
        "name": "endLocation",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "eaxm2fcy",
        "name": "par",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 3,
          "max": 5,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "un523voa",
        "name": "orderIndex",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 18,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "u7kmtqku",
        "name": "tournament",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "iijv57ckr97x2dg",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_mY8w5U9` ON `tournament_holes` (\n  `orderIndex`,\n  `tournament`\n)"
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
  const collection = dao.findCollectionByNameOrId("odueutk8p81av6c");

  return dao.deleteCollection(collection);
})

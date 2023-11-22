/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8nvfqen2a8ernaq",
    "created": "2023-11-22 00:06:25.567Z",
    "updated": "2023-11-22 00:06:25.567Z",
    "name": "league_user_applications",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "zz5o65da",
        "name": "user",
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
      },
      {
        "system": false,
        "id": "rlwmkiyi",
        "name": "league",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "qs0blqgl7ad14j0",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_YVLK7T7` ON `league_user_applications` (\n  `user`,\n  `league`\n)"
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
  const collection = dao.findCollectionByNameOrId("8nvfqen2a8ernaq");

  return dao.deleteCollection(collection);
})

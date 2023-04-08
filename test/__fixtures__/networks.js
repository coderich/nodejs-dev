/* Copyright (c) 2023 Coderich LLC. All Rights Reserved. */

const { ObjectId } = require('mongodb');

module.exports = [{
  _id: new ObjectId('e4f66987111acdb28f871393'),
  name: 'Piedmont',
  tags: [{ _id: new ObjectId() }, { _id: new ObjectId() }],
  createdAt: new Date(),
  search_configuration: {
    kyruus_config: {
      client_id: 'piedmont-preview_app',
      client_name: 'piedmont-preview',
      client_secret: '112b914ba49f4a84be1f586a0551a2b7',
    },
  },
}];

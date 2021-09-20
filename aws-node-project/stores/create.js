'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  console.log(event);
  //const data = JSON.parse(event.storeName);
  const data = event;
  console.log('data type:'+ typeof data);

  if (typeof data.storeName !== 'string' || data.storeName == null) {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the store item.',
    });
    return;
  }

  const params = {
    TableName: "Stores",
    Item: {
      id: uuid.v1(),
      storeName: data.storeName,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the store to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the store item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item.id),
    };
    callback(null, response);
  });
};
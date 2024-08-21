const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "posts";

exports.handler = async () => {
    const params = {
        TableName: TABLE_NAME, 
    };

    try {
        const data = await dynamoDb.scan(params).promise();
        const posts = data.Items;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow CORS for all domains
            },
            body: JSON.stringify(posts),
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Could not fetch posts' }),
        };
    }
};
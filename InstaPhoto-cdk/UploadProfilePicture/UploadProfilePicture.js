const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "users";
const BUCKET_NAME = "hsppbucket";

function validateUserDetails(email, profilePicture) {

    if (!email || !profilePicture) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key"
            },
            body: JSON.stringify({ error: 'Email and profile picture are required' }),
        };
    }
}

 async function checkUserExists(email) {

    // Check if the user exists in DynamoDB
    const userParams = {
        TableName: TABLE_NAME,
        Key: { email },
    };

    const user = await dynamo.get(userParams).promise();
    
    if (!user.Item) {
        return {
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key"
            },
            body: JSON.stringify({ error: 'User not found' }),
        };
    }
}


exports.handler = async (event) => {

    console.log('event: ', JSON.stringify(event));
    const { email, profilePicture } = JSON.parse(event.body);

    validateUserDetails(email, profilePicture);

    await checkUserExists(email);

    // Decode the base64 image and upload it to S3
    const profilePictureKey = `profile-pictures/${email}.jpg`;
    const buffer = Buffer.from(profilePicture, 'base64');
    const s3Params = {
        Bucket: BUCKET_NAME,
        Key: profilePictureKey,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };
    
    console.log('s3Params: ', JSON.stringify(s3Params));
    try {
        await s3.upload(s3Params).promise();

        // Update the user's record in DynamoDB
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { email: email },
            UpdateExpression: "set profilePictureUrl = :url, hasProfilePicture = :status",
            ExpressionAttributeValues: {
                ":url": `https://${BUCKET_NAME}.s3.amazonaws.com/${profilePictureKey}`,
                ":status": true,
            },
            ReturnValues: "UPDATED_NEW"
        };

        await dynamo.update(updateParams).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key"
            },
            body: JSON.stringify({ message: 'Profile picture uploaded and user record updated successfully' }),
        };
    } catch (error) {
        console.error("Error uploading profile picture: ", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                "Access-Control-Allow-Headers": "Content-Type, X-Api-Key"
            },
            body: JSON.stringify({ error: 'Could not upload profile picture' }),
        };
    }
};

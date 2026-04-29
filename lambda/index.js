const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

exports.handler = async (event) => {
    const params = {
        Name: '/app/config/greeting',
        WithDecryption: false
    };
    
    const result = await ssm.getParameter(params).promise();
    const greeting = result.Parameter.Value;
    
    console.log("Retrieved from SSM:", greeting);
    
    return {
        status: "Success",
        greeting: greeting
    };
};
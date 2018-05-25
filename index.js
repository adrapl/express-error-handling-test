var express     = require('express');
var bodyParser  = require('body-parser');
var boom        = require('boom');
var app         = express();

var PORT        = process.env.PORT || 3000;

const promisedFunctionFailedByReject = async () => {
    return new Promise((resolve, reject) => {                
        reject('Test throwing error in promised!');
        resolve('Resolved data from promisedFunctionFailedByReject!');
    });
};

const promisedFunctionFailedByThrow = async () => {
    return new Promise((resolve, reject) => {                
        throw new Error('Test throwing error in promised!');
        resolve('Resolved data from promisedFunctionFailedByThrow!');
    });
};

const promisedFunctionSuccess = async () => {
    return new Promise((resolve, reject) => {                
        resolve('Resolved data from promisedFunctionSuccess!');
    });
};

app.get('/', async (req, res, next) => {        
    try {        
        try {
            var data1 = await promisedFunctionSuccess();            
            let data2 = await promisedFunctionFailedByThrow();            
        } catch(err) {
            throw boom.badRequest('Test throwing error in promise and catched and throw new!', { test: 'Test' });            
        }        

        res.json({
            status: 'success', 
            timestamp: new Date, 
            data: data1
        });
    } catch (err) {
        next(err);
    }
});

/**
 * Error handler middleware
 */
app.use((err, req, res, next) => {     
    res.status(err.output && err.output.statusCode || 500);
    res.json(err.output && err.output.payload || { message: err.message });
});

app.listen(PORT, () => {
    console.log('Server listen on port', PORT);
});
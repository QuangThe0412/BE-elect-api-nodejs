const { version } = require('typescript');

// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '1.1.0',
        title: 'API Documentation',
        description: 'API Documentation',
    },
    host: 'localhost:3002',
    schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../routes/admin/index.ts', '../routes/client/index.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
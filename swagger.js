import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Time Table API',
        description: 'Description',
    },
    host: 'localhost:4444',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen()(outputFile, endpointsFiles, doc);
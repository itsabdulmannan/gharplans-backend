const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const serverUrl = process.env.NODE_ENV === 'production' ? 'http://13.61.12.205:3005' : 'http://localhost:3005';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Ghar Plans",
            version: "1.0.0",
            contact: {
                name: "Indivore",
            },
        },
        servers: [
            {
                url: serverUrl,  
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '/../routes/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = setupSwagger;

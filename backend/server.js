// const { exec } = require('child_process');

// const { ApolloServer } = require("apollo-server-express");
// const express = require('express');
// const bodyParser =  require("body-parser");
// const config = require('./config.js');
// const cors = require('cors');
// const jwt = require('express-jwt');
// const { makeExecutableSchema  } = require("graphql-tools");
// const { readFiles } = require('./src/lib.js');

// const resolvers = require('./src/resolvers.js');

// const auth = jwt({
//     secret: config.secret,
//     credentialsRequired: false
// });

// readFiles('./src/schema/').then(typeDefs => {
//     var schema = makeExecutableSchema({
//         typeDefs,
//         resolvers,
//     });
//     const server = new ApolloServer({
//         schema,
//         context: ({ req }) => {
//             const user = req.headers.user || '';

//             return { user }
//         },
//         playground: true
//     });

//     const app = express();
//     app.use(cors())
//     app.use(express.static(__dirname + '/'));
//     app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
//     app.use(/\/((?!graphql).)*/, bodyParser.json());
//     server.applyMiddleware({ app });

//     app.listen({ port: 4000 }, () =>
//         console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
//     );
// });

const { exec } = require('child_process');

const { ApolloServer } = require("apollo-server-express");
const express = require('express');
const bodyParser =  require("body-parser");
const config = require('./config.js');
const cors = require('cors');
const jwt = require('express-jwt');
const { makeExecutableSchema  } = require("graphql-tools");
const { readFiles } = require('./src/lib.js');

const resolvers = require('./src/resolvers.js');

const auth = jwt({
    secret: config.secret,
    credentialsRequired: false
});

readFiles('./src/schema/').then(typeDefs => {
    var schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });
    const server = new ApolloServer({
        schema,
        context: ({ req }) => {
            const user = req.headers.user || '';

            return { user }
        },
        playground: true,
        uploads: {
            maxFieldSize: 10000000,
            maxFileSize: 10000000, // 10 MB
            maxFiles: 20
        }
    });

    const app = express();
    app.use(cors())
    // app.use(express.static(__dirname + '/'));
    app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
    app.use(/\/((?!graphql).)*/, bodyParser.json());
    server.applyMiddleware({ app });
    
    app.use(express.static(__dirname + '/home/'));
    app.use(express.static(__dirname + '/'));
    app.use("/*", express.static(__dirname + '/home/react.html'));

    const port = 4000;
    app.listen({ port }, () => {
        console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
        console.log(`Position: ${__dirname}`);
    });
});

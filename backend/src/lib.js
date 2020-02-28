const fs = require('fs');
const { importSchema  } = require('graphql-import');

module.exports = {
    readFiles: async function (dirname) {
        return new Promise((resolve, reject) => {
            var typeDefs = ``;
            fs.readdir(dirname, function (err, filenames) {
                if (err) {
                    return reject(err)
                }
                filenames.forEach(function (filename) {
                    typeDefs += importSchema(dirname + filename);
                });

                resolve(typeDefs);
            });
        })
    }
};

const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v1');
const ffmpeg = require('fluent-ffmpeg');
const db = require('./db.js');
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
const config = require('../config.js');
const renderAnimation = require('../render-mp4');
const { createCanvas } = require('canvas');

const Blob = require('node-blob');

const spawn = require("child_process").spawn;

const { GraphQLUpload } = require('graphql-upload');

// db.clear();

const resolvers = {
    Query: {
        getProjects: async (parent, args) => {
            let dt = db.get('../db.json');

            return dt;
        },
        getUsers: async (parent, args) => {
            var users;

            await db.get('../users.json')
                .then(val => {
                    users = val;
                });

            return users
        },
        getUser: async (parent, args, context) => {
            if (!context.user) throw new Error('You are not authorized!')

            var user_;

            await db.get('../users.json')
                .then(val => {
                    val.forEach(user => {
                        if (user.nickname == args.nickname) {
                            user_ = user;
                        }
                    })
                });

            return user_;
        },
        userAuth: async (parent, args) => {
            var token = '';
            var error = '';

            await db.get('../users.json')
                .then(val => {
                    val.forEach(user => {
                        if (user.nickname === args.login) {
                            if (user.password == sha256(args.password)) {
                                token = jwt.sign(
                                    { nickname: val.nickname },
                                    config.secret,
                                    { expiresIn: '1d' });
                            } else {
                                error = 'Password was wrong'
                            }
                        } else {
                            error = "Username was wrong"
                        }
                    });
                });

            if (token.length > 0) {
                return token;
            } else {
                return error
            }
        }
    },
    Mutation: {
        addProject: async (parent, args) => {
            const { createReadStream } = await args.file;


            let newProject = {
                id: uuid(),
                title: args.title,
                view: 0,
                download: 0,
                date: args.date,
                json: ''
            };

            console.log(newProject);
            let stream = createReadStream();
            
            // fs.writeFile(path.join(__dirname, '../json/' + args.title + '.json'), '', (err) => console.log("AAAAA", err));
            // fs.writeFile(args.title + '.json', 'Learn Node FS module', function (err) {
            //     if (err) throw err;
            //     console.log('File is created successfully.');
            // });

            const filePath = path.join(__dirname, '../json', args.title + '.json');
            console.log("FilePath", filePath);
            const writeStream = fs.createWriteStream(filePath);
            console.log("WriteStream");
            await new Promise((resolve, reject) => {
                stream
                    .pipe(writeStream)
                    .on('finish', async () => {
                        console.log("pipe finished", args.title);
                        newProject.json = fs.readFileSync(path.join(__dirname, '../json/' + args.title + '.json'), 'utf-8');
                        db.get('../users.json')
                            .then(async val => {
                                console.log("then", args.user)
                                val.map(user => {
                                    if (user.nickname == args.user) {
                                        user.projects.unshift(newProject);
                                    }

                                    return user;
                                });

                                db.update('../users.json', val)
                                    .then(() => {
                                        // resolve(1)
                                    })
                            });
                    })
                    .on('limit', (e) => {
                        console.log("LIMIT Error", e);
                    })
                    .on('error', (e) => {
                        console.log("ERROR", e);
                    });
            });

            return 1;
        },
        downloadProject: async (parent, args) => {
            let file;
            await new Promise(async (resolve, reject) => {
                const { createReadStream } = await args.json;

                let id = uuid();

                let stream = createReadStream();
                console.log(id)

                return stream
                    .pipe(fs.createWriteStream(path.join(__dirname, '../json/' + id + '.json')))
                    .on('finish', async () => {

                        let argv = [
                            path.join(__dirname, '../json/' + id + '.json'),
                            'white',
                            1080,
                            1080,
                            path.join(__dirname, './output.mp4')
                        ];

                        await renderAnimation({
                            data: argv[0],
                            path: argv[4],
                            width: argv[2] * 1,
                            height: argv[3] * 1,
                            backgroundColor: argv[1]
                        }).then(() => {
                            file = fs.readFileSync(path.join(__dirname, './output.mp4'), { encoding: 'base64' });
                            resolve(file);
                        });
                    })
            });

            return file;
        },
        addUser: async (parent, args) => {
            var newUser = {
                nickname: args.nickname,
                password: sha256(args.password),
                email: args.email,
                type: args.type,
                tags: 'User',
                projects: []
            };

            var error = '';

            await db.get('../users.json')
                .then(val => {
                    val.forEach(user => {
                        if (user.nickname === args.nickname) {
                            error = "A user with this username already exists."
                        }
                    });
                });

            if (args.password.length < 6) {
                error = "Password must contain at least 6 letters.";
            }

            if (error == '') {
                db.addUser(newUser);
            }

            if (error == '') {
                return jwt.sign(
                    { nickname: newUser.nickname },
                    config.secret,
                    { expiresIn: '1d' }
                );
            } else {
                return error
            }
        },
        removeUser: async (parent, args) => {
            await db.get('../users.json')
                .then(val => {
                    val = val.filter(user => user.nickname != args.nickname);

                    db.update('../users.json', val)
                });

            return 'X';
        },
        removeUserAnimation: async (parent, args) => {
            await db.get('../users.json')
                .then(val => {
                    val = val.map(user => {
                        if (user.nickname == args.nickname) {
                            user['projects'] = user.projects.filter(project => project.id != args.animation);

                            return user;
                        }

                        return user;
                    });

                    db.update('../users.json', val)
                });

            return 'OK';
        },
        addTag: async (parent, args) => {
            var user_;

            await db.get('../users.json')
                .then(val => {
                    val.map(user => {
                        if (user.nickname === args.nickname) {
                            user_ = user;
                            user.tags = args.tag;
                        }

                        return user
                    });

                    db.update('../users.json', val);
                });

            return user_;
        },
    },
    Project: {
        id: parent => parent.id,
        title: parent => parent.title,
        download: parent => parent.download,
        view: parent => parent.view,
        date: parent => parent.date
    },
    Upload: GraphQLUpload
};

module.exports = resolvers;

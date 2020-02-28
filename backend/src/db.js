const fs = require('fs');
const path = require('path');

module.exports = {
    add: async (obj) => {
        fs.readFile(path.join(__dirname, '../db.json'), (err, data) => {
            var dt = JSON.parse(data);
            dt.unshift(obj);
            fs.writeFile(path.join(__dirname, '../db.json'), JSON.stringify(dt), (err) => {
                if (err) return console.log(err);
            })
        })
    },
    addUser: async (obj) => {
        fs.readFile(path.join(__dirname, '../users.json'), (err, data) => {
            var dt = JSON.parse(data);
            dt.unshift(obj);
            fs.writeFile(path.join(__dirname, '../users.json'), JSON.stringify(dt), (err) => {
                if (err) return console.log(err);
            })
        })
    },
    update: async (pt, obj) => {
        fs.writeFile(path.join(__dirname, pt), JSON.stringify(obj), (err) => {
            if (err) return console.log(err);
        });
    },
    clear: async () => {
        fs.writeFile(path.join(__dirname, '../db.json'), [], (err) => {
            if (err) return console.log(err);
        })
    },
    get: async (pt) => {
        let dt = JSON.parse(fs.readFileSync(path.join(__dirname, pt), 'utf-8'));

        return dt
    }
};

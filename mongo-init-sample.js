print('Start #################################################################');

db = db.getSiblingDB('oama');
db.createUser(
  {
    user: 'oama',
    pwd: 'password',
    roles: [
        {
            role: 'readWrite',
            db: 'oama'
        }
    ],
  },
);
db.createCollection('examples');

db = db.getSiblingDB('oama_test');
db.createUser(
  {
    user: 'oama_test',
    pwd: 'password',
    roles: [
        {
            role: 'readWrite',
            db: 'oama_test'
        }
    ],
  },
);

print('END #################################################################');
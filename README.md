# Neo's App


## Backend

```bash
# Installation
$ npm install
$ npm install --build-from-source

# Development
$ npm run dev

# Production Mode
$ npm run build
$ npm start
```


## Frontend

```bash
# Installation
$ npm install

# Development
$ npm start  # $ npm run dev

# Production Build
$ npm run build
```


## Access Counter

```javascript
fetch('https://EXAMPLE.COM/api/access-counter/pv?id=1').catch(error => console.error(error));
```

```html
<img src="https://EXAMPLE.COM/api/access-counter/total?id=1&amp;digit=8"     width="138" height="32" alt="Total Counter"     title="Total Counter"    >
<img src="https://EXAMPLE.COM/api/access-counter/today?id=1&amp;digit=4"     width="72"  height="32" alt="Today Counter"     title="Today Counter"    >
<img src="https://EXAMPLE.COM/api/access-counter/yesterday?id=1&amp;digit=4" width="72"  height="32" alt="Yesterday Counter" title="Yesterday Counter">
```


## Bookmarks

```javascript
javascript:(o=>o('https://EXAMPLE.COM/api/bookmarks/add?credential=【CREDENTIAL】&url='+encodeURIComponent(location.href)))(x=>window.open(x));
```


## DB API

### JSON DB

```bash
$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】", "db_name": "example", "db_credential": "【DB PASS】" }' http://EXAMPLE.COM/api/db-api/json-db/create-db
$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】" }' http://EXAMPLE.COM/api/db-api/json-db/list-db-names

$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "item": { "name": "TEST 1" } }' http://EXAMPLE.COM/api/db-api/json-db/create
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】" }' http://EXAMPLE.COM/api/db-api/json-db/find-all
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "id": 1, "item": { "name": "TEST 2", "age": 20 } }' http://EXAMPLE.COM/api/db-api/json-db/put-by-id
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "id": 1, "item": { "name": "TEST 3" } }' http://EXAMPLE.COM/api/db-api/json-db/patch-by-id
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "id": 1 }' http://EXAMPLE.COM/api/db-api/json-db/find-by-id
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "id": 1 }' http://EXAMPLE.COM/api/db-api/json-db/delete-by-id

$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】", "db_name": "example", "db_credential": "【DB PASS】" }' http://EXAMPLE.COM/api/db-api/json-db/delete-db
```

### SQLite

```bash
$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】", "db_name": "example", "db_credential": "【DB PASS】" }' http://EXAMPLE.COM/api/db-api/sqlite/create-db
$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】" }' http://EXAMPLE.COM/api/db-api/sqlite/list-db-names

# run : CREATE TABLE・INSERT・UPDATE・DELETE
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "sql": "CREATE TABLE my_table (name text)" }' http://EXAMPLE.COM/api/db-api/sqlite/run
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "sql": "INSERT INTO my_table (name) VALUES (?)", "params": ["Example Name"] }' http://EXAMPLE.COM/api/db-api/sqlite/run

# SELECT : all or get
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "sql": "SELECT * FROM my_table" }' http://EXAMPLE.COM/api/db-api/sqlite/all
$ curl -X POST -H 'Content-Type: application/json' -d '{ "db_name": "example", "db_credential": "【DB PASS】", "sql": "SELECT * FROM my_table" }' http://EXAMPLE.COM/api/db-api/sqlite/get

$ curl -X POST -H 'Content-Type: application/json' -d '{ "credential": "【CREDENTIAL】", "db_name": "example", "db_credential": "【DB PASS】" }' http://EXAMPLE.COM/api/db-api/sqlite/delete-db
```


## Solilog

```javascript
javascript:(o=>o('https://EXAMPLE.COM/api/solilog/posts/add?credential=【CREDENTIAL】&text='+encodeURIComponent(document.title+' '+location.href)))(x=>window.open(x));
javascript:(o=>o('https://EXAMPLE.COM/api/solilog/posts/add?credential=【CREDENTIAL】&text='+encodeURIComponent(document.title+' '+location.href)))(x=>location.href=x);

javascript:((o,d,x)=>{x=prompt('Post This Page','');if(x)o('https://EXAMPLE.COM/api/solilog/posts/add?credential=【CREDENTIAL】&text='+encodeURIComponent(x+'\n'+d.title+' '+d.URL))})(x=>window.open(x),document);
```


## Links

- [Neo's World](https://neos21.net/)

# REST API для работы с коллекцией контактов.

В app.js – веб сервер на express, добавлены прослойки morgan и cors.

### Rautes contacts:

`@ GET /api/contacts` -
ничего не получает, выводит список контактов;

`@GET /api/contacts/:contactId` -
не получает body, а получает параметр contactId по которому, если есть такой контакт в базе выводит его, в противном случае ошибка 404 "Not found";

`@ POST /api/contacts` -
получает body в формате {name, email, phone}, если в body нет каких-то обязательных полей, возвращает json с ключом {"message": "missing required name field"} и статусом 400. Если с body все хорошо, добавляет уникальный идентификатор в объект контакта;

`@ DELETE /api/contacts/:contactId` -
не получает body, а получает параметр contactId по которому, если есть такой контакт в базе удаляет его, в противном случае ошибка 404 "Not found";

`@ PUT /api/contacts/:contactId` -
получает параметр contactId. Получает body в json-формате c обновлением любых полей name, email и phone, при отсутствии какого-нибудь из полей в body удаляет его. Если body нет, возвращает json с ключом {"message": "missing fields"} и статусом 400;

`@ PАTCH /api/contacts/:contactId` -
получает параметр contactId. Получает body в json-формате c обновлением любых полей name, email и phone, при отсутствии какого-нибудь из полей в body пропускает его. Если body нет, возвращает json с ключом {"message": "missing fields"} и статусом 400;

`@ PATCH /api/contacts/:contactId/favorite` -
получает параметр contactId. Получает body в json-формате c обновлением поля favorite. Если body нет, возвращает json с ключом {"message": "missing field favorite"} и статусом 400.

Для маршрутов, что принимают данные (POST, PUT, PATCH) используется проверка (валидация) данных с помощью npm-библиотеки Joi.

Данные хранятся в базе MongoDB. Приложение работает с базой при помощи Mongoose.

### Команды:

- `npm run start` &mdash; старт сервера в режиме production
- `npm run start:dev` &mdash; старт сервера в режиме разработки (development)
- `npm run lint` &mdash; запустить выполнение проверки кода с eslint, необходимо выполнять перед каждым PR и исправлять все ошибки линтера
- `npm run lint:fix` &mdash; та же проверка линтера, но с автоматическими исправлениями простых ошибок

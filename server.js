/* eslint-disable max-len */
/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
// const { timeStamp } = require('console');
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();

const tickets = [{ // целевой массив данных
  id: '61112921', name: 'Сходить в магазин', description: 'АбырвалгАбырвалгАбырвалг', status: 'true', created: '8.05.22 15:02',
}];

function getTimeStamp() { // получить текущую дату и время в нужном формате
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = String(date.getFullYear()).substring(2);
  const hour = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`; // добавляем ноль для одноразрядных значений
  const result = `${day}.${month}.${year} ${hour}:${minutes}`;
  return result;
}

function pushResponse(ctx, value, dataArray = null) { // функция отправки ответа на клиент
  ctx.response.set('Access-Control-Expose-Headers', 'X-MARKER'); // разрешаем доступ к кастомному заголовку 'X-MARKER' в браузере клиента
  ctx.set('X-MARKER', value);
  if ((dataArray !== null) && (value === 'allTickets')) {
    ctx.response.body = dataArray;
  }
  if (value === 'Ticket added!') ctx.response.body = 'empty data';
  if (value === 'Ticket deleted!') ctx.response.body = dataArray;
}

function addTicketItem(nameValue, descriptionValue) { // функция добавления нового тикета в целевой массив данных
  const newItem = {
    id: uuidv4(),
    name: nameValue,
    description: descriptionValue,
    status: false,
    created: getTimeStamp(),
  };
  tickets.push(newItem);
}

function findById(idValue) { // функция поиска индекса элемента в целевом массиве по id
  let result = null;
  tickets.forEach((item, index) => {
    if (item.id === `${idValue}`) {
      result = index;
    }
  });
  return result;
}

app.use(koaBody({
  urlencoded: true,
  multipart: true, // включим поддержку обработки multipart (приём файлов)
}));

app.use(async (ctx, next) => { // обработка CORS POLICY
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = { 'Access-Control-Allow-Origin': '*' };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
    }
    ctx.response.status = 204; // No content
  }
});

app.use(async (ctx, next) => { // обработка забросов от клиента
  const { method } = ctx.request.query;
  const bodyContent = ctx.request.body;
  const answerData = `Del INDEX: ${findById(bodyContent)}`;

  switch (method) {
    case 'allTickets': // ответ на запрос всего массива тикетов
      pushResponse(ctx, method, tickets);
      return;
    case 'createTicket': // ответ на запрос "добавить тикет"
      addTicketItem(bodyContent.name, bodyContent.description);
      pushResponse(ctx, 'Ticket added!');
      console.log('=== added new item ===');
      console.log(tickets);
      return;
    case 'deletTicket': // ответ на запрос "удалить тикет"
      tickets.splice(findById(bodyContent), 1);
      pushResponse(ctx, 'Ticket deleted!', answerData);
      console.log('=== item was deleted ===');
      console.log(tickets);
      return;
      // TODO: обработка остальных методов
    default:
      ctx.response.status = 404;
      console.log('fuckOff!');
      return;
  }
  await next();
});

const server = http.createServer(app.callback()).listen(7070);

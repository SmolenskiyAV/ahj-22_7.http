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
const { stringify } = require('querystring');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();

const tickets = [{ // целевой массив данных
  id: '61112921', name: 'Сходить в магазин', description: 'АбырвалгАбырвалгАбырвалг', status: 'true', created: '8.05.22 15:02',
}];

let editDATA = {};

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
  if ((dataArray !== null)
    && ((value === 'allTickets')
      || (value === 'Ticket deleted!')
      || (value === 'status changed!')
      || (value === 'Ticket edited!')
    )
  ) {
    ctx.response.body = dataArray;
  }
  if (value === 'Ticket added!') ctx.response.body = 'empty data';
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

function changeTicketItem(index, status = null, name = null, description = null) { // функция изменения тикета
  const changingItem = tickets[index];
  if (status !== null) changingItem.status = status;
  if (name !== null) changingItem.name = name;
  if (description !== null) changingItem.description = description;
  tickets.splice(index, 1, changingItem);
  editDATA = { name: changingItem.name, description: changingItem.description }; // то, что отправляем клиенту при редактировании тикета
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
  let bodyContent = ctx.request.body;
  let index = findById(bodyContent);
  if (method === 'statusTicket') {
    bodyContent = JSON.parse(bodyContent);
    index = findById(bodyContent.id);
  }
  if (method === 'editTicket') {
    index = findById(bodyContent.id);
  }
  const answerData = `changing Item INDEX: ${index}`;
  const { name } = bodyContent;
  const { status } = bodyContent;
  const { description } = bodyContent;
  const { id } = bodyContent;

  switch (method) {
    case 'allTickets': // ответ на запрос всего массива тикетов
      pushResponse(ctx, method, tickets);
      return;
    case 'createTicket': // ответ на запрос "добавить тикет"
      addTicketItem(name, description);
      pushResponse(ctx, 'Ticket added!');
      console.log('=== added new item ===');
      console.log('new Ticket name: ', name);
      return;
    case 'deletTicket': // ответ на запрос "удалить тикет"
      tickets.splice(index, 1);
      pushResponse(ctx, 'Ticket deleted!', answerData);
      console.log('=== item was deleted ===');
      console.log('array of actual Tickets: ', tickets);
      return;
    case 'statusTicket': // ответ на запрос "меняем статус тикета"
      changeTicketItem(index, status);
      pushResponse(ctx, 'status changed!', answerData);
      console.log('=== item status was changed ===');
      console.log(tickets);
      return;
    case 'editTicket': // ответ на запрос "редактируем тикет"
      console.log('index ID = ', id);
      console.log('index edit = ', index);
      console.log('name edit = ', name);
      console.log('description edit = ', description);
      changeTicketItem(index, null, name, description);
      pushResponse(ctx, 'Ticket edited!', editDATA);
      console.log('=== item was edited ===');
      console.log(editDATA);
      return;
    default:
      ctx.response.status = 404;
      console.log('fuckOff!');
      return;
  }
  await next();
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);

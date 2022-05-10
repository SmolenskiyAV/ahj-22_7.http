/* eslint-disable no-return-await */
/* eslint-disable consistent-return */
/* eslint-disable no-unreachable */
/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const uuid = require('uuid');

const app = new Koa();

class IDGenerator { // ID-генератор
  constructor() {
    this.length = 8;
    this.timestamp = +new Date();

    const _getRandomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    this.generate = function () {
      const ts = this.timestamp.toString();
      const parts = ts.split('').reverse();
      let id = '';

      for (let i = 0; i < this.length; ++i) {
        const index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
      }

      return id;
    };
  }
}

function getTimeStamp() { // получить текущую дату и время в нужном формате
  const date = new Date();
  const day = date.getDate();
  const month = Number(date.getMonth()) + 1;
  const year = date.getFullYear().substring(2);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const result = `${day}.${month}.${year} ${hour}:${minutes}`;
  return result;
}

function pushResponse(ctx, value, tickets) { // функция отправки ответа на клиент
  ctx.set('X-MARKER', value);
  ctx.response.body = tickets;
}

app.use(koaBody({
  urlencoded: true,
  multipart: true, // включим поддержку обработки multipart (приём файлов)
}));

const tickets = [{
  id: '61112921', name: 'Сходить в магазин', description: 'АбырвалАбырвалАбырвал', status: 'true', created: '8.05.22 15:02',
}];

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

  switch (method) {
    case 'allTickets':
      pushResponse(ctx, method, tickets);
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

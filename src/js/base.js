/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable linebreak-style */
/* eslint-disable no-cond-assign */
/* eslint-disable consistent-return */
/* eslint-disable no-alert */
/* eslint-disable no-plusplus */
// import {  } from './actions';

export default function sendHttpRequest(xhr, method, marker, data) { // функция отправки запроса
  xhr.open(`${method}`, `http://localhost:7070/?method=${marker}`);
  if ((method === 'GET') && (marker === 'allTickets')) {
    xhr.send();
  }
  if ((method === 'POST') && (marker === 'createTicket')) {
    xhr.send(data);
  }
  if ((method === 'POST') && (marker === 'deletTicket')) {
    xhr.send(data);
  }
}

export function clearFormFields(formElement) {
  formElement.querySelector('input').value = '';
  formElement.querySelector('textarea').value = '';
}

export function serverAnswer(xhr, answer) {
  alert(`answer = ${answer}`);
  console.log('xhr.response = ', xhr.response);
  return xhr.response;
}

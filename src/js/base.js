/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-alert */

export default function sendHttpRequest(xhr, method, marker, data) { // функция отправки запроса
  xhr.open(`${method}`, `http://localhost:7070/?method=${marker}`);
  if ((method === 'POST') && (marker === 'statusTicket')) {
    xhr.send(JSON.stringify(data));
  } else {
    xhr.send(data);
  }
}

export function clearFormFields(formElement) { // функция очистки полей формы
  formElement.querySelector('input').value = '';
  formElement.querySelector('textarea').value = '';
}

export function serverAnswer(xhr, answer) { // функция визуализации ответа сервера на стороне клиента
  alert(`answer = ${answer}`);
  console.log('response = ', xhr.response);
}

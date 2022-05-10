/* eslint-disable max-len */
/* eslint-disable no-plusplus */
// ### ПОДСКАЗКА, прикреплённая к элементу ###

import getParams from './base';
import tiketAddFunc from './actions';

document.addEventListener('DOMContentLoaded', () => { // помещаем addEventlistener внутрь обратной функции - для успешного прохождения тестов Jest
  const tiketAdd = document.getElementById('tiket__add'); // кнопка "Добавить тикет"
  const AddTiketForm = document.getElementById('Add_Tiket_Form'); // форма "Добавить тикет"
  const ChangeTiketForm = document.getElementById('Change_Tiket_Form'); // форма "Изменить тикет"
  const DeleteTiketForm = document.getElementById('Delete_Tiket_Form'); // форма "Удалить тикет"
  const tiketsList = document.getElementById('tikets__list'); // список всех тикетов на странице

  let resivedData = '';

  tiketAdd.addEventListener('submit', (evt) => {
    evt.preventDefault();
  });
  AddTiketForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
  });
  ChangeTiketForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
  });
  DeleteTiketForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
  });

  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'http://localhost:7070/?method=allTickets'); // запрос на сервер всего имеющегося списка тикетов (при старте страницы)
  xhr.send();

  xhr.addEventListener('load', () => { // обработка принятых с сервера данных
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        let marker = xhr.getResponseHeader('X-MARKER');
        const allMarkers = xhr.getAllResponseHeaders();
        if (marker === null) marker = 'not markered data';
        console.log('pre marker = ', marker);

        resivedData = [...JSON.parse(xhr.responseText)]; // преобразуем в массив полученные данные
        console.log('GET response from server = ', resivedData);
        console.log('=========================');
        console.log('marker = ', marker);
        console.log('-------------------------');
        console.log('all markers = ', allMarkers);
        console.log('-------------------------');

        switch (marker) {
          case 'allTickets': // отрисовываем все загруженные с сервера тикеты
            tiketsList.innerHTML = '';
            for (let i = 0; i < resivedData.length; i++) {
              const { id } = resivedData[i];
              const { status } = resivedData[i];
              const { name } = resivedData[i];
              const { created } = resivedData[i];
              const { description } = resivedData[i];
              if ((name !== undefined) && (id !== undefined) && (created !== undefined)) {
                tiketAddFunc(tiketsList, id, status, name, created, description);
              }
            }
            return;
            // TODO: обработка остальных методов
          default:
            // ctx.response.status = 404;
            return;
        }
      } catch (e) {
        console.error(e);
      }
    }
  });
});

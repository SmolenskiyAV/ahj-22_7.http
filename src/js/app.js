/* eslint-disable no-inner-declarations */
/* eslint-disable no-shadow */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
// ### ПОДСКАЗКА, прикреплённая к элементу ###

import sendHttpRequest, { clearFormFields, serverAnswer } from './base';
// import { body } from 'koa/lib/response';
import tiketAddFunc, { tiketRemove } from './actions';
// import response from 'koa/lib/response';

document.addEventListener('DOMContentLoaded', () => { // помещаем addEventlistener внутрь обратной функции - для успешного прохождения тестов Jest
  const tiketAdd = document.getElementById('tiket__add'); // кнопка "Добавить тикет"
  const AddTiketForm = document.getElementById('Add_Tiket_Form'); // форма "Добавить тикет"
  const AddForm = document.getElementById('AddForm');

  const ChangeTiketForm = document.getElementById('Change_Tiket_Form'); // форма "Изменить тикет"
  const ChangeForm = document.getElementById('ChangeForm');

  const DeleteTiketForm = document.getElementById('Delete_Tiket_Form'); // форма "Удалить тикет"
  const DeleteForm = document.getElementById('DeleteForm');

  const tiketsList = document.getElementById('tikets__list'); // список всех тикетов на странице

  const content = document.querySelector('.content');
  // const statusItem = document.querySelectorAll('.status');
  // const tiketChange = document.querySelectorAll('.tiket__change');
  // const tiketRemove = document.querySelectorAll('.tiket__remove');

  let resivedData = '';
  const serverResponse = '';
  let idElement = '';

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

  sendHttpRequest(xhr, 'GET', 'allTickets'); // запрос на сервер всего имеющегося списка тикетов (при старте страницы)

  xhr.addEventListener('load', () => { // обработка принятых с сервера данных
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        let marker = xhr.getResponseHeader('X-MARKER');

        if (marker === null) marker = 'not markered data';

        switch (marker) {
          case 'allTickets': // отрисовываем все загруженные с сервера тикеты
            resivedData = [...JSON.parse(xhr.responseText)]; // преобразуем в массив полученные данные
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
          case 'Ticket added!': // ответ сервера "тикет добавлен"
            serverAnswer(xhr, marker);
            sendHttpRequest(xhr, 'GET', 'allTickets'); // отрисовка обновлённого списка целиком чрз запрос с сервера
            return;
          case 'Ticket deleted!': // ответ сервера "тикет удалён"
            serverAnswer(xhr, marker);
            tiketRemove(idElement);
            return;
            // TODO: обработка остальных методов
          default:
            // ctx.response.status = 404;
            return;
        }
      } catch (e) {
        console.error(e);
        alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
      }
    }
  });

  content.addEventListener('click', (event) => {
    const { target } = event;

    if ((!target.classList.contains('status'))
      && (!target.classList.contains('right_block'))
      && (!target.classList.contains('tiket__change'))
      && (!target.classList.contains('tiket__remove'))
      && (!target.classList.contains('tiket__date'))
      && (!target.classList.contains('tiket_text'))
      && (target.nextElementSibling)) { // раскрываем/скрываем детальное описание тикета кликом по основному полю
      const textarea = target.nextElementSibling.firstElementChild;
      if (textarea.classList.contains('display_none')) {
        textarea.classList.remove('display_none');
      } else {
        textarea.classList.add('display_none');
      }
    }
    if (target.classList.contains('tiket__textarea')) target.classList.add('display_none'); // скрываем детальное описание кликом по доп.раскрытому полю

    if (target.classList.contains('tiket__remove')) { // нажата кнопка "удалить тикет"
      idElement = target.parentElement.parentElement.previousElementSibling;
      const currentId = idElement.textContent; // id удаляемого тикета
      DeleteTiketForm.classList.remove('display_none');

      function handlerDel(event) {
        const { target } = event;
        if (target.classList.contains('Cancel')) { // нажата кнопка "Cancel" формы "Удалить тикет"
          DeleteTiketForm.classList.add('display_none');
          DeleteTiketForm.removeEventListener('click', handlerDel);
        }
        if (target.classList.contains('Ok')) { // нажата кнопка "Ok" формы "Удалить тикет"
          sendHttpRequest(xhr, 'POST', 'deletTicket', currentId);
          DeleteTiketForm.removeEventListener('click', handlerDel);
          DeleteTiketForm.classList.add('display_none');
        }
      }
      DeleteTiketForm.addEventListener('click', handlerDel);
    }
  });

  tiketAdd.addEventListener('click', () => { // нажата кнопка "Добавить тикет"
    AddTiketForm.classList.remove('display_none');

    function handlerAdd(event) {
      const { target } = event;
      if (target.classList.contains('Cancel')) { // нажата кнопка "Cancel" формы "Добавить тикет"
        AddTiketForm.classList.add('display_none');
        AddTiketForm.removeEventListener('click', handlerAdd);
        clearFormFields(AddForm);
      }
      if (target.classList.contains('Ok')) { // нажата кнопка "Ok" формы "Добавить тикет"
        if (AddForm.querySelector('input').value === '') {
          alert('Заполни поле "Краткое описание"!');
          return;
        }
        const formData = new FormData(AddForm);
        sendHttpRequest(xhr, 'POST', 'createTicket', formData);
        clearFormFields(AddForm);
        AddTiketForm.removeEventListener('click', handlerAdd);
        AddTiketForm.classList.add('display_none');
      }
    }
    AddTiketForm.addEventListener('click', handlerAdd);
  });
});

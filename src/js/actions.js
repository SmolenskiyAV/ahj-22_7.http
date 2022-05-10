/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable default-case */

function tiketRemove(event) { // функция удаления задачи
  elem = event.target;
  elem.parentElement.remove(); // удаление родителького элемента кликнутой ссылки - удаление выбранной задачи!
}

export default function tiketAddFunc(tiketsList, id, status, name, created, description) { // функция ДОБАВЛЕНИЯ НОВОГО ТИКЕТА
  let doneMarker = '';
  if (status) doneMarker = '&#10004;';
  tiketsList.insertAdjacentHTML('afterbegin', `
  <div class="task">
  <span class="visually-hidden operable" name = "id">${id}</span>
  <div class="task__title">
      <div style="padding: 9px;">
          <span class="visually-hidden" name = "status">${status}</span>
          <p class="tiket__done">${doneMarker}</p>
      </div>
      <p class="tiket_text operable" name = "name">${name}</p>
      <div class="right_block">
          <p class="tiket__date operable" name = "created">${created}</p>
          <p class="tiket__change">&#9998;</p>
          <p class="tiket__remove">&times;</p>
      </div>
  </div>
  <div>
      <textarea class="tiket__textarea display_none operable" name = "description">${description}</textarea>
  </div>
</div>`); // добавление нового DOM-элемента, являющегося новым тикетом
}

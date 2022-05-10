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

export default function getParams(subscribeForm) {
  const collection = subscribeForm.querySelectorAll('.operable');
  const params = new URLSearchParams();
  for (let i = 0; i < collection.length; i++) {
    params.append(collection[i].getAttribute('name'), collection[i].innerHTML);
    console.log('attr = ', collection[i].getAttribute('name'));
    console.log('value = ', collection[i].innerHTML);
  }
  return params;
}

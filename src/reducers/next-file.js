'use strict';

const {
  QUEUE_CHANGE_FILE,
  RESET_ACTION_QUEUE
} = require('../constants/action-types');

const initial = '';

function nextFile(state = initial, { type, payload }){
  switch(type){
    case QUEUE_CHANGE_FILE:
      return payload.filename;
    case RESET_ACTION_QUEUE:
      return initial;
    default:
      return state;
  }
}

module.exports = nextFile;
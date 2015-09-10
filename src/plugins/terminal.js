'use strict';

const React = require('react');

const TerminalView = require('../views/terminal');

const store = require('../store');

function terminal(app, opts, done){

  const {
    handlers
  } = app;

  let terminalContainer;

  // TODO: there should be a "terminal" mountpoint
  app.view('editor', function(el, cb){
    console.log('terminal render');

    if(!terminalContainer){
      terminalContainer = document.createElement('div');
      el.appendChild(terminalContainer);
    }

    React.render(<TerminalView store={store} handlers={handlers} />, terminalContainer, cb);
  });

  done();
}

module.exports = terminal;
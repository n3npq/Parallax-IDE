'use strict';

const _ = require('lodash');
const Irken = require('irken');

const app = new Irken();

const examples = _.reduce(EXAMPLES_LIST, function(result, name){
  result[name] = require('./examples/'+name);
  return result;
}, {});

const plugins = [
  {
    register: require('bs2-serial')
  },
  {
    register: require('frylord'),
    options: {
      useTempFiles: true
    }
  },
  {
    register: require('snacks')
  },
  {
    register: require('holovisor')
  },
  {
    register: require('skrim')
  },
  {
    register: require('iggins')
  },
  {
    register: require('./src/plugins/handlers')
  },
  {
    register: require('./src/plugins/keyboard-shortcuts')
  },
  {
    register: require('./src/plugins/appbar')
  },
  {
    register: require('./src/plugins/notifications')
  },
  {
    register: require('./src/plugins/editor')
  },
  {
    register: require('./src/plugins/terminal')
  },
  {
    register: require('./src/plugins/rxtx')
  },
  {
    register: require('./src/plugins/sidebar')
  },
  {
    register: require('./src/plugins/overlays')
  }
];

const exampleFolder = 'examples';

function onRender(err){
  console.log('rendered', err);

  if(err){
    return;
  }

  const {
    userConfig,
    handlers
  } = app;

  const {
    ensureExampleProject,
    newFile,
    showNewVersionOverlay,
    changeFile,
    changeProject,
    deviceAdded
  } = handlers;

  // Finish Loading Plugin
  // TODO: encapsulate into a startup handler?
  const config = userConfig.getState();
  const cwd = config.cwd || exampleFolder;
  const lastFile = config['last-file'];
  console.log(cwd, lastFile);
  ensureExampleProject(examples, exampleFolder)
    .then(function(){
      return changeProject(cwd);
    })
    .then(() => {
      if(lastFile){
        changeFile(lastFile);
      } else {
        newFile();
      }
      showNewVersionOverlay();
    })
    .catch(console.error.bind(console));

  chrome.usb.onDeviceAdded.addListener(function(){
    setTimeout(deviceAdded, 200);
  });
}

function onRegister(err){
  console.log('registered', err, app);

  if(err){
    return;
  }

  app.render(onRender);
}

app.register(plugins, onRegister);

// for debugging purposes
window.app = app;

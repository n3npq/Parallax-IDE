'use strict';

const alt = require('../alt');

const { download, reloadDevices, updateSelected } = require('../actions/device');
const { clearOutput, output } = require('../actions/console');
const { rx, tx } = require('../actions/transmission');

class DeviceStore {
  constructor() {

    this.bindListeners({
      onDownload: download,
      onReloadDevices: reloadDevices,
      onUpdateSelected: updateSelected
    });

    this.state = {
      devices: [],
      devicePath: null,
      searching: true,
      selectedDevice: null,
      progress: 0
    };

  }

  onDownload(handlers) {

    function updateProgress(progress){
      this.setState({ progress: progress });
    }

    const { handleSuccess, handleError } = handlers;
    const { workspace, toast, overlay, getBoard } = this.getInstance();
    const { selectedDevice } = this.state;

    const name = workspace.filename.deref();
    const source = workspace.current.deref();

    if(!selectedDevice){
      return;
    }

    const board = getBoard(selectedDevice);

    board.removeListener('terminal', output);
    board.removeListener('terminal', rx);

    board.on('progress', updateProgress.bind(this));
    board.on('progress', tx.bind(this));

    board.compile(source)
      .tap(() => clearOutput())
      .then((memory) => board.bootload(memory))
      .then(() => board.on('terminal', output))
      .then(() => board.on('terminal', rx))
      .tap(() => toast.clear())
      .tap(() => handleSuccess(`'${name}' downloaded successfully`))
      .catch(handleError)
      .finally(() => {
        overlay.hide();
        board.removeListener('progress', updateProgress);
        this.setState({ progress: 0 });
      });

  }

  onReloadDevices(){

    const { scanBoards } = this.getInstance();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ]
    };
    this.setState({ devicePath: null, searching: true });
    scanBoards(scanOpts)
      .then((devices) => this.setState({ devices: devices, searching: false }));
  }

  onUpdateSelected(device) {
    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });
  }
}

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
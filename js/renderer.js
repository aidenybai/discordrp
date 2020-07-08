const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { remote, ipcRenderer } = electron;

const Store = require('electron-store');

const store = new Store();

document.getElementById('min-button').addEventListener('click', (event) => {
  let window = remote.getCurrentWindow();
  window.minimize();
});

document.getElementById('close-button').addEventListener('click', (event) => {
  let window = remote.getCurrentWindow();
  window.close();
});

document.querySelector('#start').onclick = () => {
  rp(
    document.querySelector('#state').value,
    document.querySelector('#details').value,
    document.querySelector('#party').checked,
    document.querySelector('#clientid').value || '',
    document.querySelector('#large').value || '',
    document.querySelector('#small').value || ''
  );

  document.querySelector('#state').disabled = true;
  document.querySelector('#details').disabled = true;
  document.querySelector('#party').disabled = true;
  document.querySelector('#clientid').disabled = true;
  document.querySelector('#large').disabled = true;
  document.querySelector('#small').disabled = true;
  document.querySelector('#start').disabled = true;
  document.querySelector('#stop').disabled = false;
  document.querySelector('#status').value = 'Done';
};

document.querySelector('#stop').onclick = () => {
  ipcRenderer.send('stop');
};
function rp(state, details, party, id, large, small) {
  store.set('data', { state, details, party, id, large, small });
  ipcRenderer.send('run', { state, details, party, id, large, small });
  ipcRenderer.on('run', (event, arg) => {
    document.querySelector('#status').value = 'Done';
  });
}
document.querySelector('#state').value = store.get('data').state || '';
document.querySelector('#details').value = store.get('data').details || '';
document.querySelector('#party').checked = store.get('data').party || '';
document.querySelector('#clientid').value = store.get('data').id || '';
document.querySelector('#large').value = store.get('data').large || '';
document.querySelector('#small').value = store.get('data').small || '';

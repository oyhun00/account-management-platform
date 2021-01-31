import electron, { app, ipcMain } from 'electron';

ipcMain.on('main-test1', (event, res) => {
	console.log(res);
	event.sender.send('renderer-test1', 'hello');
})
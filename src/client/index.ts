export * from '../common';

RegisterCommand(
  'set-visible',
  () => {
    SetNuiFocus(true, true);

    SendNUIMessage({
      action: 'setVisible',
      data: {
        visible: true,
      },
    });
  },
  false
);

RegisterNuiCallback('exit', (data: null, cb: (data: any) => void) => {
  SetNuiFocus(false, false);
  cb({});
});

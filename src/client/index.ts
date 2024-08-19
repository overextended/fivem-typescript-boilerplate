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

RegisterNuiCallback('exit', (data: null, cb: (data: unknown) => void) => {
  SetNuiFocus(false, false);
  cb({});
});

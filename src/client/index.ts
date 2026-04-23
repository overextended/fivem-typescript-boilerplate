import Config from '@common/config';
import { Greetings } from '@common/index';
import { cache } from '@communityox/ox_lib/client';

Greetings();

if (Config.EnableNuiCommand) {
  onNet(`${cache.resource}:openNui`, () => {
    SetNuiFocus(true, true);

    SendNUIMessage({
      action: 'setVisible',
      data: {
        visible: true,
      },
    });
  });

  RegisterNuiCallback('exit', (data: null, cb: (data: unknown) => void) => {
    SetNuiFocus(false, false);
    cb({});
  });
}

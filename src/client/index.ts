import Config from '@common/config';
import { SetNUI } from '@common/utils';
import { Greetings } from '@common/index';
import { cache } from '@overextended/ox_lib/client';

Greetings();

if (Config.EnableNuiCommand) {
  onNet(`${cache.resource}:openNui`, () => {
    SetNUI(true, { action: 'setVisible', data: { visible: true } });
  });

  RegisterNuiCallback('exit', (data: null, cb: (data: unknown) => void) => {
    SetNUI(false);
    cb({});
  });
}

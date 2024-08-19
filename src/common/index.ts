import Locale from 'locale';
import ResourceContext from 'resourceContext';

export function Greetings() {
  const greetings = Locale('hello');

  console.log(`started dist/${ResourceContext}.js`);
  console.log(greetings);
}

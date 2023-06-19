import { Inngest, EventSchemas } from 'inngest';
import type { Events } from './types';

export const inngest = new Inngest({
  name: 'Dropbook',
  schemas: new EventSchemas().fromRecord<Events>()
});

import type { SessionStore } from '@mijoco/stx_helpers/dist/index';
import { persisted } from 'svelte-local-storage-store';

export const sessionStore = persisted('sessionStore', {} as SessionStore);

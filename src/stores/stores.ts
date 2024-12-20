import { persisted } from 'svelte-local-storage-store';
import type { SuiSessionStore } from '$types/sui_types';

export const suiSessionStore = persisted('suiSessionStore', {} as SuiSessionStore);

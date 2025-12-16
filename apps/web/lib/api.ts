import { treaty } from '@elysiajs/eden'
import type { App } from '../../api/src/index' // Path manual

export const api = treaty<App>('localhost:8080')

import { cn as helpersCn } from '@/utils/helpers';

export const cn = (...inputs: Parameters<typeof helpersCn>) => helpersCn(...inputs);

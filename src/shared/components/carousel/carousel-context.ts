import type { CarouselContextProps } from '@/shared/components/carousel/types';
import { createContext } from 'react';

export const CarouselContext = createContext<CarouselContextProps | null>(null);

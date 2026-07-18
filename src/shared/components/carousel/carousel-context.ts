import type { CarouselContextProps } from '@/shared/components/carousel/types';
import { createContext } from 'react';

const CarouselContext = createContext<CarouselContextProps | null>(null);

export default CarouselContext;

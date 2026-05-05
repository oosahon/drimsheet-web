import type { CarouselContextProps } from '@/shared/types/carousel.types';
import { createContext } from 'react';

const CarouselContext = createContext<CarouselContextProps | null>(null);

export default CarouselContext;

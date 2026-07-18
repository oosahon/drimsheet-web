import CarouselContext from '@/shared/components/carousel/carousel-context';
import { useContext } from 'react';

export default function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

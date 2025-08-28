import { create } from 'zustand';
import BottomSheet from '@gorhom/bottom-sheet';
import { RefObject } from 'react';

interface BottomSheetState {
  sheetRef: RefObject<BottomSheet> | null;
  setSheetRef: (ref: RefObject<BottomSheet>) => void;
  expandSheet: () => void;
  collapseSheet: () => void;
  isPopupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  sheetRef: null,
  setSheetRef: (ref) => set({ sheetRef: ref }),
  isPopupOpen: false,
  setPopupOpen: (open) => {
    console.log('🏪 Store: setPopupOpen called with:', open);
    set({ isPopupOpen: open });
  },
  expandSheet: () => {
    const { sheetRef } = get();
    console.log('expandSheet wywołany, sheetRef:', !!sheetRef, 'current:', !!sheetRef?.current);
    
    if (!sheetRef?.current) {
      console.error('Nie można rozwinąć BottomSheet - referencja jest pusta');
      return;
    }
    
    try {
      // Sprawdzamy dostępne metody do rozwijania BottomSheet
      if (typeof sheetRef.current.snapToIndex === 'function') {
        console.log('Store: Wywołuję metodę snapToIndex(0)');
        sheetRef.current.snapToIndex(0); // 0 to pierwszy punkt zatrzymania (nagłówek)
      }
      // Możemy też spróbować expand jeśli istnieje
      else if (typeof sheetRef.current.expand === 'function') {
        console.log('Store: Wywołuję metodę expand()');
        sheetRef.current.expand();
      }
      else {
        console.error('Store: Nie znaleziono żadnej metody do rozwinięcia BottomSheet');
      }
    } catch (error) {
      console.error('Store: Błąd przy próbie rozwinięcia BottomSheet', error);
    }
  },
  collapseSheet: () => {
    const { sheetRef } = get();
    console.log('collapseSheet wywołany, sheetRef:', !!sheetRef, 'current:', !!sheetRef?.current);
    
    if (!sheetRef?.current) {
      console.error('Nie można zwinąć BottomSheet - referencja jest pusta');
      return;
    }
    
    try {
      // W komponencie FacilityBottomSheet najlepiej jest użyć albo close(), albo snapToIndex(-1)
      // Najpierw próbujemy metody close()
      if (typeof sheetRef.current.close === 'function') {
        console.log('Store: Wywołuję metodę close()');
        sheetRef.current.close();
      }
      // Następnie próbujemy snapToIndex(-1)
      else if (typeof sheetRef.current.snapToIndex === 'function') {
        console.log('Store: Wywołuję metodę snapToIndex(-1)');
        sheetRef.current.snapToIndex(-1);
      }
      // Jeśli nie ma żadnej z tych metod, sprawdzamy collapse
      else if (typeof sheetRef.current.collapse === 'function') {
        console.log('Store: Wywołuję metodę collapse()');
        sheetRef.current.collapse();
      }
      else {
        console.error('Store: Nie znaleziono żadnej metody do zamknięcia BottomSheet');
      }
    } catch (error) {
      console.error('Store: Błąd przy próbie zamknięcia BottomSheet', error);
    }
  },
}));

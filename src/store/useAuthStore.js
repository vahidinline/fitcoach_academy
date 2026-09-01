import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // initial empty state
      selectedUserType: '',
      selectedService: '',
      selectedServicePrice: '',
      selectedServiceRialPrice: '',
      selectedServiceName: '',
      selectedServiceLaunchOffer: null,
      selectedLocation: '',
      selectedAuthMethod: '',
      contactInfo: '',
      verificationCode: '',
      isVerified: false,
      userId: '',

      // generic setter
      setField: (key, value) => set((state) => ({ ...state, [key]: value })),

      // multiple field updates
      updateFields: (updates) => set((state) => ({ ...state, ...updates })),

      // reset store
      reset: () =>
        set({
          selectedUserType: '',
          selectedService: '',
          selectedServicePrice: '',
          selectedServiceRialPrice: '',
          selectedServiceName: '',
          selectedServiceLaunchOffer: null,
          selectedLocation: '',
          selectedAuthMethod: '',
          contactInfo: '',
          verificationCode: '',
          isVerified: false,
          userId: '',
        }),
    }),
    {
      name: 'registrationFormData', // persists in localStorage
    }
  )
);

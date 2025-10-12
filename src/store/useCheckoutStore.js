// store/useCheckoutStore.js
import { create } from 'zustand';

export const useCheckoutStore = create((set) => ({
  selectedUserType: '',
  selectedService: '',
  selectedServicePrice: '',
  selectedServiceName: '',
  selectedServiceRialPrice: '',

  selectedLocation: '',
  selectedAuthMethod: '',
  contactInfo: '',
  verificationCode: '',
  isVerified: false,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
}));

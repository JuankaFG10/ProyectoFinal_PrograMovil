import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Visit {
  id: string;
  name: string;
  id_number: string;
  house: string;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
}

interface VisitsState {
  list: Visit[];
  loading: boolean;
  error: string | null;
}

const initialState: VisitsState = {
  list: [],
  loading: false,
  error: null,
};

const visitsSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    setVisits(state, action: PayloadAction<Visit[]>) {
      state.list = action.payload;
    },
    addVisit(state, action: PayloadAction<Visit>) {
      state.list.unshift(action.payload);
    },
    updateVisitStatus(state, action: PayloadAction<{ id: string; status: 'approved' | 'denied' }>) {
      const visit = state.list.find(v => v.id === action.payload.id);
      if (visit) {
        visit.status = action.payload.status;
      }
    },
    removeVisit(state, action: PayloadAction<string>) {
      state.list = state.list.filter(v => v.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setVisits,
  addVisit,
  updateVisitStatus,
  removeVisit,
  setLoading,
  setError,
} = visitsSlice.actions;

export default visitsSlice.reducer;
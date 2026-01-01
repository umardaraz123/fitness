// store/slices/partnerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { partnerAPI } from '../../api/api';

// Async Thunks

// Get all partners with pagination and search
export const getPartners = createAsyncThunk(
    'partners/getPartners',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.getPartners(params);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch partners'
            );
        }
    }
);

// Get partner by ID
export const getPartnerById = createAsyncThunk(
    'partners/getPartnerById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.getPartnerById(id);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch partner'
            );
        }
    }
);

// Create partner
export const createPartner = createAsyncThunk(
    'partners/createPartner',
    async (data, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.createPartner(data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create partner'
            );
        }
    }
);

// Update partner
export const updatePartner = createAsyncThunk(
    'partners/updatePartner',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.updatePartner(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update partner'
            );
        }
    }
);

// Delete partner
export const deletePartner = createAsyncThunk(
    'partners/deletePartner',
    async (id, { rejectWithValue }) => {
        try {
            await partnerAPI.deletePartner(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete partner'
            );
        }
    }
);

// Get active partners (public)
export const getActivePartners = createAsyncThunk(
    'partners/getActivePartners',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.getActivePartners(params);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch partners'
            );
        }
    }
);

// Get partner with gallery images (public)
export const getPartnerWithGallery = createAsyncThunk(
    'partners/getPartnerWithGallery',
    async (id, { rejectWithValue }) => {
        try {
            const response = await partnerAPI.getPartnerWithGallery(id);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch partner details'
            );
        }
    }
);

const initialState = {
    partners: [],
    activePartners: [],
    currentPartner: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
    },
    isLoading: false,
    isLoadingActive: false,
    isLoadingDetail: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    successMessage: null,
};

const partnerSlice = createSlice({
    name: 'partners',
    initialState,
    reducers: {
        clearPartnerError: (state) => {
            state.error = null;
        },
        clearPartnerSuccess: (state) => {
            state.successMessage = null;
        },
        clearCurrentPartner: (state) => {
            state.currentPartner = null;
        },
        resetPartnerState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get Partners (Admin)
            .addCase(getPartners.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPartners.fulfilled, (state, action) => {
                state.isLoading = false;
                const data = action.payload.data || action.payload;
                state.partners = data.data || data || [];

                // Handle pagination
                if (data.meta || data.pagination) {
                    const paginationData = data.meta || data.pagination;
                    state.pagination = {
                        currentPage: paginationData.current_page || 1,
                        totalPages: paginationData.last_page || 1,
                        totalItems: paginationData.total || 0,
                        perPage: paginationData.per_page || 10,
                    };
                }
            })
            .addCase(getPartners.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Active Partners (Public)
            .addCase(getActivePartners.pending, (state) => {
                state.isLoadingActive = true;
                state.error = null;
            })
            .addCase(getActivePartners.fulfilled, (state, action) => {
                state.isLoadingActive = false;
                const data = action.payload.data || action.payload;
                state.activePartners = data.data || data || [];

                // Handle pagination for active partners
                if (data.meta || data.pagination) {
                    const paginationData = data.meta || data.pagination;
                    state.pagination = {
                        currentPage: paginationData.current_page || 1,
                        totalPages: paginationData.last_page || 1,
                        totalItems: paginationData.total || 0,
                        perPage: paginationData.per_page || 10,
                    };
                }
            })
            .addCase(getActivePartners.rejected, (state, action) => {
                state.isLoadingActive = false;
                state.error = action.payload;
            })

            // Get Partner By ID
            .addCase(getPartnerById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPartnerById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentPartner = action.payload.data || action.payload;
            })
            .addCase(getPartnerById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Partner With Gallery (Public Detail)
            .addCase(getPartnerWithGallery.pending, (state) => {
                state.isLoadingDetail = true;
                state.error = null;
            })
            .addCase(getPartnerWithGallery.fulfilled, (state, action) => {
                state.isLoadingDetail = false;
                state.currentPartner = action.payload.data || action.payload;
            })
            .addCase(getPartnerWithGallery.rejected, (state, action) => {
                state.isLoadingDetail = false;
                state.error = action.payload;
            })

            // Create Partner
            .addCase(createPartner.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createPartner.fulfilled, (state, action) => {
                state.isCreating = false;
                const newPartner = action.payload.data || action.payload;
                state.partners.unshift(newPartner);
                state.successMessage = 'Partner created successfully';
            })
            .addCase(createPartner.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload;
            })

            // Update Partner
            .addCase(updatePartner.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updatePartner.fulfilled, (state, action) => {
                state.isUpdating = false;
                const updatedPartner = action.payload.data || action.payload;
                const index = state.partners.findIndex(p => p.id === updatedPartner.id);
                if (index !== -1) {
                    state.partners[index] = updatedPartner;
                }
                state.currentPartner = updatedPartner;
                state.successMessage = 'Partner updated successfully';
            })
            .addCase(updatePartner.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            // Delete Partner
            .addCase(deletePartner.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deletePartner.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.partners = state.partners.filter(p => p.id !== action.payload);
                state.successMessage = 'Partner deleted successfully';
            })
            .addCase(deletePartner.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearPartnerError,
    clearPartnerSuccess,
    clearCurrentPartner,
    resetPartnerState,
} = partnerSlice.actions;

export default partnerSlice.reducer;


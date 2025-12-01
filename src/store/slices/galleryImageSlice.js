import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { galleryImageAPI } from '../../api/api';

// Async thunks for gallery image operations
export const deleteGalleryImage = createAsyncThunk(
  'galleryImages/delete',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.deleteGalleryImage(imageId);
      return { 
        data: response.data,
        imageId 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const safeDeleteGalleryImage = createAsyncThunk(
  'galleryImages/safeDelete',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.safeDeleteGalleryImage(imageId);
      return { 
        data: response.data,
        imageId 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const bulkDeleteGalleryImages = createAsyncThunk(
  'galleryImages/bulkDelete',
  async (imageIds, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.bulkDeleteGalleryImages(imageIds);
      return { 
        data: response.data,
        imageIds 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const setAsFeatured = createAsyncThunk(
  'galleryImages/setAsFeatured',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.setAsFeatured(imageId);
      return { 
        data: response.data,
        imageId 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateImagePosition = createAsyncThunk(
  'galleryImages/updatePosition',
  async ({ imageId, position }, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.updatePosition(imageId, position);
      return { 
        data: response.data,
        imageId,
        position 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const reorderImages = createAsyncThunk(
  'galleryImages/reorder',
  async ({ imageableId, imageableType, order }, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.reorderImages(imageableId, imageableType, order);
      return { 
        data: response.data,
        imageableId,
        imageableType,
        order 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadAndAttachImages = createAsyncThunk(
  'galleryImages/uploadAndAttach',
  async ({ files, imageableId, imageableType, additionalData = {} }, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.uploadAndAttachImages(files, imageableId, imageableType, additionalData);
      return { 
        data: response.data,
        imageableId,
        imageableType 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const detachImage = createAsyncThunk(
  'galleryImages/detach',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.detachImage(imageId);
      return { 
        data: response.data,
        imageId 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const restoreImage = createAsyncThunk(
  'galleryImages/restore',
  async (imageId, { rejectWithValue }) => {
    try {
      const response = await galleryImageAPI.restoreImage(imageId);
      return { 
        data: response.data,
        imageId 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const galleryImageSlice = createSlice({
  name: 'galleryImages',
  initialState: {
    // Delete operations
    deleteLoading: false,
    bulkDeleteLoading: false,
    deleteError: null,
    bulkDeleteError: null,
    deletedImages: [],
    bulkDeleteResults: null,
    
    // Feature operations
    featureLoading: false,
    featureError: null,
    
    // Position operations
    positionLoading: false,
    positionError: null,
    
    // Upload operations
    uploadLoading: false,
    galleryUploadError: null,
    
    // General operations
    operationLoading: false,
    operationError: null,
    
    // Success messages
    successMessage: null
  },
  reducers: {
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearBulkDeleteResults: (state) => {
      state.bulkDeleteResults = null;
    },
    clearFeatureError: (state) => {
      state.featureError = null;
    },
    clearPositionError: (state) => {
      state.positionError = null;
    },
    clearGalleryUploadError: (state) => {
      state.galleryUploadError = null;
    },
    clearOperationError: (state) => {
      state.operationError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearAllErrors: (state) => {
      state.deleteError = null;
      state.bulkDeleteError = null;
      state.featureError = null;
      state.positionError = null;
      state.galleryUploadError = null;
      state.operationError = null;
    },
    resetGalleryImageState: (state) => {
      state.deleteLoading = false;
      state.bulkDeleteLoading = false;
      state.deleteError = null;
      state.bulkDeleteError = null;
      state.deletedImages = [];
      state.bulkDeleteResults = null;
      state.featureLoading = false;
      state.featureError = null;
      state.positionLoading = false;
      state.positionError = null;
      state.uploadLoading = false;
      state.galleryUploadError = null;
      state.operationLoading = false;
      state.operationError = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Single delete
      .addCase(deleteGalleryImage.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.successMessage = null;
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deletedImages.push(action.payload.imageId);
        state.deleteError = null;
        state.successMessage = action.payload.data?.message || 'Image deleted successfully';
      })
      .addCase(deleteGalleryImage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.successMessage = null;
      })
      
      // Safe delete
      .addCase(safeDeleteGalleryImage.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.successMessage = null;
      })
      .addCase(safeDeleteGalleryImage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deletedImages.push(action.payload.imageId);
        state.deleteError = null;
        state.successMessage = action.payload.data?.message || 'Image deleted successfully';
      })
      .addCase(safeDeleteGalleryImage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.successMessage = null;
      })
      
      // Bulk delete
      .addCase(bulkDeleteGalleryImages.pending, (state) => {
        state.bulkDeleteLoading = true;
        state.bulkDeleteError = null;
        state.successMessage = null;
      })
      .addCase(bulkDeleteGalleryImages.fulfilled, (state, action) => {
        state.bulkDeleteLoading = false;
        state.bulkDeleteResults = action.payload.data;
        state.bulkDeleteError = null;
        state.successMessage = action.payload.data?.message || 'Images deleted successfully';
      })
      .addCase(bulkDeleteGalleryImages.rejected, (state, action) => {
        state.bulkDeleteLoading = false;
        state.bulkDeleteError = action.payload;
        state.successMessage = null;
      })
      
      // Set as featured
      .addCase(setAsFeatured.pending, (state) => {
        state.featureLoading = true;
        state.featureError = null;
        state.successMessage = null;
      })
      .addCase(setAsFeatured.fulfilled, (state, action) => {
        state.featureLoading = false;
        state.featureError = null;
        state.successMessage = action.payload.data?.message || 'Image set as featured successfully';
      })
      .addCase(setAsFeatured.rejected, (state, action) => {
        state.featureLoading = false;
        state.featureError = action.payload;
        state.successMessage = null;
      })
      
      // Update position
      .addCase(updateImagePosition.pending, (state) => {
        state.positionLoading = true;
        state.positionError = null;
        state.successMessage = null;
      })
      .addCase(updateImagePosition.fulfilled, (state, action) => {
        state.positionLoading = false;
        state.positionError = null;
        state.successMessage = action.payload.data?.message || 'Position updated successfully';
      })
      .addCase(updateImagePosition.rejected, (state, action) => {
        state.positionLoading = false;
        state.positionError = action.payload;
        state.successMessage = null;
      })
      
      // Reorder images
      .addCase(reorderImages.pending, (state) => {
        state.positionLoading = true;
        state.positionError = null;
        state.successMessage = null;
      })
      .addCase(reorderImages.fulfilled, (state, action) => {
        state.positionLoading = false;
        state.positionError = null;
        state.successMessage = action.payload.data?.message || 'Images reordered successfully';
      })
      .addCase(reorderImages.rejected, (state, action) => {
        state.positionLoading = false;
        state.positionError = action.payload;
        state.successMessage = null;
      })
      
      // Upload and attach images
      .addCase(uploadAndAttachImages.pending, (state) => {
        state.uploadLoading = true;
        state.galleryUploadError = null;
        state.successMessage = null;
      })
      .addCase(uploadAndAttachImages.fulfilled, (state, action) => {
        state.uploadLoading = false;
        state.galleryUploadError = null;
        state.successMessage = action.payload.data?.message || 'Images uploaded successfully';
      })
      .addCase(uploadAndAttachImages.rejected, (state, action) => {
        state.uploadLoading = false;
        state.galleryUploadError = action.payload;
        state.successMessage = null;
      })
      
      // Detach image
      .addCase(detachImage.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.successMessage = null;
      })
      .addCase(detachImage.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.successMessage = action.payload.data?.message || 'Image detached successfully';
      })
      .addCase(detachImage.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
        state.successMessage = null;
      })
      
      // Restore image
      .addCase(restoreImage.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
        state.successMessage = null;
      })
      .addCase(restoreImage.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationError = null;
        state.successMessage = action.payload.data?.message || 'Image restored successfully';
      })
      .addCase(restoreImage.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
        state.successMessage = null;
      });
  }
});

export const { 
  clearDeleteError, 
  clearBulkDeleteResults, 
  clearFeatureError,
  clearPositionError,
  clearGalleryUploadError,
  clearOperationError,
  clearSuccessMessage,
  clearAllErrors,
  resetGalleryImageState 
} = galleryImageSlice.actions;

export default galleryImageSlice.reducer;
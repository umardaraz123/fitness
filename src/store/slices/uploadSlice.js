import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { uploadAPI } from '../../api/api'
// Async thunks for upload operations
export const uploadFile = createAsyncThunk(
  'upload/single',
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadAPI.uploadFile(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  'upload/multiple',
  async (files, { rejectWithValue }) => {
    try {
      const response = await uploadAPI.uploadMultipleFiles(files);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'upload/delete',
  async (filePath, { rejectWithValue }) => {
    try {
      const response = await uploadAPI.deleteFile(filePath);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    // Single file upload
    singleUploadLoading: false,
    singleUploadProgress: 0,
    uploadedFile: null,
    singleUploadError: null,
    
    // Multiple files upload
    multipleUploadLoading: false,
    multipleUploadProgress: 0,
    uploadedFiles: [],
    multipleUploadError: null,
    
    // File deletion
    deleteLoading: false,
    deleteError: null,
    
    // General states
    successMessage: null,
    recentUploads: []
  },
  reducers: {
    // Progress updates
    setSingleUploadProgress: (state, action) => {
      state.singleUploadProgress = action.payload;
    },
    
    setMultipleUploadProgress: (state, action) => {
      state.multipleUploadProgress = action.payload;
    },
    
    // Clear states
    clearUploadedFile: (state) => {
      state.uploadedFile = null;
    },
    
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
    
    clearSingleUploadError: (state) => {
      state.singleUploadError = null;
    },
    
    clearMultipleUploadError: (state) => {
      state.multipleUploadError = null;
    },
    
    clearFileDeleteError: (state) => {
      state.deleteError = null;
    },
    
    clearUploadSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    clearAllUploads: (state) => {
      state.uploadedFile = null;
      state.uploadedFiles = [];
      state.recentUploads = [];
    },
    
    addToRecentUploads: (state, action) => {
      state.recentUploads.unshift(action.payload);
      // Keep only last 10 uploads
      if (state.recentUploads.length > 10) {
        state.recentUploads = state.recentUploads.slice(0, 10);
      }
    },
    
    removeFromRecentUploads: (state, action) => {
      state.recentUploads = state.recentUploads.filter(
        upload => upload.id !== action.payload
      );
    },
    
    resetUploadState: (state) => {
      state.singleUploadLoading = false;
      state.singleUploadProgress = 0;
      state.uploadedFile = null;
      state.singleUploadError = null;
      state.multipleUploadLoading = false;
      state.multipleUploadProgress = 0;
      state.uploadedFiles = [];
      state.multipleUploadError = null;
      state.deleteLoading = false;
      state.deleteError = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Single file upload
      .addCase(uploadFile.pending, (state) => {
        state.singleUploadLoading = true;
        state.singleUploadProgress = 0;
        state.singleUploadError = null;
        state.successMessage = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.singleUploadLoading = false;
        state.singleUploadProgress = 100;
        state.uploadedFile = action.payload;
        state.singleUploadError = null;
        state.successMessage = 'File uploaded successfully';
        
        // Add to recent uploads
        if (action.payload) {
          state.recentUploads.unshift({
            id: Date.now(),
            file: action.payload,
            timestamp: new Date().toISOString(),
            type: 'single'
          });
          
          // Keep only last 10 uploads
          if (state.recentUploads.length > 10) {
            state.recentUploads = state.recentUploads.slice(0, 10);
          }
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.singleUploadLoading = false;
        state.singleUploadProgress = 0;
        state.singleUploadError = action.payload;
        state.successMessage = null;
      })
      
      // Multiple files upload
      .addCase(uploadMultipleFiles.pending, (state) => {
        state.multipleUploadLoading = true;
        state.multipleUploadProgress = 0;
        state.multipleUploadError = null;
        state.successMessage = null;
      })
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        state.multipleUploadLoading = false;
        state.multipleUploadProgress = 100;
        state.uploadedFiles = action.payload.files || [];
        state.multipleUploadError = null;
        state.successMessage = `${action.payload.files?.length || 0} files uploaded successfully`;
        
        // Add to recent uploads
        if (action.payload.files && action.payload.files.length > 0) {
          state.recentUploads.unshift({
            id: Date.now(),
            files: action.payload.files,
            timestamp: new Date().toISOString(),
            type: 'multiple',
            count: action.payload.files.length
          });
          
          // Keep only last 10 uploads
          if (state.recentUploads.length > 10) {
            state.recentUploads = state.recentUploads.slice(0, 10);
          }
        }
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.multipleUploadLoading = false;
        state.multipleUploadProgress = 0;
        state.multipleUploadError = action.payload;
        state.successMessage = null;
      })
      
      // Delete file
      .addCase(deleteFile.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.successMessage = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.successMessage = action.payload.message || 'File deleted successfully';
        
        // Remove from recent uploads if exists
        state.recentUploads = state.recentUploads.filter(upload => {
          if (upload.type === 'single' && upload.file?.file_path === action.meta.arg) {
            return false;
          }
          if (upload.type === 'multiple' && upload.files) {
            upload.files = upload.files.filter(file => file.file_path !== action.meta.arg);
            return upload.files.length > 0;
          }
          return true;
        });
        
        // Remove from uploaded files
        if (state.uploadedFile?.file_path === action.meta.arg) {
          state.uploadedFile = null;
        }
        
        state.uploadedFiles = state.uploadedFiles.filter(
          file => file.file_path !== action.meta.arg
        );
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.successMessage = null;
      });
  }
});

export const {
  setSingleUploadProgress,
  setMultipleUploadProgress,
  clearUploadedFile,
  clearUploadedFiles,
  clearSingleUploadError,
  clearMultipleUploadError,
  clearFileDeleteError,
  clearUploadSuccessMessage,
  clearAllUploads,
  addToRecentUploads,
  removeFromRecentUploads,
  resetUploadState,
} = uploadSlice.actions;

export default uploadSlice.reducer;
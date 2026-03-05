import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../types/Comment';
import { getPostComments } from '../api/comments';

type CommentsState = {
  items: Comment[];
  loaded: boolean;
  hasError: string;
};

const initialState: CommentsState = {
  items: [],
  loaded: false,
  hasError: '',
};

export const init = createAsyncThunk('comments/init', (userId: number) => {
  return getPostComments(userId);
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.items.push(action.payload);
    },
    deleteComment(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearComments(state) {
      state.items = [];
      state.loaded = false;
      state.hasError = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(init.pending, state => {
      state.loaded = true;
      state.hasError = '';
    });
    builder.addCase(init.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loaded = false;
    });
    builder.addCase(init.rejected, state => {
      state.hasError = 'Failed to load comments';
      state.loaded = false;
    });
  },
});

export default commentsSlice.reducer;
export const { addComment, deleteComment, clearComments } =
  commentsSlice.actions;

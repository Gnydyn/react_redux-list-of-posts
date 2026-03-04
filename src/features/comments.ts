import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../types/Comment';
import { getPostComments } from '../api/comments';

type CommentsState = {
  comments: Comment[];
  loading: boolean;
  error: string;
};

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: '',
};

export const init = createAsyncThunk('comments/init', (userId: number) => {
  return getPostComments(userId);
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
    },
    takeComment(state, action: PayloadAction<number>) {
      state.comments = state.comments.filter(
        comment => comment.id !== action.payload,
      );
    },
    clearComments(state) {
      state.comments = [];
      state.loading = false;
      state.error = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(init.pending, state => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(init.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.loading = false;
    });
    builder.addCase(init.rejected, state => {
      state.error = 'Failed to load comments';
      state.loading = false;
    });
  },
});

export default commentsSlice.reducer;
export const { addComment, takeComment, clearComments } = commentsSlice.actions;

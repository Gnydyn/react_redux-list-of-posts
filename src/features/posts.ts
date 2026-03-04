import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Post } from '../types/Post';
import { getUserPosts } from '../api/posts';

type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string;
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: '',
};

export const init = createAsyncThunk('posts/init', (userId: number) => {
  return getUserPosts(userId);
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts(state) {
      state.posts = [];
      state.loading = false;
      state.error = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(init.pending, state => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(init.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.loading = false;
    });
    builder.addCase(init.rejected, state => {
      state.error = 'Failed to load posts';
      state.loading = false;
    });
  },
});

export default postsSlice.reducer;
export const { clearPosts } = postsSlice.actions;

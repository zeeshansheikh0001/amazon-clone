import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  cartItems: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

// Get cart items
export const getCartItems = createAsyncThunk(
  'cart/getItems',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized, no token');
      }
      
      return await cartService.getCartItems(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (cartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized, no token');
      }
      
      return await cartService.addToCart(cartData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async (cartData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized, no token');
      }
      
      return await cartService.updateCartItem(cartData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized, no token');
      }
      
      return await cartService.removeFromCart(cartItemId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearItems',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      
      if (!token) {
        return thunkAPI.rejectWithValue('Not authorized, no token');
      }
      
      return await cartService.clearCart(token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Get cart items
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // After successfully adding to cart, fetch the updated cart items
        if (action.payload && action.payload.cartItem) {
          // If the backend returns the newly added cart item, add it to the state
          const newItem = action.payload.cartItem;
          
          // Check if the item already exists in the cart
          const existingItemIndex = state.cartItems.findIndex(
            item => item.id === newItem.id
          );
          
          if (existingItemIndex !== -1) {
            // Update existing item
            state.cartItems[existingItemIndex] = newItem;
          } else {
            // Add new item to cart
            state.cartItems.push(newItem);
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedItem = action.payload.cartItem;
        state.cartItems = state.cartItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        );
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = state.cartItems.filter(item => 
          item.id !== Number(action.meta.arg)
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer; 
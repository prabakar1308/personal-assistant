import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCalendarDate } from "../utils";

const api = process.env.REACT_APP_API_URL;

export const fetchAvailableProducts = createAsyncThunk(
  "personalAssistant/fetchAvailableProducts",
  async () => {
    const response = await axios.get(`${api}/notes/master-products`);
    return response.data;
  }
);

export const createAvailableProducts = createAsyncThunk(
  "personalAssistant/createAvailableProducts",
  async (product) => {
    const response = await axios.post(`${api}/notes/master-products`, product);
    if (response.status === 200) {
      return product;
    }
    return null;
  }
);

export const fetchAvailableCategories = createAsyncThunk(
  "personalAssistant/fetchAvailableCategories",
  async () => {
    const response = await axios.get(`${api}/notes/master-categories`);
    // const response = await axios.get(
    //   "http://localhost:3001/availableCategories"
    // );
    return response.data;
  }
);

export const createAvailableCategories = createAsyncThunk(
  "personalAssistant/createAvailableCategories",
  async (category) => {
    const response = await axios.post(
      `${api}/notes/master-categories`,
      category
    );
    if (response.status === 200) {
      return category;
    }
    return null;
  }
);

export const fetchProducts = createAsyncThunk(
  "personalAssistant/fetchProducts",
  async (isCompleted) => {
    const response = await axios.get(`${api}/notes/products`);
    return { data: response.data, isCompleted };
  }
);

export const createProducts = createAsyncThunk(
  "personalAssistant/createProducts",
  async (product, { getState }) => {
    const state = getState();

    const filtered = [...state.items].filter(
      (item) =>
        item.name === product.name &&
        item.category === product.category &&
        new Date(item.date).toLocaleDateString() ===
          new Date(product.date).toLocaleDateString()
    );
    if (filtered.length > 0) {
      return null;
    } else {
      const response = await axios.post(`${api}/notes/products`, {
        ...product,
        date: Date.parse(new Date(product.date)) / 1000,
      });
      if (response.status === 200) {
        return product;
      }
      return null;
    }
  }
);

export const updateProducts = createAsyncThunk(
  "personalAssistant/updateProducts",
  async (payload, { getState, dispatch }) => {
    const state = getState();

    const { items, isCompleted } = payload;
    const updatedProducts = [];
    [...state.items].map((item) => {
      const filteredVal = items.filter((p) => p.id === item.id);
      if (filteredVal.length) {
        updatedProducts.push({
          ...item,
          price: filteredVal[0].price,
          isCompleted: !isCompleted,
          date: Date.parse(new Date(item.date)) / 1000,
          purchasedDate: !isCompleted ? Date.parse(new Date()) / 1000 : 0,
        });
      }
    });
    if (updatedProducts.length) {
      await axios.put(`${api}/notes/products`, updatedProducts);
      dispatch(fetchProducts(isCompleted));
      // updatedProducts.forEach(async (product, index) => {
      //   if (index === updatedProducts.length - 1) {
      //   }
      // });
    }

    // if (updatedProducts.length === 0) {
    //   return null;
    // } else {
    //   const response = await axios.patch(
    //     "http://localhost:3001/products",
    //     updatedProducts
    //   );
    //   return response.data;
    // }
  }
);

export const updateProductQuantity = createAsyncThunk(
  "personalAssistant/updateProductQuantity",
  async (payload, { getState, dispatch }) => {
    const state = getState();
    const { id, canIncrease, number } = payload;
    const filteredItems = [...state.items].filter((item) => item.id === id);
    if (filteredItems.length) {
      const product = {
        ...filteredItems[0],
        quantity: canIncrease
          ? parseFloat(filteredItems[0].quantity) + number
          : parseFloat(filteredItems[0].quantity) - number,
        date: Date.parse(new Date(filteredItems[0].date)) / 1000,
      };
      const response = await axios.put(`${api}/notes/products`, [product]);
      // dispatch(fetchProducts());
      if (response.status === 200) {
        return product;
      }
      return null;
    }
  }
);

export const deleteProducts = createAsyncThunk(
  "personalAssistant/deleteProducts",
  async (payload, { dispatch }) => {
    await axios.delete(`${api}/notes/product/${payload}`);
    dispatch(fetchProducts(false));
  }
);

const personalAssisantSlice = createSlice({
  name: "personalAssistant",
  initialState: {
    items: [],
    availableProducts: [],
    createProductMessage: null,
    availableCategories: [],
    loading: false,
  },
  reducers: {
    resetCreateProductMessage: (state) => {
      state.createProductMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(fetchAvailableProducts.fulfilled, (state, action) => {
        state.availableProducts = [...action.payload];
      })
      .addCase(fetchAvailableCategories.fulfilled, (state, action) => {
        state.availableCategories = [...action.payload];
      })
      .addCase(createAvailableProducts.fulfilled, (state, action) => {
        if (action.payload)
          state.availableProducts = [
            ...state.availableProducts,
            action.payload,
          ];
      })
      .addCase(createAvailableCategories.fulfilled, (state, action) => {
        if (action.payload)
          state.availableCategories = [
            ...state.availableCategories,
            action.payload,
          ];
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const minDate = getCalendarDate(30).date;
        const { isCompleted, data } = action.payload;
        const products = [...data].map((product) => ({
          ...product,
          date: new Date(product.date * 1000),
          purchasedDate: product.purchasedDate
            ? new Date(product.purchasedDate * 1000)
            : 0,
        }));
        let updatedProducts = products.filter((product) => product.isCompleted);
        if (!isCompleted) {
          updatedProducts = products.filter(
            (product) =>
              Date.parse(product.date) >= minDate && !product.isCompleted
          );
        }
        state.items = [...updatedProducts];
        state.loading = false;
      })
      .addCase(createProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [...state.items, action.payload];
          state.createProductMessage = "success";
        } else {
          state.createProductMessage = "error";
        }
        state.loading = false;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        if (action.payload)
          state.items = [...state.items].map((item) => {
            if (action.payload && action.payload.id === item.id)
              return {
                ...action.payload,
                date: new Date(action.payload.date * 1000),
              };

            return item;
          });
        // if (action.payload) {
        //   state.items = [...state.items, action.payload];
        //   state.createProductMessage = "success";
        // } else {
        //   state.createProductMessage = "error";
        // }
      });
  },
});
const { actions, reducer } = personalAssisantSlice;
export const {
  // createItems,
  // updateItems,
  resetCreateProductMessage,
  // updateQuantity,
} = actions;
export default reducer;

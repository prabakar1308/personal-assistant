import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCalendarDate } from "../utils";

export const fetchAvailableProducts = createAsyncThunk(
  "personalAssistant/fetchAvailableProducts",
  async (e, { getState }) => {
    const response = await axios.get("http://localhost:3001/availableProducts");
    return response.data;
  }
);

export const createAvailableProducts = createAsyncThunk(
  "personalAssistant/createAvailableProducts",
  async (product) => {
    const response = await axios.post(
      "http://localhost:3001/availableProducts",
      product
    );
    return response.data;
  }
);

export const fetchAvailableCategories = createAsyncThunk(
  "personalAssistant/fetchAvailableCategories",
  async () => {
    const response = await axios.get(
      "http://localhost:3001/availableCategories"
    );
    return response.data;
  }
);

export const createAvailableCategories = createAsyncThunk(
  "personalAssistant/createAvailableCategories",
  async (category) => {
    const response = await axios.post(
      "http://localhost:3001/availableCategories",
      category
    );
    return response.data;
  }
);

export const fetchProducts = createAsyncThunk(
  "personalAssistant/fetchProducts",
  async (isCompleted) => {
    const response = await axios.get("http://localhost:3001/products");
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
        item.date === product.date
    );
    if (filtered.length > 0) {
      return null;
    } else {
      const response = await axios.post(
        "http://localhost:3001/products",
        product
      );
      return response.data;
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
        });
      }
    });
    if (updatedProducts.length) {
      updatedProducts.forEach(async (product, index) => {
        await axios.put(
          `http://localhost:3001/products/${product.id}`,
          product
        );
        if (index === updatedProducts.length - 1) {
          dispatch(fetchProducts(isCompleted));
        }
      });
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
      const product = filteredItems[0];
      const response = await axios.put(
        `http://localhost:3001/products/${product.id}`,
        {
          ...product,
          quantity: canIncrease
            ? parseInt(product.quantity) + number
            : parseInt(product.quantity) - number,
        }
      );
      // dispatch(fetchProducts());
      return response.data;
    }
  }
);

export const deleteProducts = createAsyncThunk(
  "personalAssistant/deleteProducts",
  async (payload, { dispatch }) => {
    await axios.delete(`http://localhost:3001/products/${payload}`);
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
    // createItems: (state, param) => {
    //   const { payload } = param;
    //   console.log("payload", payload);
    //   const filtered = [...state.items].filter(
    //     (item) =>
    //       item.name === payload.name &&
    //       item.category === payload.category &&
    //       item.date === payload.date
    //   );
    //   if (filtered.length > 0) {
    //     state.createProductMessage = "error";
    //   } else {
    //     let { categoryId, id, category, name } = payload;

    //     state.items = [...state.items, { ...payload, categoryId, id }];
    //     state.createProductMessage = "success";
    //   }
    // },
    // updateItems: (state, param) => {
    //   const {
    //     payload: { items, isCompleted },
    //   } = param;
    //   // console.log("updateItems0", payload);
    //   const updatedItems = [...state.items].map((item) => {
    //     const filteredVal = items.filter((p) => p.id === item.id);
    //     // let flag = filteredVal.length > 0;
    //     // if (isCompleted) {

    //     // }
    //     let isCompleteFlag = item.isCompleted;
    //     if (filteredVal.length > 0) isCompleteFlag = !isCompleted;
    //     return {
    //       ...item,
    //       price: filteredVal.length > 0 ? filteredVal[0].price : item.price,
    //       isCompleted: isCompleteFlag,
    //     };
    //   });
    //   console.log(updatedItems);
    //   state.items = [...updatedItems];
    // },
    // updateQuantity: (state, param) => {
    //   const {
    //     payload: { id, categoryId, date, canIncrease },
    //   } = param;
    //   const filteredItems = [...state.items].map((item) => {
    //     if (
    //       item.id === id &&
    //       item.categoryId === categoryId &&
    //       item.date === date
    //     ) {
    //       return {
    //         ...item,
    //         quantity: canIncrease
    //           ? parseInt(item.quantity) + 1
    //           : parseInt(item.quantity) - 1,
    //       };
    //     }
    //     return item;
    //   });
    //   state.items = [...filteredItems];
    // },
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
        state.availableProducts = [...state.availableProducts, action.payload];
      })
      .addCase(createAvailableCategories.fulfilled, (state, action) => {
        state.availableCategories = [
          ...state.availableCategories,
          action.payload,
        ];
      })
      .addCase(fetchProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const date = getCalendarDate(30).date;
        const { isCompleted, data } = action.payload;
        let products = [...data].filter((product) => product.isCompleted);
        if (!isCompleted) {
          products = [...data].filter(
            (product) =>
              new Date(product.date) >= new Date(date) && !product.isCompleted
          );
        }
        state.items = [...products];
        state.loading = false;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = [...state.items, action.payload];
          state.createProductMessage = "success";
        } else {
          state.createProductMessage = "error";
        }
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        state.items = [...state.items].map((item) => {
          if (action.payload && action.payload.id === item.id)
            return action.payload;

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

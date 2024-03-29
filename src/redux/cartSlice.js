import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://skillfactory-task.detmir.team/cart`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                const serverError = await response.json();
                throw new Error(serverError.error);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/updateCart",
    async (cartData, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://skillfactory-task.detmir.team/cart/update`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartData),
                }
            );
            if (!response.ok) {
                const serverError = await response.json();
                throw new Error(serverError.error);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const setOneItemInCart = createAsyncThunk(
    "cart/setOneItemInCart",
    async (cartData, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://skillfactory-task.detmir.team/cart/update`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartData),
                }
            );
            if (!response.ok) {
                const serverError = await response.json();
                throw new Error(serverError.error);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    })

export const submitCart = createAsyncThunk(
    "cart/submitCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://skillfactory-task.detmir.team/cart/submit`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const serverError = await response.json();
                throw new Error(serverError.error);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

// Сделана отдельная функция для оформления одного товара на случай, если логика запростов на сервер будет отличаться в будущем (например, сабмит по id). Методы отличаются только экстра редьюсером при успешном выполнении.

export const submitOneItem = createAsyncThunk(
    "cart/submitOneItem",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `https://skillfactory-task.detmir.team/cart/submit`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const serverError = await response.json();
                throw new Error(serverError.error);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const cartSclice = createSlice({
    name: "cart",
    initialState: {
        cartContent: {
            "data": [],
        },
        cartData: {
            "data": [],
        },
        isLoading: false,
        isSubmitting: false,
        popupIsOpen: false,
        initialLoad: true,
        message: "",
    },
    reducers: {
        updateCartData(state, action) {
            const { id, count } = action.payload;
            const indexWithId = state.cartData.data.findIndex((item) => item.id === id);
            if (indexWithId !== -1) {
                state.cartData.data[indexWithId].quantity = count;
            } else {
                state.cartData.data.push({ id, quantity: count });
            }
        },
        updateFromOrder(state, action) {
            const orderArray = action.payload;
            orderArray.forEach((item) => {
                const { id, quantity } = item;
                const indexWithId = state.cartData.data.findIndex((cartItem) => cartItem.id === id);
                if (indexWithId !== -1) {
                    state.cartData.data[indexWithId].quantity += quantity;
                } else {
                    state.cartData.data.push({ id, quantity });
                }
            });
        },
        deleteItem(state, action) {
            const { id } = action.payload;
            const indexWithId = state.cartData.data.findIndex((item) => item.id === id);
            state.cartData.data.splice(indexWithId, 1);
        },
        addItem(state, action) {
            const { id, count } = action.payload;
            state.cartData.data.push({ id, quantity: count });
        },
        setCartData(state, action) {
            state.cartData = action.payload;
        },
        togglePopup(state) {
            state.popupIsOpen = !state.popupIsOpen;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                const formattedData = action.payload.map((item) => ({ "id": item.product.id, "quantity": item.quantity }));
                state.cartContent.data = action.payload;
                state.cartData.data = formattedData;
                state.initialLoad = false;
            })
            .addCase(updateCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.isLoading = false;
                console.log(action.payload);
                state.popupIsOpen = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartContent.data = action.payload;
            })
            .addCase(setOneItemInCart.pending, (state) => {
                state.isLoading = true;
                state.message = "";
            })
            .addCase(setOneItemInCart.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.popupIsOpen = true;
            })
            .addCase(setOneItemInCart.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(submitCart.pending, (state) => {
                state.isSubmitting = true;
                state.message = "";
            })
            .addCase(submitCart.rejected, (state, action) => {
                state.isSubmitting = false;
                state.message = action.payload;
                state.popupIsOpen = true;
            })
            .addCase(submitCart.fulfilled, (state) => {
                state.isSubmitting = false;
                state.message = "Заказ создан";
                state.popupIsOpen = true;
                state.cartData.data = [];
            })
            .addCase(submitOneItem.pending, (state) => {
                state.isSubmitting = true;
                state.message = "";
            })
            .addCase(submitOneItem.rejected, (state, action) => {
                state.isSubmitting = false;
                state.message = action.payload;
                state.popupIsOpen = true;
            })
            .addCase(submitOneItem.fulfilled, (state) => {
                state.isSubmitting = false;
                state.message = "Заказ создан";
                state.popupIsOpen = true;
            })
    }
});

export const { updateCartData, setisInitialLoad, deleteItem, setCartData, togglePopup, updateFromOrder } = cartSclice.actions;
export default cartSclice.reducer;
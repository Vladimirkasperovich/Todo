import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app.reducer";
import { authAPI, LoginParamsType } from "features/auth/auth.api";
import { clearTasksAndTodolists } from "common/actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import {thunkTryCatch} from "common/utils/thunk-try-catch";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //   state.isLoggedIn = action.payload.isLoggedIn;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(initializeApp.fulfilled, (state) => {
        state.isLoggedIn = true;
      });
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;


export const login = createAppAsyncThunk<void, LoginParamsType>(
    "auth/login", async (args, thunkAPI) => {
      const { dispatch, rejectWithValue } = thunkAPI;
      return thunkTryCatch(thunkAPI, async () => {
        dispatch(appActions.setAppStatus({ status: "loading" }));
        const res = await authAPI.login(args);
        if (res.data.resultCode === 0) {
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
          return undefined;
        } else {
          const isShowError = !res.data?.fieldsErrors?.length
          handleServerAppError(res.data, dispatch, isShowError);
          return rejectWithValue(res.data);
        }
      })


    },
);


export const logout = createAppAsyncThunk<void, void>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists());
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return undefined;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  })
});

export const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('auth/initializeApp', async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;

  return thunkTryCatch(thunkAPI, async () => {
    const res = await authAPI.me();
    debugger
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch, true)
      return rejectWithValue(null);
    }
  }).finally(() => {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  });
});

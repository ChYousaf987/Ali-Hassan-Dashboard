import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import profileSlice from './profileSlice'
const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    profileSlice:profileSlice,
});

export default configureStore({
    reducer: rootReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

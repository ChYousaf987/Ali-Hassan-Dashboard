import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    data: {
        first_name:'',
   last_name:'',
   email:'',
   is_active:'',
   is_verified:'',
   role:'',
   profile_image_url:'',
   id:''
    }
   
}

const profileSlice = createSlice({
    name:'user',
    initialState:initialState,
    reducers:{
        Profile : (state,action)=>{
            state.data = action.payload.data
        }
    }
})

export const {Profile} = profileSlice.actions
export default profileSlice.reducer
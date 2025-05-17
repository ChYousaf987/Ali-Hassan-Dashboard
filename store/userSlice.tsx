import { createSlice } from "@reduxjs/toolkit";


const initialState = {
   first_name:'',
   last_name:'',
   email:'',
   profile_image_url:'',
   id:''
}

const profileSlice = createSlice({
    name:'user',
    initialState:initialState,
    reducers:{
        Profile : (state,action)=>{
            state.first_name = action.payload.data
        }
    }
})

export const {Profile} = profileSlice.actions
export default profileSlice.reducer
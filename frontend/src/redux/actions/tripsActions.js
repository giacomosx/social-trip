import {createAsyncThunk} from "@reduxjs/toolkit";
import AxiosApi from "../../api/axiosApi";

export const getTrips = createAsyncThunk('currentUserTrips/GET', async (userId) => {
    const api = new AxiosApi()
    try {
        const response = await api.get(`/user/${userId}/trips`)
        return response.trips
    } catch (e) {
        console.log(e)
        return e
    }
})

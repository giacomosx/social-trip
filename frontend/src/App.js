import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Me from "./pages/Me";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import CreateTrip from "./pages/CreateTrip";
import Posts from "./pages/Posts";
import Trip from "./pages/Trip";
import Trips from "./pages/Trips";
import EditTrip from "./pages/EditTrip";
import CreatePost from "./pages/CreatePost";
import LikedPosts from "./pages/LikedPosts";
import LikedTrips from "./pages/LikedTrips";
import EditUser from "./pages/EditUser";
import Profile from "./pages/Profile";
import UserTrip from "./pages/UserTrip";
import Explore from "./pages/Explore";
import Users from "./pages/Users";
import EditPost from "./pages/EditPost";
import Error404 from "./pages/Page404";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path={'/'} element={<Registration />} />
                <Route path={'/login'} element={<Login />} />
                <Route element={<ProtectedRoutes />}>
                    <Route path={'/me'} element={<Me />} />
                    <Route path={'/me/settings'} element={<EditUser />} />
                    <Route path={'/explore'} element={<Explore />} />
                    <Route path={'/user/:id'} element={<Profile />} />
                    <Route path={'/user/:userId/trip/:id'} element={<UserTrip />} />
                    <Route path={'/me/users'} element={<Users />} />
                    <Route path={'/posts'} element={<Posts />} />
                    <Route path={'/post/create'} element={<CreatePost />} />
                    <Route path={'/post/:id/edit'} element={<EditPost />} />
                    <Route path={'/posts/liked'} element={<LikedPosts />} />
                    <Route path={'/trips'} element={<Trips />} />
                    <Route path={'/trips/:id'} element={<Trip />} />
                    <Route path={'/trip/create'} element={<CreateTrip />} />
                    <Route path={'/trips/:id/edit'} element={<EditTrip />} />
                    <Route path={'/trips/saved'} element={<LikedTrips />} />
                    <Route path={'*'} element={<Error404 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
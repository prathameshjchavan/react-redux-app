import { combineReducers } from "@reduxjs/toolkit";
import entitiesReducer from "./entities.js";

export default combineReducers({
	entities: entitiesReducer,
});

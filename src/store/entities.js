import { combineReducers } from "@reduxjs/toolkit";
import bugsRedcuer from "./bugs.js";
import projectsReducer from "./projects.js";
import usersReducer from "./users.js";

export default combineReducers({
	bugs: bugsRedcuer,
	projects: projectsReducer,
	users: usersReducer,
});

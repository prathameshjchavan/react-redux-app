import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api.js";

let lastId = 0;

const slice = createSlice({
	name: "bugs",
	initialState: {
		list: [],
		loading: false,
		lastFetch: null,
	},
	reducers: {
		bugsReceived: (bugs, action) => {
			bugs.list = action.payload;
			bugs.loading = false;
			bugs.lastFetch = Date.now();
		},
		bugAdded: (bugs, action) => {
			bugs.list.push({
				id: ++lastId,
				description: action.payload.description,
				resolved: false,
			});
		},
		bugRemoved: (bugs, action) => {
			const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
			bugs.list.splice(index, 1);
		},
		bugResolved: (bugs, action) => {
			const { id } = action.payload;
			const index = bugs.list.findIndex((bug) => bug.id === id);
			bugs.list[index].resolved = true;
		},
		bugAssignedToUser: (bugs, action) => {
			const { id: bugId, userId } = action.payload;
			const index = bugs.list.findIndex((bug) => bug.id === bugId);
			bugs.list[index].userId = userId;
		},
		bugsRequested: (bugs, action) => {
			bugs.loading = true;
		},
		bugRequestFailed: (bugs, action) => {
			bugs.loading = false;
		},
	},
});

export const {
	bugsReceived,
	bugsRequested,
	bugRequestFailed,
	bugAdded,
	bugResolved,
	bugRemoved,
	bugAssignedToUser,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/bugs";

export const loadBugs = () => (dispatch, getState) => {
	const { lastFetch } = getState().entities.bugs;

	const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
	if (diffInMinutes < 10) return;

	return dispatch(
		apiCallBegan({
			url,
			onStart: bugsRequested.type,
			onSuccess: bugsReceived.type,
			onError: bugRequestFailed.type,
		})
	);
};

export const addBug = (bug) =>
	apiCallBegan({
		url,
		method: "post",
		data: bug,
		onSuccess: bugAdded.type,
	});

export const resolveBug = (id) =>
	apiCallBegan({
		url: `${url}/${id}`,
		method: "patch",
		data: { resolved: true },
		onSuccess: bugResolved.type,
	});

export const assignBugToUser = (bugId, userId) =>
	apiCallBegan({
		url: `${url}/${bugId}`,
		method: "patch",
		data: { userId },
		onSuccess: bugAssignedToUser.type,
	});

// Selector
export const getUnresolvedBugs = createSelector(
	(state) => state.entities.bugs,
	(bugs) => bugs.list.filter((bug) => !bug.resolved)
);

export const getBugsByUser = (userId) =>
	createSelector(
		(state) => state.entities.bugs,
		(bugs) => bugs.list.filter((bug) => bug.userId === userId)
	);

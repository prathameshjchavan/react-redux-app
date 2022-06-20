const func =
	({ getState, dispatch }) =>
	(next) =>
	(action) =>
		typeof action === "function" ? action(dispatch, getState) : next(action);
export default func;

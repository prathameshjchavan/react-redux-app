import { configureStore } from "@reduxjs/toolkit";
import toast from "./middleware/toast.js";
import func from "./middleware/func.js";
import logger from "./middleware/logger.js";
import reducer from "./reducer.js";
import api from "./middleware/api.js";

function configure() {
	return configureStore({
		reducer,
		middleware: [logger({ destination: "console" }), func, toast, api],
	});
}

export default configure;

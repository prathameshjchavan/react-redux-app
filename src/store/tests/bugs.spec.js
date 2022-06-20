import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import configureStore from "../configureStore";
import {
	addBug,
	assignBugToUser,
	getUnresolvedBugs,
	loadBugs,
	resolveBug,
} from "../bugs.js";
import { bugRemoved } from "../bugs.js";

describe("bugsSlice", () => {
	let fakeAxios;
	let store;
	const url = "http://localhost:9001/api/bugs";

	beforeEach(() => {
		fakeAxios = new MockAdapter(axios);
		store = configureStore();
	});

	const bugsSlice = () => store.getState().entities.bugs;

	const createState = () => ({
		entities: {
			bugs: {
				list: [],
			},
		},
	});

	it("should add the bug to the store if it's saved to the server", async () => {
		const bug = { description: "a" };
		const savedBug = { ...bug, id: 1, resolved: false };
		fakeAxios.onPost(url).reply(200, savedBug);

		await store.dispatch(addBug(bug));
		console.log(bugsSlice());

		expect(bugsSlice().list).toEqual([savedBug]);
	});

	it("should not add the bug to the store if it's not saved to the server", async () => {
		const bug = { description: "a" };
		fakeAxios.onPost(url).reply(500);

		await store.dispatch(addBug(bug));

		expect(bugsSlice().list).toHaveLength(0);
	});

	it("should mark the bug as resolved if it's saved to the server", async () => {
		await store.dispatch(addBug({ description: "a" }));
		fakeAxios.onPatch(`${url}/2`).reply(200, { id: 2, resolved: true });
		fakeAxios.onPost(url).reply(200, { id: 2 });

		await store.dispatch(addBug({}));
		console.log(bugsSlice());
		await store.dispatch(resolveBug(2));

		expect(bugsSlice().list[0].resolved).toBe(true);
	});

	it("should assign the bug to the user", async () => {
		fakeAxios.onPost(url).reply(201, { description: "a" });
		fakeAxios.onPatch(`${url}/3`).reply(200, { id: 3, userId: 1 });

		await store.dispatch(addBug({ description: "a" }));
		await store.dispatch(assignBugToUser(3, 1));

		expect(bugsSlice().list[0].userId).toBe(1);
	});

	it("should remove the bug if it's removed from the server", async () => {
		fakeAxios.onPost(url).reply(201, { description: "a" });

		await store.dispatch(addBug({ description: "a" }));
		await store.dispatch({ type: bugRemoved.type, payload: { id: 4 } });

		expect(bugsSlice().list).toEqual([]);
	});

	describe("loading bugs", () => {
		describe("if the bugs exists in the cache", () => {
			it("should not be fetched from the server again", async () => {
				fakeAxios.onGet(url).reply(200, [{ id: 1 }]);

				await store.dispatch(loadBugs());
				await store.dispatch(loadBugs());

				expect(fakeAxios.history.get.length).toBe(1);
			});
		});
		describe("if the bugs don't exists in the cache", () => {
			it("should be fetched from the server and put in the store", async () => {
				fakeAxios.onGet(url).reply(200, [{ id: 1 }]);

				await store.dispatch(loadBugs());

				expect(bugsSlice().list).toHaveLength(1);
			});

			describe("loading indicator", () => {
				it("should be true while fetching the bug", () => {
					fakeAxios.onGet(url).reply(() => {
						expect(bugsSlice().loading).toBe(true);
						return [200, [{ id: 1 }]];
					});

					store.dispatch(loadBugs());
				});

				it("should be false after the bugs are fetched", async () => {
					fakeAxios.onGet(url).reply(200, [{ id: 1 }]);

					await store.dispatch(loadBugs());

					expect(bugsSlice().loading).toBe(false);
				});

				it("should be false if the server returns an error", async () => {
					fakeAxios.onGet(url).reply(500);

					await store.dispatch(loadBugs());

					expect(bugsSlice().loading).toBe(false);
				});
			});
		});
	});

	describe("selectors", () => {
		it("getUnresolvedBugs", () => {
			const state = createState();
			state.entities.bugs.list = [
				{ id: 1, resolved: true },
				{ id: 2 },
				{ id: 3 },
			];

			const result = getUnresolvedBugs(state);

			expect(result).toHaveLength(2);
		});
	});
});

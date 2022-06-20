import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUnresolvedBugs, loadBugs, resolveBug } from "../store/bugs";

const BugsList = () => {
	const dispatch = useDispatch();
	const bugs = useSelector(getUnresolvedBugs);
	// const bugs = useSelector((state) => state.entities.bugs.list);

	useEffect(() => {
		dispatch(loadBugs());
	}, [dispatch]);

	return (
		<ul>
			{bugs.map(({ id, description }) => (
				<li key={id}>
					{description}{" "}
					<button onClick={() => dispatch(resolveBug(id))}>Resolve</button>
				</li>
			))}
		</ul>
	);
};

export default BugsList;

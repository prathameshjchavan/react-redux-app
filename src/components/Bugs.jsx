import { Component } from "react";
import { getUnresolvedBugs, loadBugs, resolveBug } from "../store/bugs";
import { connect } from "react-redux";

class Bugs extends Component {
	componentDidMount() {
		this.props.loadBugs();
	}

	render() {
		return (
			<ul>
				{this.props.bugs.map(({ id, description }) => (
					<li key={id}>
						{description}{" "}
						<button onClick={() => this.props.resolveBug(id)}>Resolve</button>
					</li>
				))}
			</ul>
		);
	}
}

const mapStateToProps = (state) => ({
	bugs: getUnresolvedBugs(state),
});

const mapDispatchToProps = (dispatch) => ({
	resolveBug: (id) => dispatch(resolveBug(id)),
	loadBugs: () => dispatch(loadBugs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bugs);

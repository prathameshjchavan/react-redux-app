import { Component } from "react";
import { loadBugs } from "../store/bugs";
import { connect } from "react-redux";

class Bugs extends Component {
	componentDidMount() {
		this.props.loadBugs();
	}

	render() {
		return (
			<ul>
				{this.props.bugs.map(({ id, description }) => (
					<li key={id}>{description}</li>
				))}
			</ul>
		);
	}
}

const mapStateToProps = (state) => ({
	bugs: state.entities.bugs.list,
});

const mapDispatchToProps = (dispatch) => ({
	loadBugs: () => dispatch(loadBugs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bugs);

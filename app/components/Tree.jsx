import React from 'react';
import Branch from './Branch.jsx';
import TreeSimulator from '../lib/TreeSimulator.js';
import { Vector3 } from 'three';
import R from 'ramda';

class Tree extends React.Component {

  static propTypes = {
    context: React.PropTypes.object,
    origin: React.PropTypes.object,
    color: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      tree: null,
    };
  }

  componentDidMount() {
    const treeSimulator = new TreeSimulator({
      depth: 8,
      origin: this.props.origin,
      onUpdate: (tree) => {
        this.props.onUpdate();
        return this.setState({ tree });
      },
    });
  }

  getBranches(branch) {
    let branches = [branch];
    if ( branch.branches ) {
      // const subBranches = branch.branches.map( b => this.getBranches(b) );
      // branches = branches.concat(subBranches);
      const subBranches = R.chain(
        (b) => this.getBranches(b)
      )(branch.branches);

      branches = branches.concat(subBranches);
    }
    return branches;
  }

  render() {
    const { context } = this.props;
    const { tree } = this.state;
    const trunk = tree;
    if ( !trunk ) return null;
    const branchColor = 'brown';
    const branches = this.getBranches(trunk);

    const renderedBranches = branches.map( (branch, i) => (
        <Branch
          key={i}
          start={branch.start}
          end={branch.end}
          color={branchColor}
          context={context}
        />
    ));
    return (<span>{renderedBranches}</span>);
  }
}

export default Tree;

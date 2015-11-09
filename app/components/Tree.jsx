import React from 'react';
import TreeSimulator from '../lib/TreeSimulator.js';
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
      depth: 11,
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
    const branches = this.getBranches(trunk);

    context.strokeStyle = 'yellow';
    context.beginPath();
    branches.map( (branch) => {
      context.moveTo( branch.start.x, branch.start.y );
      context.lineTo( branch.end.x, branch.end.y );
    });
    context.stroke();
    context.closePath();

    return null;
  }
}

export default Tree;

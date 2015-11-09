import React from 'react';
import ReactDOM from 'react-dom';
import Tree from './Tree.jsx';
import { Vector3 } from 'three';

class Forest extends React.Component {

  static propTypes = {
    dimensions: React.PropTypes.object,
    background: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      context: null,
    };
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    const context = canvas.getContext('2d');
    this.setState({ canvas, context });
  }

  onUpdate() {
    this.clearCanvas();
  }

  clearCanvas() {
    const { dimensions: { width, height } } = this.props;
    this.state.context.clearRect(0, 0, width, height);
  }

  renderTree(width, height) {
    const origin = new Vector3( width / 2, height );
    return (<Tree
      origin={origin}
      context={this.state.context}
      onUpdate={this.onUpdate.bind(this)}
      />
    );
  }

  render() {
    const { background, dimensions: { width, height } } = this.props;
    return (
      <div>
        <canvas ref='canvas'
          width={width}
          height={height}
          style={{backgroundColor: background}}
        />
        {this.renderTree(width, height)}
      </div>
    );
  }
}

export default Forest;

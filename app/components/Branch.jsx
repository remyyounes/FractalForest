import React from 'react';

class Branch extends React.Component {

  static propTypes = {
    context: React.PropTypes.object,
    color: React.PropTypes.string,
    start: React.PropTypes.object,
    end: React.PropTypes.object,
    branches: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { context, start, end, color } = this.props;
    context.strokeStyle = color || 'yellow';
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    context.closePath();
    return null;
  }
}

export default Branch;

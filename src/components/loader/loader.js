import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './loader.styl';

class Loader extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    color: PropTypes.string,
    kind: PropTypes.oneOf(['default', 'small'])
  }

  static defaultProps = {
    size: 48,
    strokeWidth: 4,
    color: '#ccc',
    kind: 'default'
  }

  render() {
    const {
      size,
      strokeWidth,
      color,
      kind
    } = this.props;

    return (
      <div className={`loader loader_${kind}`} style={{ width: size, height: size }}>
        <svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) - (strokeWidth / 2)}
            strokeWidth={strokeWidth}
            stroke={color}
          />
        </svg>
      </div>
    );
  }
}

export default Loader;

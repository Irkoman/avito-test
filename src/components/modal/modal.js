import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './modal.styl';

const ESC_CODE = 27;

class Modal extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isShown: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
    document.addEventListener('keyup', this.handleEsc, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
    document.addEventListener('keyup', this.handleEsc, false);
  }

  handleClick = (e) => {
    if (e.target === this.modal) {
      this.props.onHide();
    }
  };

  handleEsc = (e) => {
    if (e.keyCode === ESC_CODE) {
      e.preventDefault();
      this.props.onHide();
    }
  };

  render() {
    const { children, isShown } = this.props;
    const shownMod = isShown ? 'modal_shown' : '';

    return (
      <div className={`modal ${shownMod}`} ref={node => this.modal = node}>
        <div className="modal__content">
          <button className="modal__close" onClick={this.props.onHide}>Закрыть</button>
          {children}
        </div>
      </div>
    );
  }
}

export default Modal;

import React from 'react';
import PropTypes from 'prop-types';

export default class AccordionSection extends React.Component {
    static propTypes = {
      children: PropTypes.instanceOf(Object).isRequired,
      isOpen: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        this.props.onClick(this.props.label);
    };

    render() {
        const {
          onClick,
          props: { isOpen, label },
        } = this;
    
        return (
          <div
            style={{
              background: isOpen ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              padding: '5px 10px',
            }}
          >
            <div onClick={onClick} style={{ cursor: 'pointer' }}>
              {label}
              <div style={{ float: 'right' }}>
                {!isOpen && <span>&#9650;</span>}
                {isOpen && <span>&#9660;</span>}
              </div>
            </div>
            {isOpen && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  marginTop: 10,
                  padding: '10px 20px',
                }}
              >
                {this.props.children}
              </div>
            )}
          </div>
        );
      }
}
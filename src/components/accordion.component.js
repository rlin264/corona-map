import React from "react";
import PropTypes from "prop-types";

import AccordionSection from "./accordionSection.component";

export default class Accordion extends React.Component {
    static propTypes = {
        children: PropTypes.instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);

        const openSections = {};

        this.state = { openSections };
    }

    onClick = label => {
        const {
            state: { openSections }
        } = this;

        const isOpen = !!openSections[label];

        this.setState({
            openSections: {
                [label]: !isOpen
            }
        });
    };

    render() {
        const {
            onClick,
            props: { children },
            state: { openSections }
        } = this;

        return (
            <div className={this.props.className} id={this.props.id}>
                {children.map(child => (
                    <AccordionSection
                        isOpen={!!openSections[child.props.label]}
                        label={child.props.label}
                        onClick={onClick}
                        key={child.props.label}
                    >
                        {child.props.children}
                    </AccordionSection>
                ))}
            </div>
        );
    }
}

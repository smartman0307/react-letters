import PropTypes from 'prop-types';
import React from 'react';

class CreateComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        };
        this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
    }
    handleCommentUpdate(event) {
        this.setState({
            comment: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const { postId, handleSubmit } = this.props;
        console.log('Submitting');
        console.log(event.target);
        handleSubmit(postId);
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="create-comment">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    onChange={this.handleCommentUpdate}
                    className="create-comment"
                />
            </form>
        );
    }
}

CreateComment.propTypes = {
    postId: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired
};

export default CreateComment;

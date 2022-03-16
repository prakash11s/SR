import React from "react";
import axios from '../../util/Api';
import { Button, Input, Card, Modal, ModalHeader, ModalBody, CardText } from 'reactstrap';
import IntlMessages from '../../util/IntlMessages';
import { Scrollbars } from 'react-custom-scrollbars';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { setCallQueueComments } from '../../actions/Actions/callQueueListActions';
import "./CallQueueCommentPopUp.scss";

import {
  ICommentPopUpProps,
  IcallQueueState,
  ICommentPopUpState,
  IdataObj
} from './Interface/IndexInterface';

class CommentPopUp extends React.Component<ICommentPopUpProps, ICommentPopUpState> {
  constructor(props: ICommentPopUpProps) {
    super(props);

    this.state = {
      comment: '',
      comments: [],
      postingComment: false,
      commentError: false,
      commentErrorMsg : ""
    };
  }


  componentDidUpdate(prevProps: ICommentPopUpProps) {
    if (JSON.stringify(prevProps.commentsList) !== JSON.stringify(this.props.commentsList)) {
      this.setState({
        comments: this.props.commentsList
      })
    }   
  }


  submitComment = () => {
    this.setState({ postingComment: true })
    axios.post(`/call-queues/entries/${this.props.id}/comments`, {
      description: this.state.comment
    })
      .then((response) => {
        if (response.data) {
          let getComments = [...this.state.comments]
          getComments = getComments.concat(response.data.data);
          this.setState({ comment: '', comments: getComments, postingComment: false });
          const indexId = this.props.callQueueListData.data.findIndex((element) => element.id === this.props.id);
          const callQueueItems = this.props.callQueueListData.data;
          callQueueItems[indexId].comments = getComments;
          this.props.setCallQueueComments(callQueueItems);
          if(getComments){
            this.setState({
              ...this.state,
              commentError: false,
              commentErrorMsg: ""
            })
          }          
        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          this.setState({
            ...this.state,
            commentError: true,
            commentErrorMsg: error.response.data.errors.description
          })
        this.setState({ postingComment: false })
        }    
      }).finally(() => {
      })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ comment: event.currentTarget.value })
  }

  handlePopUpClose = () => {
    const id = this.props.id;
    this.setState({ comment: '' });
    this.props.onConfirm(id, this.state.comments.length);
  }

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.which === 13 || event.keyCode === 13) {
      event.preventDefault();
      this.submitComment();
    }
  };

  render() {

    const { show } = this.props;
    // @ts-ignore
    return (
      <div>

        <Modal isOpen={show}
          toggle={this.handlePopUpClose}
          className="modal-align"
        >
          <ModalHeader toggle={this.handlePopUpClose}><IntlMessages id="orderOverview.Comments" /></ModalHeader>
          <ModalBody>
            <div className="CallQueueCommentPopUp">
              <Scrollbars
                style={{ maxHeight: 350, minHeight: 250 }}             
              >
                {
                  this.state.comments.map((comment) =>
                    <Card className="CallQueueCommentPopUp-card" key={comment.id} body inverse >

                      <CardText>

                        <div className="d-flex justify-content-between">
                          {comment.agent ? <div>{comment.agent.name}</div> : null}
                          <div className="mr-3 date-color" ><Moment fromNow>{comment.created_at}</Moment></div>
                        </div>
                        <div className="text-left mt-1">
                          {comment.description ? comment.description : comment.comment}
                        </div>


                      </CardText>
                    </Card>
                  )
                }
              </Scrollbars>

              <div className="mt-5 d-flex justify-content-between" >
                <Input type="textarea" name="comment"
                  id="comment"
                  onChange={this.handleChange}
                  value={this.state.comment}
                  key="inputText"
                  className={`comment-box-design ${this.state.commentError ? "is-invalid" : ""}`}
                  onKeyDown={this.handleKeyPress}
                />
                <Button
                  className="comment-button-design"
                  id="commentButton"
                  disabled={this.state.postingComment}
                  color="primary mt-3"
                  onClick={this.submitComment}
                ><IntlMessages id="comments.table.createTitle" /></Button>
 
              </div>
              <div style={{color: 'red'}}>{this.state.commentError ? this.state.commentErrorMsg : ''}</div>
            </div>
          </ModalBody>
        </Modal>
      </div>

    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setCallQueueComments: (callQueueItems: IdataObj[]) => dispatch(setCallQueueComments(callQueueItems))
  }
};

const mapStateToProps = ({ callQueueState }: IcallQueueState) => ({
  callQueueListData: callQueueState.callQueueListData,
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentPopUp);

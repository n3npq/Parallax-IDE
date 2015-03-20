'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');

const styles = require('../styles');

class DeleteFileOverlay extends React.Component {
  constructor(){
    this.state = {
      value: ''
    };

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onAccept(evt){
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.props.filename, evt);
    }
  }

  onCancel(evt){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  render(){
    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>Are you you want to delete {this.props.filename}?</h3>
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this.onAccept}>Yes</Button>
          <Button onClick={this.onCancel}>No</Button>
        </div>
      </Card>
    );
  }
}

module.exports = DeleteFileOverlay;
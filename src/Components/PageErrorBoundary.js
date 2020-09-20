import React, { Component } from "react";

//For Displaying the error if application Crashes
class PageErrorBoundary extends Component {
  static getDerivedStateFromError(err) {
    return {
      isCrashed: true
    };
  }

  state = {
    isCrashed: false
  };

  componentDidCatch(error, errorInfo) {
    //send error to an error tracking service in real time
    console.log(error, errorInfo);
  }

  render() {
    const { children } = this.props;

    if (!this.state.isCrashed) {
      return children;
    }
    return <h1 className="my-5 text-center"> Something went wrong here</h1>;
  }
}

export default PageErrorBoundary;

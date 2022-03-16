import {Component} from 'react'
import {withRouter} from 'react-router-dom'
interface IScrollToTopProps {
  location:any
}
class ScrollToTop extends Component<IScrollToTopProps> {
  componentDidUpdate(prevProps:any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop as any)

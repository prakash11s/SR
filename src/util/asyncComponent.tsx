import React, {Component} from 'react';
import Nprogress from 'nprogress';
import ReactPlaceholder from 'react-placeholder';
import 'nprogress/nprogress.css';
import 'react-placeholder/lib/reactPlaceholder.css';
import CircularProgress from "../components/CircularProgress/index";

interface IAsyncComponentProps {

}
interface IAsyncComponentVariable {
  mounted:boolean
}

interface IAsyncComponentState {
  component:any
}

export default function asyncComponent(importComponent:any) {
  class AsyncFunc extends Component<IAsyncComponentProps,IAsyncComponentState>{
    private mounted:any = null
    constructor(props:any) {
      super(props);
      this.state = {
        component: null
      };

    }

    componentWillMount() {
      Nprogress.start();
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    async componentDidMount() {
      this.mounted = true;
      const {default: Component} = await importComponent();
      Nprogress.done();
      if (this.mounted) {
        this.setState({
          component: <Component {...this.props} />
        });
      }
    }

    render() {
      const Component = this.state.component ||
        <div className="loader-view"
             style={{height: 'calc(100vh - 200px)'}}>
          <CircularProgress className=""/>
        </div>;
      return (
        <ReactPlaceholder type="text" rows={7} ready={Component !== null}>
          {Component}
        </ReactPlaceholder>
      );
    }
  }

  return AsyncFunc;
}

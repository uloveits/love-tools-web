/** 根路由 **/
import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import P from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import {createBrowserHistory as createHistory} from "history/"; // URL模式的history
import { createHashHistory as createHistory } from "history"; // 锚点模式的history
import { setUserInfo } from "../store/action/auth";
import { setIsMobile } from "../store/action/common";

/** 本页面所需页面级组件 **/
import BasicLayout from "../comps/layout/basic";
import UserLayout from "../comps/layout/user";
/** 普通组件 **/
import { message } from "antd";
import { LOCAL_STORAGE } from "../constants";

message.config({
  // 全局提示只显示一秒
  duration: 2
});

const history = createHistory();
@connect(
  state => ({
    user: state.app.user
  }),
  dispatch => ({
    actions: bindActionCreators({ setUserInfo,setIsMobile }, dispatch)
  })
)
export default class RootContainer extends React.Component {
  static propTypes = {
    dispatch: P.func,
    children: P.any,
    actions: P.any,
    user: P.any
  };

  constructor(props) {
    super(props);
  }
  componentWillMount() {

    this.getClientWidth();
    window.onresize = () => {
      console.log('屏幕变化了');
      this.getClientWidth();
    }
  }
  getClientWidth = () => { // 获取当前浏览器宽度并设置responsive管理响应式
    const clientWidth = window.innerWidth;
    let isMobile =  clientWidth <= 992 ? true:false;
    localStorage.setItem(LOCAL_STORAGE.IS_MOBILE,isMobile.toString());
    this.props.actions.setIsMobile(isMobile.toString());
  };


  /** 跳转到某个路由之前触发 **/
  onEnter(Component, props) {
    /**
     *  有用户信息，说明已登录
     *  没有，则跳转至登录页
     * **/
    if (this.props.user) {
      return <Component {...props} />;
    }
    return <Redirect to="/user/login" />;
  }

  render() {
    return (
      <Router history={history}>
        <Route
          render={props => {
            return (
              <Switch>
                <Route path="/user" component={UserLayout} />
                <Route
                  path="/"
                  render={props => this.onEnter(BasicLayout, props)}
                />
              </Switch>
            );
          }}
        />
      </Router>
    );
  }
}

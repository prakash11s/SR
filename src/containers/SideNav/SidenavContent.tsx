import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import UserHasPermission from "util/Permission";
import CustomScrollbars from "util/CustomScrollbars";
import { Button } from "@material-ui/core";
import appRoutes from "../../routes/appRoutes";
import { connect } from "react-redux";

class SidenavContent extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      CreatedOrder: 0,
      OnHoldOrders: 0,
      AcceptedOrders: 0,
      FinishedOrders: 0,
      CheckOrders: 0,
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const that = this;
    const pathname = `${history.location.pathname}`; // get current path

    const menuLi: any = document.getElementsByClassName("menu");
    for (let i = 0; i < menuLi.length; i++) {
      menuLi[i].onclick = function(event: any) {
        const parentLiEle = that.closest(this, "li");
        if (menuLi[i].classList.contains("menu") && parentLiEle !== null) {
          event.stopPropagation();

          if (menuLi[i].classList.contains("open")) {
            menuLi[i].classList.remove("open", "active");
          } else {
            menuLi[i].classList.add("open", "active");
          }
        } else {
          for (let j = 0; j < menuLi.length; j++) {
            const parentLi = that.closest(this, "li");
            if (
              menuLi[j] !== this &&
              (parentLi === null || !parentLi.classList.contains("open"))
            ) {
              menuLi[j].classList.remove("open");
            } else {
              if (menuLi[j].classList.contains("open")) {
                menuLi[j].classList.remove("open");
              } else {
                menuLi[j].classList.add("open");
              }
            }
          }
        }
      };
    }

    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("open");
      } else {
        this.closest(activeLi, "li").classList.add("open");
      }
    } catch (error) {}
  }

  componentWillReceiveProps(nextProps: any) {
    const { history } = nextProps;
    const pathname = `${history.location.pathname}`; // get current path

    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("open");
      } else {
        this.closest(activeLi, "li").classList.add("open");
      }
    } catch (error) {}
  }

  closest(el: any, selector: any) {
    try {
      let matchesFn: any;
      // find vendor prefix
      [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector",
      ].some(function(fn: any) {
        // @ts-ignore
        if (typeof document.body[fn] === "function") {
          matchesFn = fn;
          return true;
        }
        return false;
      });

      let parent;

      // traverse parents
      while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
          return parent;
        }
        el = parent;
      }
    } catch (e) {}

    return null;
  }

  render() {
    // @ts-ignore
    const sideMenu =
      appRoutes[this.props.match.url.substring(1)] &&
      appRoutes[this.props.match.url.substring(1)].routes.map((route: any) => {
        if (route.id) {
          if (route.child && !route.hideChild) {
            return (
              <li className="menu no-arrow" key={route.path}>
                {route.permission && (
                  <UserHasPermission permission={route.permission}>
                    <Button
                      onClick={(e) => e.preventDefault()}
                      data-cy={route.dataCy}
                    >
                      <i className={`zmdi zmdi-hc-fw ${route.icon}`} />
                      <span className="nav-text">
                        <IntlMessages id={route.id} />
                      </span>
                    </Button>
                  </UserHasPermission>
                )}
                {!route.permission && (
                  <Button
                    onClick={(e) => e.preventDefault()}
                    data-cy={route.dataCy}
                  >
                    <i className={`zmdi zmdi-hc-fw ${route.icon}`} />
                    <span className="nav-text">
                      <IntlMessages id={route.id} />
                    </span>
                  </Button>
                )}

                <ul className="sub-menu">
                  {route.child.map((childRoute: any) => (
                    <>
                      {childRoute.permission && (
                        <UserHasPermission permission={childRoute.permission}>
                          <li key={childRoute.path}>
                            <NavLink
                              className="prepend-icon"
                              to={childRoute.path}
                            >
                              <span className="nav-text">
                                <IntlMessages id={childRoute.id} />
                              </span>
                            </NavLink>
                          </li>
                        </UserHasPermission>
                      )}
                      {!childRoute.permission && (
                        <li key={childRoute.path}>
                          <NavLink
                            className="prepend-icon"
                            to={childRoute.path}
                          >
                            <span className="nav-text">
                              <IntlMessages id={childRoute.id} />
                            </span>
                          </NavLink>
                        </li>
                      )}
                    </>
                  ))}
                </ul>
              </li>
            );
          } else if (route.path === "/support/useful-links") {
            if (localStorage.getItem("department") === "vehicles") {
              return (
                <li className="menu no-arrow" key={route.path}>
                  <NavLink to={route.path}>
                    <i className={`zmdi zmdi-hc-fw ${route.icon}`} />
                    <span className="nav-text">
                      <IntlMessages id={route.id} />{" "}
                    </span>
                  </NavLink>
                </li>
              );
            } else {
              return null;
            }
          } else if (route.permission) {
            return (
              <UserHasPermission permission={route.permission}>
                <li className="menu no-arrow" key={route.path}>
                  <NavLink to={route.path}>
                    <i className={`zmdi zmdi-hc-fw ${route.icon}`} />
                    <span className="nav-text">
                      <IntlMessages id={route.id} />{" "}
                    </span>
                  </NavLink>
                </li>
              </UserHasPermission>
            );
          } else {
            return (
              <li className="menu no-arrow" key={route.path}>
                <NavLink to={route.path}>
                  <i className={`zmdi zmdi-hc-fw ${route.icon}`} />
                  <span className="nav-text">
                    <IntlMessages id={route.id} />{" "}
                  </span>
                </NavLink>
              </li>
            );
          }
        }
      });
    return (
      <CustomScrollbars className="scrollbar">
        <ul className="nav-menu">
          <li className="nav-header">
            <IntlMessages id="sidebar.main" />
          </li>
          {sideMenu}
        </ul>
      </CustomScrollbars>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    authState: state.auth.authUser,
  };
};

export default connect(mapStateToProps, null)(withRouter(SidenavContent));

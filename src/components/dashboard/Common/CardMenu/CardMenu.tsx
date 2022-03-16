import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";


import IntlMessages from "util/IntlMessages";
import UserHasPermission from "../../../../util/Permission";
import { ICardMenuProps, ICardMenuState } from "./Interface/CardMenuInterface";


class CardMenu extends React.Component<ICardMenuProps, ICardMenuState> {
  render() {
    const {
      menuState,
      anchorEl,
      handleRequestClose,
      status,
      popUpHandler,
      handleSearchServiceModal,
      handleCancelOrder,
      handelSendCallBack,
      handleRequestMoveToOnHold,
      editOption,
      style,
      isQueues = false,

      lockListOptions,
      handleLockItemClick
    } = this.props;
    // const optionsAwaitingConfirmation = [
    //   {
    //     id: "orderOptions.cancel-order",
    //     clickMethod: handleCancelOrder,
    //     permission: ORDER_TABLE_CELL_CANCEL_BUTTON
    //   },
    //   {
    //     id: "orderOptions.delete-order",
    //     clickMethod: popUpHandler,
    //     permission: ORDER_TABLE_CELL_DELETE_BUTTON
    //   },
    //   {
    //     id: "orderOptions.send-callback-request",
    //     clickMethod: handleRequestClose
    //   },
    //   {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   },
    //   {
    //     id: "orderOptions.resend-order-confirmation",
    //     clickMethod: handleRequestClose
    //   }
    // ];
    //
    // const optionsOnHold = [
    //   {
    //     id: "orderOptions.send-callback-request",
    //     clickMethod: handleRequestClose
    //   },
    //   {
    //     id: "orderOptions.search-service-point",
    //     clickMethod: handleSearchServiceModal
    //   },
    //   {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   }
    // ];
    //
    // const optionsScheduled = [
    //   {
    //     id: "orderOptions.search-service-point",
    //     clickMethod: handleSearchServiceModal
    //   },
    //   {
    //     id: "orderOptions.move-to-on-hold",
    //     clickMethod: handleRequestClose
    //   }, {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   }]
    //
    // const optionsCompleted = [
    //   {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   },
    // ];
    //
    // const optionsProcessing = [
    //   {
    //     id: "orderOptions.search-service-point",
    //     clickMethod: handleSearchServiceModal
    //   },
    //   {
    //     id: "orderOptions.move-to-on-hold",
    //     clickMethod: handleRequestClose
    //   }, {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   }];
    //
    //
    // const optionsAwaitingCancelled = [
    //   {
    //     id: "orderOptions.open-order",
    //     clickMethod: handleRequestClose
    //   }
    // ];
    //
    // const optionsCallQueueOverview = [
    //   {
    //     id: "callQueueOptions.viewQueue",
    //     clickMethod: (e) => handleRequestClose(e, `call-queues/${this.props.pageId}`),
    //   },
    //   {
    //     id: "callQueueOptions.editQueue",
    //     clickMethod: handleRequestClose
    //   },
    //   {
    //     id: "callQueueOptions.deleteQueue",
    //     clickMethod: handleRequestClose
    //   },
    //   {
    //     id: "callQueueOptions.openQueue",
    //     clickMethod: (e) => handleRequestClose(e, `call-queues/${this.props.pageId}/process`),
    //   }
    // ];

    const optionAwaiting = [
      {
        id: "orderOptions.cancel-order",
        clickMethod: handleCancelOrder,
        permission: "booking-service-support-order-cancel",
      },
      {
        id: "orderOptions.delete-order",
        clickMethod: popUpHandler,
        permission: "booking-service-support-order-delete",
      },
      {
        id: "orderOptions.send-callback-request",
        clickMethod: handelSendCallBack,
        permission: "booking-service-support-order-create-callback-request",
      },
    ];

    const optionHold = [
      {
        id: "orderOptions.send-callback-request",
        clickMethod: handelSendCallBack,
        permission: "booking-service-support-order-create-callback-request",
      },
    ];

    // const optionDraft = [
    //   {
    //     id: "orderOptions.send-coupon",
    //     clickMethod: handleRequestClose,
    //   },
    // ];

    const optionProcessingSchedule = [
      {
        id: "orderOptions.move-to-on-hold",
        clickMethod: handleRequestMoveToOnHold,
        permission: "booking-service-put-order-on-hold",
      },
      {
        id: "orderOptions.send-callback-request",
        clickMethod: handelSendCallBack,
        permission: "booking-service-support-order-create-callback-request",
      },
    ];

    return (

      <Menu
        keepMounted
        anchorReference="anchorPosition"
        anchorPosition={{ left: style.x, top: style.y }}
        open={menuState}
        onClose={handleRequestClose}
        MenuListProps={{
          style: {
            width: "auto",
            paddingTop: 0,
            paddingBottom: 0,

          },
        }}
      >
        {isQueues ? <>
          <MenuItem
            onClick={(e) =>
              handleRequestClose(e, `/support/call-queues/${this.props.pageId}`)
            }
          >
            <IntlMessages id={"callQueueOptions.openQueue"} />
          </MenuItem>
          <MenuItem
            onClick={(e) =>
              handleRequestClose(e, `/support/call-queues/${this.props.pageId}/edit`)
            }
          >
            <IntlMessages id={"callQueueOptions.editQueue"} />
          </MenuItem>
        </>
          : <MenuItem
            onClick={(e) =>
              handleRequestClose(e, `/support/orders/${this.props.pageId}`)
            }
          >
            <IntlMessages id={"orderOptions.open-order"} />
          </MenuItem>}
        {status === "awaiting_confirmation" &&
          optionAwaiting.map((option, index) => (
            <UserHasPermission permission={option.permission}>
              <MenuItem
                key={`awaiting_confirmation_${index}`}
                onClick={option.clickMethod}
              >
                <IntlMessages id={option.id} />
              </MenuItem>
            </UserHasPermission>
          ))}
        {/* {status === "draft" &&
          optionDraft.map((option, index) => (
            <MenuItem key={`draft_${index}`} onClick={option.clickMethod}>
              <IntlMessages id={option.id} />
            </MenuItem>
          ))} */}
        {status === "on_hold" &&
          optionHold.map((option, index) => (
            <UserHasPermission permission={option.permission}>
              <MenuItem key={`on_hold_${index}`} onClick={option.clickMethod}>
                <IntlMessages id={option.id} />
              </MenuItem>
            </UserHasPermission>
          ))}
        {(status === "scheduled" || status === "processing") &&
          optionProcessingSchedule.map((option, index) => (
            <UserHasPermission permission={option.permission}>
              <MenuItem
                key={`scheduled_processing_${index}`}
                onClick={option.clickMethod}
              >
                <IntlMessages id={option.id} />
              </MenuItem>
            </UserHasPermission>
          ))}

        {lockListOptions && lockListOptions.length > 0 && (
          lockListOptions.filter(elm => elm.isHide === false).map((el, i) => (

            <MenuItem
              key={`lock_item_${i}`}
              onClick={(e) => handleLockItemClick(e, { orderId: this.props.pageId, locked: this.props.locked, flag: el.flag })}
            >
              <IntlMessages id={el.id} />
            </MenuItem>
          )
          ))
        }


        {/*{*/}
        {/*status && optionsAwaitingConfirmation.map((option, index) => (*/}
        {/*<RBACContext.Consumer>*/}
        {/*{({ userCan, abilities }:any) => (*/}
        {/*(!option.permission || userCan(abilities, option.permission)) &&*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>*/}
        {/*)}*/}
        {/*</RBACContext.Consumer>*/}
        {/*)*/}
        {/*)}*/}
        {/*{*/}
        {/*status === 'on_hold' && optionsOnHold.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>,*/}
        {/*)}*/}
        {/*{*/}
        {/*status === 'scheduled' && optionsScheduled.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>,*/}
        {/*)}*/}
        {/*{*/}
        {/*status === 'completed' && optionsCompleted.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>,*/}
        {/*)}*/}
        {/*{*/}
        {/*status === 'processing' && optionsProcessing.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>,*/}
        {/*)}*/}
        {/*{*/}
        {/*status === 'cancelled' && optionsAwaitingCancelled.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>,*/}
        {/*)}*/}
        {/*{*/}
        {/*status !== 'completed' && status !== 'cancelled' && editOption &&*/}
        {/*<MenuItem onClick={(e) => handleRequestClose(e, `/support/orders/${this.props.pageId}/edit`)}>*/}
        {/*<IntlMessages id={'orderOptions.edit-order'}></IntlMessages>*/}
        {/*</MenuItem> */}
        {/*}*/}

        {/*{*/}
        {/*!status && optionsCallQueueOverview.map((option, index) =>*/}
        {/*<MenuItem key={index} onClick={option.clickMethod}>*/}
        {/*<IntlMessages id={option.id}></IntlMessages>*/}
        {/*</MenuItem>*/}
        {/*)}*/}
      </Menu>

    );
  }
}

export default CardMenu;

import { Component } from "react";
import Echo from "laravel-echo";

declare const window: any;
class webSocket extends Component {
  static initWebSocket(isPartners = false, userId, token, setUserSocketStatus) {
    window.Pusher = require("pusher-js");
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: isPartners ? "partners" : "support",
      wsHost: process.env.REACT_APP_WEBSOCKET_BASE_URL,
      authEndpoint: process.env.REACT_APP_WEBSOCKET_AUTH_ENDPOINT,
      wssPort: 6001,
      disableStats: true,
      forceTLS: false,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "X-Socket-App": (isPartners ? "partners" : "support")
        },
      },
      // enabledTransports: ["wss"]
    });
    const privateChannel = window.Echo.private(`user.${userId}`);
    privateChannel.subscribed(function(e){
      setUserSocketStatus(1);
    });
    
    window.Echo.connector.pusher.connection.bind('unavailable', () => {
      setUserSocketStatus(0);
    });

    window.Echo.connector.pusher.connection.bind('failed', () => {
      setUserSocketStatus(0);
    });

    window.Echo.connector.pusher.connection.bind('disconnected', () => {
      setUserSocketStatus(0);
    });

    // register to the global channel
    window.Echo.channel(`global`)
        .listen('OrderShipmentStatusUpdated', (response) => {
          console.log(response);
        })
        .listen('OrderHasBeenPlaced', (response) => {
          console.log(response)
        })
  }
}

export default webSocket;
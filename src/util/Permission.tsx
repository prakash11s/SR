import React, { useContext } from "react";
import RBACContext from "../rbac/rbac.context";

type UserHasPermissionProps = {
  permission: string;
  children: React.ReactNode;
};

const UserHasPermission: React.FC<UserHasPermissionProps> = (props: any) => {
  const { userCan, abilities } = useContext<any>(RBACContext);

  if (userCan && !userCan(abilities, props.permission)) {
    if (process.env.PERMISSION_DEBUG) {
      return (
        <div className="alert alert-warning small p-3 m-1">
          Missing the permission: <b>{props.permission}</b>
        </div>
      );
    }
    return <></>;
  }

  return props.children;
};

export default UserHasPermission;

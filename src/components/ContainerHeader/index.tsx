import React from 'react';
import { Chip, Avatar } from '@material-ui/core';

import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import IntlMessages from '../../util/IntlMessages';
import { IContainerHeaderProps, IStatus } from './Interface/IndexInterface';

const getDisplayString = (sub: string):string => {
  return `breadCrumb.${sub}`
};

const getUrlString = (url: string, sub: string, index: number) => {
  if (index === 0) {
    return '/';
  }
  return '/' + url.split(sub)[0] + sub;
};

const ContainerHeader = ({ title, match, statuses, toggleSelectedFilters, selectedFilters, textId, children }: IContainerHeaderProps) => {
  const path = match.url.substr(1);
  const subPath = path.split('/');
  const statusList = statuses && statuses.map((status: IStatus) => <Chip avatar={<Avatar style={{ width: "32px" }}>{status.orders_count}</Avatar>} size="medium" onClick={() => toggleSelectedFilters && toggleSelectedFilters(status.id)} className="cursor-pointer mx-2" color="primary" variant={(selectedFilters && selectedFilters.includes(status.id)) ? 'default' : 'outlined'} label={<IntlMessages id={`orderStatus.${status.name}`} />} />);
  return (
    <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center d-flex">
      <h2 className="title mb-3 mb-sm-0">{title}</h2>
      <div>{statusList}</div>
      <div className="d-flex align-items-center">
        {children}
        <Breadcrumb className="mb-0" tag="nav">
          {subPath.map((sub: string, index: number) => {
            return <BreadcrumbItem active={subPath.length === index + 1}
              tag={subPath.length === index + 1 ? "span" : "a"} key={index}
              href={getUrlString(path, sub, index)}><IntlMessages id={textId && index === (subPath.length - 1) ? textId : getDisplayString(sub)} /></BreadcrumbItem>
          }
          )}
        </Breadcrumb>
      </div>
    </div>
  )
};

export default ContainerHeader;

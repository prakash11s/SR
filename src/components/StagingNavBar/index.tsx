import React from 'react';

const StagingNavBar = () => {

  return (
    <div className="StagingNavBar">
      {process.env.NODE_ENV === 'production' ? '' : process.env.NODE_ENV}
    </div>
  )
};
export default StagingNavBar;
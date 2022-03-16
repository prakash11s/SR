import React from 'react';
import ContainerHeader from 'components/ContainerHeader/index';
import IntlMessages from 'util/IntlMessages';


const EditReview: React.FC<any> = (props) => {

	return (
		<div>
			<ContainerHeader title={<IntlMessages id="breadCrumbBar.reviews"/>} match={props.match}/>

			<h5>EDIT REVIEW</h5>

		</div>
	);
}

export default EditReview;

import React, {useState} from 'react';
import SweetAlert from "react-bootstrap-sweetalert";
import TextField from '@material-ui/core/TextField';

import {ICreateCredentialPromptProps} from './Interface/createCredentialPromptInterface';

const CreateCredentialPrompt: React.FC<ICreateCredentialPromptProps> = (props) => {

	const [inputExtension, setInputExtension] = useState<string>('');
	const [inputPassword, setInputPassword] = useState<string>('');

	const {show, title, ...rest} = props

	const onSubmit = () => {
		props.onConfirm(inputExtension, inputPassword);
		setInputExtension('');
		setInputPassword('');
	}

	return (
		<SweetAlert
			show={show}
			{...rest}
			cancelBtnBsStyle="default"
			title={title}
			onConfirm={onSubmit}
			onCancel={props.onCancel}
		>
			<div className="mx-5 mt-4">
				<form className="row" noValidate autoComplete="off">
					<div className="col-12">
						<TextField
							label="Extension"
							margin="normal"
							fullWidth
							value={inputExtension}
							type="number"
							name="extension"
							id="extension"
							onChange={(e) => setInputExtension(e.target.value)}
						/>
					</div>
					<div className="col-12">
						<TextField
							label="Password"
							margin="normal"
							fullWidth
							value={inputPassword}
							type="password"
							name="password"
							id="password"
							onChange={(e) => setInputPassword(e.target.value)}
						/>
					</div>
				</form>
			</div>
		</SweetAlert>
	)
}

export default CreateCredentialPrompt;

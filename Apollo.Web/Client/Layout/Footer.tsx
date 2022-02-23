import { observer } from 'mobx-react-lite';
import * as React from 'react';

const version = '#{Octopus.Release.Number}';

export const Footer = observer(() =>
	<footer>
		<span>Вы работаете с Alteriko {version}</span>
	</footer>);
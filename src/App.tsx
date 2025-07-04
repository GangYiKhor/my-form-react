import ABasicInputs from './components/ABasicInputs';
import BSelectInputs from './components/BSelectInputs';
import CTextAreaInput from './components/CTextAreaInput';
import DSubForm from './components/DSubForm';
import EManualUpdate from './components/EManualUpdate';
import FValidators from './components/FValidators';
import GDisplayOnlyField from './components/GDisplayOnlyField';
import HFormTheme from './components/HFormTheme';
import ICustomComponent from './components/ICustomComponent';
import './index.css';

function App() {
	return (
		<div className="wrapper">
			<h1>My Form React Testing Page</h1>
			<ABasicInputs />
			<BSelectInputs />
			<CTextAreaInput />
			<DSubForm />
			<EManualUpdate />
			<FValidators />
			<GDisplayOnlyField />
			<HFormTheme />
			<ICustomComponent />
		</div>
	);
}

export default App;

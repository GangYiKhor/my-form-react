import ABasicInputs from './components/ABasicInputs';
import BSelectInputs from './components/BSelectInputs';
import CDateRangeInput from './components/CDateRangeInput';
import './index.css';

function App() {
	return (
		<div className="wrapper">
			<h1>My Form React Testing Page</h1>
			<ABasicInputs />
			<BSelectInputs />
			<CDateRangeInput />
		</div>
	);
}

export default App;

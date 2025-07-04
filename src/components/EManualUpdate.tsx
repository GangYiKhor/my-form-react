import { MyForm, MyLabel, MyNumberInput, MyTextInput, useMyForm } from '../../lib/main';

type FormType = {
	name: string;
	age: number;
};

export default function EManualUpdate() {
	const form = useMyForm<FormType>('manual_input');
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (typeof data === 'string') return data;
		return JSON.stringify(data);
	}

	function setName() {
		form.updateField({ name: 'name', value: 'John Doe!' });
	}

	function randomiseAge() {
		form.updateField({ name: 'age', value: Math.floor(Math.random() * 100) });
	}

	function invalidateAge() {
		form.validateField('age', false);
	}

	function initialiseNameAndAge() {
		form.initialiseForm({
			name: 'John Doe',
			age: 37,
		});
	}

	return (
		<div className="demo-container">
			<h2>Manual Input</h2>
			<MyForm<FormType> formId={form.formId}>
				<div className="grid-inputs-2">
					<MyLabel for="manual-name">Parent Text:</MyLabel>
					<MyTextInput id="manual-name" name="name" />

					<MyLabel for="manual-age">Parent Text:</MyLabel>
					<MyNumberInput id="manual-age" name="age" />
				</div>

				<div className="buttons">
					<button type="button" onClick={initialiseNameAndAge} className="btn">
						Initialise Name and Age
					</button>

					<button type="button" onClick={setName} className="btn">
						Set name to John Doe
					</button>

					<button type="button" onClick={randomiseAge} className="btn">
						Randomise age
					</button>

					<button type="button" onClick={invalidateAge} className="btn">
						Set age to invalid
					</button>

					<button type="button" onClick={() => form.resetForm()} className="btn">
						Clear
					</button>
				</div>

				<h3>Form's Data</h3>
				<table className="table-data">
					<thead>
						<tr>
							{Object.keys(formData).map((field) => (
								<th key={field}>{field}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.values(formData).map((value, index) => (
								<td key={index}>{formatter(value)}</td>
							))}
						</tr>
					</tbody>
				</table>
			</MyForm>
		</div>
	);
}

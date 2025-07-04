import {
	MyDateRangeInput,
	MyForm,
	MyLabel,
	MyNumberInput,
	MySimpleComboBoxInput,
	MyTextInput,
	useMyForm,
	type MyDateRangeType,
} from '../../lib/main';

type FormType = {
	name: string;
	age: number;
	class: { id: number; name: string };
	period: MyDateRangeType;
};

const SELECTIONS = [
	{ label: 'A Class', value: { id: 1, name: 'A' } },
	{ label: 'B Class', value: { id: 2, name: 'B' } },
	{ label: 'C Class', value: { id: 3, name: 'C' } },
	{ label: 'D Class', value: { id: 4, name: 'D' } },
];

export default function GDisplayOnlyField() {
	const form = useMyForm<FormType>('display_input');
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (typeof data === 'string') return data;
		return JSON.stringify(data);
	}

	function fetchData() {
		form.initialiseForm({
			name: 'John Doe',
			age: 37,
			class: { id: 2, name: 'B' },
			period: { start: new Date('2025-05-01'), end: new Date('2025-05-31') },
		});
	}

	return (
		<div className="demo-container">
			<h2>Input as Display</h2>
			<MyForm<FormType> formId={form.formId}>
				<div className="grid-inputs-2">
					<MyLabel for="display-name">Name:</MyLabel>
					<MyTextInput id="display-name" name="name" disabled />

					<MyLabel for="display-age">Age:</MyLabel>
					<MyNumberInput id="display-age" name="age" disabled />

					<MyLabel for="display-class">Class:</MyLabel>
					<MySimpleComboBoxInput id="display-class" name="class" options={SELECTIONS} disabled />

					<MyLabel for="display-period">Period:</MyLabel>
					<MyDateRangeInput id="display-period" name="period" disabled />
				</div>

				<div className="buttons">
					<button type="button" onClick={fetchData} className="btn">
						Fetch Data
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

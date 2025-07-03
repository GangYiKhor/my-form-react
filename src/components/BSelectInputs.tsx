import { useState } from 'react';
import {
	MyColumnComboBoxInput,
	MyComboBoxInput,
	MyForm,
	MyLabel,
	MyMultiComboBoxInput,
	MySelectInput,
	MySimpleComboBoxInput,
	useMyForm,
} from '../../lib/main';

type FormType = {
	select: { value_a: string; value_b: string };
	simple_combobox: { value_a: string; value_b: string };
	combobox: { value_a: string; value_b: string };
	columncombobox: { value_a: string; value_b: string };
	multi_combobox: { value_a: string; value_b: string }[];
};

const SELECT_OPTIONS = [
	{ value_a: 'First', value_b: 'ONE' },
	{ value_a: 'John', value_b: 'Doe' },
	{ value_a: 'My', value_b: 'Form' },
	{ value_a: 'Lorem', value_b: 'Ipsum' },
];

const SELECT_OPTIONS_LABELLED = [
	{ label: 'First__ONE', value: { value_a: 'First', value_b: 'ONE' } },
	{ label: 'John__Doe', value: { value_a: 'John', value_b: 'Doe' } },
	{ label: 'My__Form', value: { value_a: 'My', value_b: 'Form' } },
	{ label: 'Lorem__Ipsum', value: { value_a: 'Lorem', value_b: 'Ipsum' } },
];

export default function BSelectInputs() {
	const form = useMyForm<FormType>('select_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (!data) return '';
		if (typeof data === 'string') return data;
		if (typeof data === 'number') return data;
		return JSON.stringify(data);
	}

	return (
		<div className="demo-container">
			<h2>Select Inputs and Combo Boxes</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-2">
					<MyLabel htmlFor="select-input">Select:</MyLabel>
					<MySelectInput id="select-input" name="select" options={SELECT_OPTIONS_LABELLED} />

					<MyLabel htmlFor="simplecombobox-input">Simple Combo Box:</MyLabel>
					<MySimpleComboBoxInput id="simplecombobox-input" name="simple_combobox" options={SELECT_OPTIONS_LABELLED} />

					<MyLabel htmlFor="combobox-input">Combo Box:</MyLabel>
					<MyComboBoxInput
						id="combobox-input"
						name="combobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						optionElement={(value) => <strong>{value.value_a}</strong>}
					/>

					<MyLabel htmlFor="combobox-input">Combo Box (Filter on Type):</MyLabel>
					<MyComboBoxInput
						id="combobox-input"
						name="combobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						optionElement={(value) => value.value_a}
						filterOnType
					/>

					<MyLabel htmlFor="columncombobox-input">Combo Box with Columns:</MyLabel>
					<MyColumnComboBoxInput
						id="combobox-input"
						name="columncombobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						columns={['value_a', (value) => value.value_b]}
					/>

					<MyLabel htmlFor="columncombobox-input">Multiselect Combo Box:</MyLabel>
					<MyMultiComboBoxInput
						id="combobox-input"
						name="multi_combobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						optionElement={(value) => <i>{value.value_a}</i>}
					/>
				</div>

				<div className="buttons">
					<button type="submit" className="btn">
						Submit
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

				<h3>Submitted Data</h3>
				<table className="table-data">
					<thead>
						<tr>
							{Object.keys(data).map((field) => (
								<th key={field}>{field}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.values(data).map((value, index) => (
								<td key={index}>{formatter(value)}</td>
							))}
						</tr>
					</tbody>
				</table>
			</MyForm>
		</div>
	);
}

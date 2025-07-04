import { useState } from 'react';
import { MyForm, MyLabel, MyNumberInput, MySubForm, MyTextInput, useMyForm } from '../../lib/main';

type FormType = {
	text: string;
	children: {
		child_text: string;
		child_number: number;
	};
};

export default function DSubForm() {
	const form = useMyForm<FormType>('subform_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (typeof data === 'string') return data;
		return JSON.stringify(data);
	}

	return (
		<div className="demo-container">
			<h2>Sub Forms</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-2">
					<MyLabel for="parent-text">Parent Text:</MyLabel>
					<MyTextInput id="parent-text" name="text" />
					<div></div>
					<div></div>

					<MySubForm subFormId="children">
						<MyLabel for="child-text">Child Text:</MyLabel>
						<MyTextInput id="child-text" name="child_text" />
						<MyLabel for="child-number">Child Number:</MyLabel>
						<MyNumberInput id="child-number" name="child_number" />
					</MySubForm>
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

import { useState } from 'react';
import { MyForm, MyTextAreaInput, useMyForm } from '../../lib/main';

type FormType = {
	textarea: string;
};

export default function CTextAreaInput() {
	const form = useMyForm<FormType>('text_area_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		return data;
	}

	return (
		<div className="demo-container">
			<h2>Text Area</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs">
					<MyTextAreaInput id="textarea-input" name="textarea" fillRight showGrid />
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

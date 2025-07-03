import { useState } from 'react';
import { MyDateRangeInput, MyForm, useMyForm } from '../../lib/main';

type FormType = {
	daterange: { value_a: string; value_b: string };
};

export default function CDateRangeInput() {
	const form = useMyForm<FormType>('date_range_input');
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
			<h2>Date Range Input</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-2">
					<MyDateRangeInput
						id="date-range-input"
						name="daterange"
						min={new Date('2015-05-15')}
						max={new Date('2035-05-15')}
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

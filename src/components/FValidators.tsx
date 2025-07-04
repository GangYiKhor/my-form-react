import { useState } from 'react';
import {
	MyDateInput,
	MyForm,
	MyLabel,
	MyNumberInput,
	MyTextInput,
	MyTimeInput,
	useMyForm,
	type MyTimeType,
} from '../../lib/main';

type FormType = {
	name: string;
	age: number;
	date: Date;
	time: MyTimeType;
};

export default function FValidators() {
	const form = useMyForm<FormType>('validator_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (typeof data === 'string') return data;
		return JSON.stringify(data);
	}

	return (
		<div className="demo-container">
			<h2>Input Validations</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs">
					<MyLabel for="validator-name">Name (Must not contain %, with invalid message):</MyLabel>
					<MyTextInput
						id="validator-name"
						name="name"
						validator={(data) => (data.includes('%') ? 'Must not contain %' : true)}
					/>

					<MyLabel for="validator-age">Age (Older than 25 + Validate immediately):</MyLabel>
					<MyNumberInput id="validator-age" name="age" validator={(data) => !data || data > 25} validateImmediately />

					<MyLabel for="validator-date">Date (After 2025):</MyLabel>
					<MyDateInput id="validator-date" name="date" validator={(data) => !data || data >= new Date('2025-01-01')} />

					<MyLabel for="validator-time">Time (Before 20H):</MyLabel>
					<MyTimeInput id="validator-time" name="time" validator={(data) => !data || data?.hour < 20} />
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

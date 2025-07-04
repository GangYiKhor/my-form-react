import { useEffect, useState } from 'react';
import { MyForm, MyLabel, useMyForm, useMyInput } from '../../lib/main';

type FormType = {
	custom: string;
};

function CustomNumberInput({ id, name }: { id: string; name: string }) {
	const field = useMyInput(name);

	const CHOICES = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'];

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		field.updateField({ value: CHOICES[parseInt(e.currentTarget.value)] });
	}

	useEffect(() => {
		field.setFieldProperties({ defaultValue: 0, required: false, validator: (value) => value <= 10 });
		return () => {
			field.deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	return <input ref={field.ref} id={id} onChange={onChange} min={0} max={10} />;
}

export default function ICustomComponent() {
	const form = useMyForm<FormType>('custom_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	return (
		<div className="demo-container">
			<h2>Custom Input</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-2">
					<MyLabel for="custom-number-parser">Custom Number Parser:</MyLabel>
					<CustomNumberInput id="custom-number-parser" name="custom" />
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
								<td key={index}>{value}</td>
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
								<td key={index}>{value}</td>
							))}
						</tr>
					</tbody>
				</table>
			</MyForm>
		</div>
	);
}

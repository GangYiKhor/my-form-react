import { useState } from 'react';
import {
	MyCheckboxInput,
	MyColourInput,
	MyDateInput,
	MyDateTimeInput,
	MyFileInput,
	MyForm,
	MyLabel,
	MyMonthInput,
	MyNumberInput,
	MyPasswordInput,
	MyPositiveNumberInput,
	MyRadioInput,
	MyRangeInput,
	MyTextInput,
	MyTimeInput,
	MyWeekInput,
	useMyForm,
	type ColourType,
	type TimeType,
	type WeekType,
} from '../../lib/main';
import { dateFormatter } from '../../lib/MyForm/components/utils';

type FormType = {
	text: string;
	email: string;
	tel: string;
	time: TimeType;
	week: WeekType;
	colour: ColourType;
	date: Date;
	datetime: Date;
	month: Date;
	number: number;
	positive: number;
	password: string;
	range: number;
	radio: number;
	checkbox: number;
	file: File[];
};

export default function ABasicInputs() {
	const form = useMyForm<FormType>('basic_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (!data) return '';
		if (typeof data === 'string') return data;
		if (typeof data === 'number') return data;
		if (data instanceof Date) return dateFormatter(data, 'yyyy-MM-dd hh:mm:ss a');
		if (Array.isArray(data) && data[0] instanceof File) return data.map((file) => file.name).join(', ');
		return JSON.stringify(data);
	}

	return (
		<div className="demo-container">
			<h2>Basic Inputs</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-4">
					<MyLabel htmlFor="text-input" required>
						Text:
					</MyLabel>
					<MyTextInput id="text-input" name="text" type="text" required />

					<MyLabel htmlFor="email-input">Email:</MyLabel>
					<MyTextInput id="email-input" name="email" type="email" />

					<MyLabel htmlFor="tel-input">Tel:</MyLabel>
					<MyTextInput id="tel-input" name="tel" type="tel" pattern="(011-[0-9]{8}|01[02-9]-[0-9]{7})" />

					<MyLabel htmlFor="time-input">Time:</MyLabel>
					<MyTimeInput id="time-input" name="time" />

					<MyLabel htmlFor="week-input">Week:</MyLabel>
					<MyWeekInput id="week-input" name="week" />

					<MyLabel htmlFor="colour-input">Colour:</MyLabel>
					<MyColourInput id="colour-input" name="colour" />

					<MyLabel htmlFor="date-input">Date:</MyLabel>
					<MyDateInput id="date-input" name="date" />

					<MyLabel htmlFor="datetime-input">Date Time:</MyLabel>
					<MyDateTimeInput id="datetime-input" name="datetime" />

					<MyLabel htmlFor="month-input">Month:</MyLabel>
					<MyMonthInput id="month-input" name="month" />

					<MyLabel htmlFor="range-input">Range:</MyLabel>
					<MyRangeInput id="range-input" name="range" />

					<MyLabel htmlFor="number-input">Number:</MyLabel>
					<MyNumberInput id="number-input" name="number" />

					<MyLabel htmlFor="positive-input">Positive:</MyLabel>
					<MyPositiveNumberInput id="positive-input" name="positive" />

					<MyLabel htmlFor="password-input">Password:</MyLabel>
					<MyPasswordInput id="password-input" name="password" />

					<MyLabel htmlFor="file-input">File:</MyLabel>
					<MyFileInput id="file-input" name="file" multiple />
				</div>

				<div className="margin-div">
					<MyRadioInput id="radio1" name="radio" value={1} prefix="1" />
					<MyRadioInput id="radio2" name="radio" value={2} prefix="2" />
					<MyRadioInput id="radio3" name="radio" value={3} prefix="3" />
					<MyRadioInput id="radio4" name="radio" value={4} prefix="4" />

					<MyLabel htmlFor="radio-synced">Radio value (Synced):</MyLabel>
					<MyNumberInput id="radio-synced" name="radio" />
				</div>

				<div className="margin-div">
					<MyCheckboxInput id="checkbox11" name="checkbox" checkedValue={11} prefix="11" />
					<MyCheckboxInput id="checkbox12" name="checkbox" checkedValue={12} prefix="12" />
					<MyCheckboxInput id="checkbox13" name="checkbox" checkedValue={13} prefix="13" />
					<MyCheckboxInput id="checkbox14" name="checkbox" checkedValue={14} prefix="14" />

					<MyLabel htmlFor="checkbox-synced">Checkbox value (Synced):</MyLabel>
					<MyNumberInput id="checkbox-synced" name="checkbox" />
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

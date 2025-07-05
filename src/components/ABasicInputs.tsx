import { useState } from 'react';
import {
	MyCheckboxInput,
	MyColourInput,
	MyDateInput,
	MyDateRangeInput,
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
	type MyColourType,
	type MyDateRangeType,
	type MyTimeType,
	type MyWeekType,
} from '../../lib/main';
import { dateFormatter } from '../../lib/MyForm/components/utils';

type FormType = {
	text: string;
	email: string;
	tel: string;
	time: MyTimeType;
	week: MyWeekType;
	colour: MyColourType;
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
	daterange: MyDateRangeType;
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
			<h2>Basic Inputs and Date Range</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-4">
					<MyLabel for="text-input" required>
						Text:
					</MyLabel>
					<MyTextInput id="text-input" name="text" type="text" required />

					<MyLabel for="email-input">Email:</MyLabel>
					<MyTextInput id="email-input" name="email" type="email" />

					<MyLabel for="tel-input">Tel:</MyLabel>
					<MyTextInput id="tel-input" name="tel" type="tel" pattern="(011-[0-9]{8}|01[02-9]-[0-9]{7})" />

					<MyLabel for="time-input">Time:</MyLabel>
					<MyTimeInput id="time-input" name="time" />

					<MyLabel for="week-input">Week:</MyLabel>
					<MyWeekInput id="week-input" name="week" />

					<MyLabel for="colour-input">Colour:</MyLabel>
					<MyColourInput id="colour-input" name="colour" />

					<MyLabel for="date-input">Date:</MyLabel>
					<MyDateInput id="date-input" name="date" />

					<MyLabel for="datetime-input">Date Time:</MyLabel>
					<MyDateTimeInput id="datetime-input" name="datetime" />

					<MyLabel for="month-input">Month:</MyLabel>
					<MyMonthInput id="month-input" name="month" />

					<MyLabel for="range-input">Range:</MyLabel>
					<MyRangeInput id="range-input" name="range" />

					<MyLabel for="number-input">Number:</MyLabel>
					<MyNumberInput id="number-input" name="number" suffix="cm" />

					<MyLabel for="positive-input">Positive:</MyLabel>
					<MyPositiveNumberInput id="positive-input" name="positive" prefix="RM" />

					<MyLabel for="password-input">Password:</MyLabel>
					<MyPasswordInput id="password-input" name="password" />

					<MyLabel for="file-input">File:</MyLabel>
					<MyFileInput id="file-input" name="file" multiple />

					<MyLabel for="file-input">Date Range:</MyLabel>

					<MyDateRangeInput
						id="date-range-input"
						name="daterange"
						min={new Date('2015-05-15')}
						max={new Date('2035-05-15')}
					/>
				</div>

				<div className="margin-div">
					<MyRadioInput id="radio1" name="radio" value={1} prefix="1" />
					<MyRadioInput id="radio2" name="radio" value={2} prefix="2" />
					<MyRadioInput id="radio3" name="radio" value={3} prefix="3" />
					<MyRadioInput id="radio4" name="radio" value={4} prefix="4" />

					<MyLabel for="radio-synced">Radio value (Synced):</MyLabel>
					<MyNumberInput id="radio-synced" name="radio" />
				</div>

				<div className="margin-div">
					<MyCheckboxInput id="checkbox11" name="checkbox" checkedValue={11} prefix="11" />
					<MyCheckboxInput id="checkbox12" name="checkbox" checkedValue={12} prefix="12" />
					<MyCheckboxInput id="checkbox13" name="checkbox" checkedValue={13} prefix="13" />
					<MyCheckboxInput id="checkbox14" name="checkbox" checkedValue={14} prefix="14" />

					<MyLabel for="checkbox-synced">Checkbox value (Synced):</MyLabel>
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

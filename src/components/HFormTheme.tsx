import { useState } from 'react';
import {
	MyCheckboxInput,
	MyColourInput,
	MyColumnComboBoxInput,
	MyComboBoxInput,
	MyDateInput,
	MyDateRangeInput,
	MyDateTimeInput,
	MyFileInput,
	MyForm,
	MyLabel,
	MyMonthInput,
	MyMultiComboBoxInput,
	MyNumberInput,
	MyPasswordInput,
	MyPositiveNumberInput,
	MyRadioInput,
	MyRangeInput,
	MySelectInput,
	MySimpleComboBoxInput,
	MyTextAreaInput,
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
	textarea: string;
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

export default function HFormTheme() {
	const form = useMyForm<FormType>('theme_input');
	const [data, setData] = useState<Partial<FormType>>({});
	const formData = form.getFormData();

	function formatter(data: FormType[keyof FormType]) {
		if (!data) return '';
		if (typeof data === 'string') return data;
		if (typeof data === 'number') return data;
		if (data instanceof Date) return dateFormatter(data, 'yyyy-MM-dd hh:mm:ss a');
		if (Array.isArray(data))
			return data.map((obj) => (obj instanceof File ? obj.name : JSON.stringify(obj))).join(', ');
		return JSON.stringify(data);
	}

	return (
		<div className="demo-container dark">
			<h2>Dark Theme</h2>
			<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
				<div className="grid-inputs-4">
					<MyLabel for="dark-text-input" required>
						Text:
					</MyLabel>
					<MyTextInput id="dark-text-input" name="text" type="text" required />

					<MyLabel for="dark-email-input">Email:</MyLabel>
					<MyTextInput id="dark-email-input" name="email" type="email" />

					<MyLabel for="dark-tel-input">Tel:</MyLabel>
					<MyTextInput id="dark-tel-input" name="tel" type="tel" pattern="(011-[0-9]{8}|01[02-9]-[0-9]{7})" />

					<MyLabel for="dark-time-input">Time:</MyLabel>
					<MyTimeInput id="dark-time-input" name="time" />

					<MyLabel for="dark-week-input">Week:</MyLabel>
					<MyWeekInput id="dark-week-input" name="week" />

					<MyLabel for="dark-colour-input">Colour:</MyLabel>
					<MyColourInput id="dark-colour-input" name="colour" />

					<MyLabel for="dark-date-input">Date:</MyLabel>
					<MyDateInput id="dark-date-input" name="date" />

					<MyLabel for="dark-datetime-input">Date Time:</MyLabel>
					<MyDateTimeInput id="dark-datetime-input" name="datetime" />

					<MyLabel for="dark-month-input">Month:</MyLabel>
					<MyMonthInput id="dark-month-input" name="month" />

					<MyLabel for="dark-range-input">Range:</MyLabel>
					<MyRangeInput id="dark-range-input" name="range" />

					<MyLabel for="dark-number-input">Number:</MyLabel>
					<MyNumberInput id="dark-number-input" name="number" />

					<MyLabel for="dark-positive-input">Positive:</MyLabel>
					<MyPositiveNumberInput id="dark-positive-input" name="positive" />

					<MyLabel for="dark-password-input">Password:</MyLabel>
					<MyPasswordInput id="dark-password-input" name="password" />

					<MyLabel for="dark-file-input">File:</MyLabel>
					<MyFileInput id="dark-file-input" name="file" multiple />

					<MyLabel for="dark-date-range-input">Date Range:</MyLabel>
					<MyDateRangeInput
						id="dark-date-range-input"
						name="daterange"
						min={new Date('2015-05-15')}
						max={new Date('2035-05-15')}
					/>
				</div>

				<div className="grid-inputs">
					<MyLabel for="dark-text-area-input">Text Area:</MyLabel>
					<MyTextAreaInput id="dark-text-area-input" name="textarea" resize="none" fillRight showGrid />
				</div>

				<div className="grid-inputs-2">
					<MyLabel for="dark-select-input">Select:</MyLabel>
					<MySelectInput id="dark-select-input" name="select" options={SELECT_OPTIONS_LABELLED} />

					<MyLabel for="dark-simplecombobox-input">Simple Combo Box:</MyLabel>
					<MySimpleComboBoxInput
						id="dark-simplecombobox-input"
						name="simple_combobox"
						options={SELECT_OPTIONS_LABELLED}
					/>

					<MyLabel for="dark-combobox-input">Combo Box:</MyLabel>
					<MyComboBoxInput
						id="dark-combobox-input"
						name="combobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						optionElement={(value) => <strong>{value.value_a}</strong>}
					/>

					<MyLabel for="dark-columncombobox-input">Combo Box with Columns:</MyLabel>
					<MyColumnComboBoxInput
						id="dark-columncombobox-input"
						name="columncombobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a}
						columns={['value_a', (value) => value.value_b]}
					/>
				</div>

				<div className="small-div">
					<MyLabel for="dark-multicombobox-input">Multiselect Combo Box:</MyLabel>
					<MyMultiComboBoxInput
						id="dark-multicombobox-input"
						name="multi_combobox"
						options={SELECT_OPTIONS}
						optionKey={(value) => value.value_a + ' ' + value.value_b}
						optionElement={(value) => <i>{value.value_a}</i>}
						selectedHeight={40}
						selectedNoWrap
					/>
				</div>

				<div className="margin-div">
					<MyRadioInput id="dark-radio1" name="radio" value={1} prefix="1" />
					<MyRadioInput id="dark-radio2" name="radio" value={2} prefix="2" />
					<MyRadioInput id="dark-radio3" name="radio" value={3} prefix="3" />
					<MyRadioInput id="dark-radio4" name="radio" value={4} prefix="4" />

					<MyLabel for="dark-radio-synced">Radio value (Synced):</MyLabel>
					<MyNumberInput id="dark-radio-synced" name="radio" />
				</div>

				<div className="margin-div">
					<MyCheckboxInput id="dark-checkbox11" name="checkbox" checkedValue={11} prefix="11" />
					<MyCheckboxInput id="dark-checkbox12" name="checkbox" checkedValue={12} prefix="12" />
					<MyCheckboxInput id="dark-checkbox13" name="checkbox" checkedValue={13} prefix="13" />
					<MyCheckboxInput id="dark-checkbox14" name="checkbox" checkedValue={14} prefix="14" />

					<MyLabel for="dark-checkbox-synced">Checkbox value (Synced):</MyLabel>
					<MyNumberInput id="dark-checkbox-synced" name="checkbox" />
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

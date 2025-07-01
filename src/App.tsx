import { useEffect, useState } from 'react';
import {
	type ColourType,
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
	MySubForm,
	MyTextAreaInput,
	MyTextInput,
	MyTimeInput,
	MyWeekInput,
	useMyForm,
} from '../lib/main';

function App() {
	const form = useMyForm<{
		test_test: string;
		test_date: Date;
		test_month: Date;
		test_colour: ColourType;
		test_week: { year: number; week: number };
		test_file: FileList;
		test_combobox: { a: string };
		test_select: { a: string };
	}>('test');
	const [count, setCount] = useState(1);

	// console.log(form.getFormData());

	useEffect(() => {
		form.updateField({ name: 'test_date', value: new Date('2015-05-15T23:00:00Z') });
		form.updateField({ name: 'test_month', value: new Date('2015-04-30T23:00:00Z') });
		setTimeout(() => {
			form.updateField({ name: 'test_colour', value: '#FF00FF' });
			form.updateField({ name: 'test_week', value: { year: 2015, week: 24 } });
			form.updateField({ name: 'test_combobox', value: { a: 'ONE' } });
			form.updateField({ name: 'test_select', value: { a: 'ONE' } });
		}, 1000);
		setTimeout(() => {
			form.updateField({ name: 'test_combobox', value: { a: 'O' } });
			form.updateField({ name: 'test_select', value: { a: 'O' } });
		}, 2000);
		setTimeout(() => {
			form.initialiseForm({
				test_colour: '#00ff00',
				test_select: { a: 'TWO' },
				test_combobox: { a: 'TWO' },
			});
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<MyForm
			formId={form.formId}
			onSubmit={() => console.log('Submitted')}
			submitButtonId="submit-test"
			disableNativeForm
		>
			<span>Date Range</span>
			<div style={{ background: '' }}>
				<button type="button" onClick={() => console.log(form.getFormData())}>
					Show Data
				</button>

				<MyLabel htmlFor="text" required>
					Text
				</MyLabel>
				<span>Here</span>
				<br />
				<MyLabel htmlFor="text">Text</MyLabel>
				<span>Here</span>

				<br />
				<MySubForm subFormId="test_parent">
					<MySubForm subFormId="test_child">
						<MyPositiveNumberInput
							id="number-p2"
							name="test_numberp2"
							prefix="Prefix"
							suffix="Suffix"
							validator={(input) => input !== 10}
							inputProps={{ placeholder: 'Number here' }}
							required
						/>
					</MySubForm>
				</MySubForm>
				<br />
				<MyMultiComboBoxInput
					id="multicombobox"
					name="test_multicombobox"
					optionElement={(v) => v.value.a}
					optionKey={(v) => v.value.a}
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{ label: '5', value: { a: 'FIVEE' } },
						{ label: '6', value: { a: 'SIX' } },
						{ label: '7', value: { a: 'SEVEN' } },
						{ label: '8', value: { a: 'EIGHT' } },
					]}
					noBackground
				/>
				<br />
				<br />
				<MyDateRangeInput
					id="daterange"
					name="test_daterange"
					prefix="Prefix"
					suffix="Suffix"
					min={new Date(2030, 4, 15)}
					max={new Date(2015, 4, 15)}
					required
				/>

				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<br />
				<MyDateRangeInput
					id="daterange1"
					name="test_daterange"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={{ start: new Date(2015, 5, 15) }}
					required
				/>
				<br />
				<MyPositiveNumberInput
					id="number-p"
					name="test_numberp"
					prefix="Prefix"
					suffix="Suffix"
					validator={(input) => input !== 10}
					inputProps={{ placeholder: 'Number here' }}
					persistOnUnmount
					required
				/>
				<br />
				<MyColumnComboBoxInput
					id="combobox111"
					name="test_combobox3"
					columns={['value.a', 'label']}
					optionKey={(value) => value.label}
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{
							label: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.`,
							value: { a: 'FIVE' },
						},
						{ label: '5', value: { a: 'FIVEE' } },
						{ label: '6', value: { a: 'SIX' } },
						{ label: '7', value: { a: 'SEVEN' } },
						{ label: '8', value: { a: 'EIGHT' } },
					]}
					optionRows={7}
					optionWidth={'70vw'}
					noWrapRow
				/>
				<br />
				<MyComboBoxInput
					id="combobox11"
					name="test_combobox2"
					optionElement={(value) => (
						<div>
							<span>{value.label}</span>
							<span>({value.value.a})</span>
						</div>
					)}
					optionKey={(value) => value.label}
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{
							label: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.`,
							value: { a: 'FIVE' },
						},
						{ label: '5', value: { a: 'FIVEE' } },
						{ label: '6', value: { a: 'SIX' } },
						{ label: '7', value: { a: 'SEVEN' } },
						{ label: '8', value: { a: 'EIGHT' } },
					]}
					optionRows={7}
				/>
				<br />
				<div style={{ margin: 50, height: 30 }}>
					<MySimpleComboBoxInput
						id="combobox"
						name="test_combobox"
						options={[
							{ label: '1', value: { a: 'ONE' } },
							{ label: '2', value: { a: 'TWO' } },
							{ label: '3', value: { a: 'THREE' } },
							{ label: '4', value: { a: 'FOUR' } },
							{
								label: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.`,
								value: { a: 'FIVE' },
							},
							{ label: '5', value: { a: 'FIVEE' } },
							{ label: '6', value: { a: 'SIX' } },
							{ label: '7', value: { a: 'SEVEN' } },
							{ label: '8', value: { a: 'EIGHT' } },
						]}
						optionRows={7}
						optionWidth={'150%'}
						filterOnType
						prefix="Prefix"
						suffix="Suffix"
						inputProps={{ placeholder: 'Number here' }}
						persistOnUnmount
						required
					/>
				</div>
				<br />

				<div style={{ maxHeight: 200, overflow: 'auto' }}>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.
					</p>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium maxime, eum pariatur sequi voluptates
						deleniti nesciunt aut aliquam, labore temporibus ut quia illo iste rerum voluptate blanditiis nam eius
						voluptatum.
					</p>

					<MySimpleComboBoxInput
						id="combobox1"
						name="test_combobox"
						options={[
							{ label: '1', value: { a: 'ONE' } },
							{ label: '2', value: { a: 'TWO' } },
							{ label: '3', value: { a: 'THREE' } },
							{ label: '4', value: { a: 'FOUR' } },
							{ label: '5', value: { a: 'FIVE' } },
						]}
						prefix="Prefix"
						suffix="Suffix"
						inputProps={{ placeholder: 'Number here' }}
						persistOnUnmount
						required
					/>

					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, quibusdam distinctio perspiciatis
						repellendus eveniet expedita itaque et harum praesentium quos non quo quaerat! Quaerat, perspiciatis modi
						nisi soluta vel quam.
					</p>
				</div>

				<MySelectInput
					id="select"
					name="test_select"
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{ label: '5', value: { a: 'FIVE' } },
					]}
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={{ a: 'FOUR' }}
					placeholder="EMPTY"
				/>

				<MySelectInput
					id="select2"
					name="test_select"
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{ label: '5', value: { a: 'FIVE' } },
					]}
					required
				/>

				<MySelectInput
					id="select3"
					name="test_select"
					options={[
						{ label: '1', value: { a: 'ONE' } },
						{ label: '1', value: { a: 'TWO' } },
						{ label: '2', value: { a: 'TWO' } },
						{ label: '3', value: { a: 'THREE' } },
						{ label: '4', value: { a: 'FOUR' } },
						{ label: '5', value: { a: 'FIVE' } },
					]}
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={{ a: 'FOUR' }}
					placeholder="EMPTY"
				/>

				<br />
				{count % 3 !== 0 ? (
					<MyTextInput
						id="text"
						name="test_text"
						defaultValue="TEST"
						prefix="Prefix"
						suffix="Suffix"
						validator={(input) => input !== 'INVALID'}
						inputProps={{ placeholder: 'Test here' }}
						persistOnUnmount
					/>
				) : null}

				<br />
				<MyTextInput
					id="email"
					name="test_email"
					type="email"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue="myemail@email.com"
					validator={(input) => input !== 'INVALID'}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyTextInput
					id="url"
					name="test_url"
					type="url"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue="https://localhost:5173"
					validator={(input) => input !== 'INVALID'}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyTextInput
					id="tel"
					name="test_tel"
					type="tel"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue="011-1234 5678"
					validator={(input) => input !== 'INVALID'}
					inputProps={{ placeholder: 'Test here' }}
					pattern="(01[02-9]-[0-9]{3} [0-9]{4}|011-[0-9]{4} [0-9]{4})"
					persistOnUnmount
				/>

				<br />
				<MyDateInput
					id="date"
					name="test_date"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={new Date('2021-05-15')}
					validator={(input) => !!input && input > new Date('2025-01-30')}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyTimeInput
					id="time"
					name="test_time"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={{ hour: 13, minute: 50 }}
					validator={(input) => !!input && input?.hour > 13}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
					parseAsUtc
				/>

				<br />
				<MyNumberInput
					id="number"
					name="test_number"
					defaultValue={5}
					prefix="Prefix"
					suffix="Suffix"
					validator={(input) => input !== 10}
					inputProps={{ placeholder: 'Number here' }}
					persistOnUnmount
				/>

				<br />
				<MyTextAreaInput
					id="textarea"
					name="test_textarea"
					defaultValue="Descriptions"
					validator={(input) => input !== 'invalid'}
					validateImmediately
					fillRight
					rows={1}
					showGrid
					nonResizeable
					inputProps={{ spellCheck: false }}
				/>

				<br />
				<MyColourInput
					id="colour"
					name="test_colour"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue="#00ff00"
					validateImmediately
				/>

				<br />
				<MyRangeInput
					id="range"
					name="test_range"
					defaultValue={5}
					max={10}
					prefix="Prefix"
					suffix="Suffix"
					validator={(input) => (input !== 10 ? 'Is Not TEN!' : true)}
					inputProps={{ placeholder: 'Number here' }}
					persistOnUnmount
				/>

				<br />
				<MyMonthInput
					id="month"
					name="test_month"
					prefix="Prefix"
					suffix="Suffix"
					defaultValue={new Date('2021-05-01')}
					validator={(input) => !!input && input > new Date('2025-01-30')}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyTextInput
					id="search"
					name="test_search"
					type="search"
					prefix="Prefix"
					suffix="Suffix"
					validator={(input) => input !== 'INVALID'}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyWeekInput
					id="week"
					name="test_week"
					defaultValue={{ year: 2021, week: 40 }}
					prefix="Prefix"
					suffix="Suffix"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyPasswordInput
					id="password"
					name="test_password"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />
				<MyFileInput id="file" name="test_file" prefix="Prefix" suffix="Suffix" required multiple />

				<br />

				<MyRadioInput
					id="radio-1"
					name="test_radio"
					defaultValue={{ id: 1, name: 'ONE' }}
					value={{ id: 1, name: 'ONE' }}
					persistOnUnmount
					prefix="Prefix ONE"
					suffix="Suffix ONE"
				/>

				<br />

				<MyRadioInput
					id="radio-2"
					name="test_radio"
					defaultValue={{ id: 1, name: 'ONE' }}
					value={{ id: 2, name: 'TWO' }}
					persistOnUnmount
					prefix="Prefix TWO"
					suffix="Suffix TWO"
				/>

				<br />

				<MyRadioInput
					id="radio-3"
					name="test_radio"
					defaultValue={{ id: 2, name: 'TWO' }}
					value={{ id: 2, name: 'TWO' }}
					persistOnUnmount
					prefix="Prefix TWO"
					suffix="Suffix TWO"
					noBackground
					noBorder
				/>

				<br />

				<MyTextInput
					id="text-1"
					name="test_text"
					defaultValue="TEST"
					prefix="Prefix"
					suffix="Suffix"
					validator={(input) => input !== 'INVALID'}
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />

				<MyDateTimeInput
					id="datetime"
					name="test_datetime"
					defaultValue={new Date('2025-05-15T08:00:00Z')}
					prefix="Prefix"
					suffix="Suffix"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<br />

				<MyCheckboxInput
					id="checkbox-1"
					name="test_checkbox1"
					checkedValue={10}
					prefix="-"
					suffix="10"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<MyCheckboxInput
					id="checkbox-2"
					name="test_checkbox1"
					checkedValue={5}
					prefix="-"
					suffix="5"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<MyCheckboxInput
					id="checkbox-3"
					name="test_checkbox1"
					uncheckValue={5}
					checkedValue={15}
					prefix="5"
					suffix="15"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<MyCheckboxInput
					id="radio-5"
					name="test_radio"
					uncheckValue={{ id: 3, name: 'THREE' }}
					checkedValue={{ id: 1, name: 'ONE' }}
					prefix="Radio"
					inputProps={{ placeholder: 'Test here' }}
					persistOnUnmount
				/>

				<MyNumberInput id="number-checkbox" name="test_checkbox1" />

				<br />

				<button id="submit-test" onClick={() => setCount((count) => count + 1)}>
					Submit
				</button>
				<button type="button" onClick={() => form.resetForm()}>
					Reset
				</button>
			</div>
		</MyForm>
	);
}

export default App;

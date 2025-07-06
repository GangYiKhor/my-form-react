import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyDateInput,
	MyDateRangeInput,
	MyDateRangeType,
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MySelectInput,
	MyTextInput,
	useMyForm,
} from '../../../../../lib/main';
import { dateFormatter } from '../../../../../lib/MyForm/components/utils';

const PLAIN_SAMPLE =
	'' +
	`<MyLabelInputPair>
  <MyLabel for="text-id">Date Range:</MyLabel>
  <MyDateRangeInput />
</MyLabelInputPair>`;

const validatorFn = {
	after2025Reject: function after2025RejectFn(data: MyDateRangeType) {
		if (data.start && data.start > new Date('2025-01-01')) return true;
		return false;
	},
	after2025Reason: function after2025ReasonFn(data: MyDateRangeType) {
		if (data.start && data.start > new Date('2025-01-01')) return true;
		return 'Please enter a date after 2025!';
	},
};

type FormType = {
	id: string;
	name: string;
	prefix: string;
	suffix: string;
	defaultValue: MyDateRangeType;
	onFocus: boolean;
	onBlur: boolean;
	onClear: boolean;
	validator: 'after2025Reject' | 'after2025Reason';
	required: boolean;
	persistOnUnmount: boolean;
	noBorder: boolean;
	noBackground: boolean;
	disabled: boolean;
	min: Date;
	max: Date;
};

type ExampleFormType = { [key: string]: Date };

export default function DateRangePage() {
	const form = useMyForm<FormType>('daterange_properties');
	const dataRef = useRef<HTMLElement>(null);
	const examplePlainRef = useRef<HTMLElement>(null);
	const propData = form.getFormData();
	const [sampleCode, setSampleCode] = useState<string>(PLAIN_SAMPLE);
	const [data, setData] = useState<{ [key: string]: any }>();
	if (!propData.name) propData.name = 'unknown_field';

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		let sample = PLAIN_SAMPLE;
		const props: string[] = [];
		if (propData.id) props.push(`id="${propData.id}"`);
		if (propData.name) props.push(`name="${propData.name}"`);
		if (propData.prefix) props.push(`prefix="${propData.prefix}"`);
		if (propData.suffix) props.push(`suffix="${propData.suffix}"`);
		if (propData.defaultValue) props.push(`defaultValue={${JSON.stringify(propData.defaultValue)}}`);
		if (propData.min) props.push(`min={new Date('${dateFormatter(propData.min, 'yyyy-MM-dd')}')}`);
		if (propData.max) props.push(`max={new Date('${dateFormatter(propData.max, 'yyyy-MM-dd')}')}`);
		if (propData.onFocus) props.push(`onFocus={(_, data) => alert('Focused')}`);
		if (propData.onBlur) props.push(`onBlur={(_, data) => alert('Blurred')}`);
		if (propData.onClear) props.push(`onClear={(_, data) => alert('Cleared')}`);
		if (propData.validator)
			props.push(
				`validator={${validatorFn[propData.validator]
					.toString()
					.replaceAll('  ', '    ')
					.replaceAll('      ', '    ')
					.replaceAll('/* @__PURE__ */ ', '')}}`
			);
		if (propData.required) props.push('required');
		if (propData.persistOnUnmount) props.push('persistOnUnmount');
		if (propData.noBorder) props.push('noBorder');
		if (propData.noBackground) props.push('noBackground');
		if (propData.disabled) props.push('disabled');
		const combinedProps = props.join(' ');
		if (!propData.validator && combinedProps.length < 60)
			sample = sample.replace('<MyDateRangeInput />', '<MyDateRangeInput ' + combinedProps + ' />');
		else sample = sample.replace('<MyDateRangeInput />', '<MyDateRangeInput\n    ' + props.join('\n    ') + '\n  />');

		setSampleCode(sample);

		if (examplePlainRef.current) {
			delete examplePlainRef.current.dataset.highlighted;
			hljs.highlightElement(examplePlainRef.current);
		}
	}, [propData]);

	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>My Date Range Input</h1>
					<p>A date range input with custom calendar picker</p>
				</section>

				<section className="example">
					<MyForm<ExampleFormType> formId="example" onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair>
							<MyLabel for="text-id">Date Range:</MyLabel>
							<MyDateRangeInput
								id={propData.id}
								name={propData.name}
								prefix={propData.prefix}
								suffix={propData.suffix}
								defaultValue={propData.defaultValue}
								onFocus={propData.onFocus ? () => alert('Focused') : undefined}
								onBlur={propData.onBlur ? () => alert('Blurred') : undefined}
								onClear={propData.onClear ? () => alert('Cleared') : undefined}
								validator={validatorFn[propData.validator]}
								required={propData.required}
								persistOnUnmount={propData.persistOnUnmount}
								noBorder={propData.noBorder}
								noBackground={propData.noBackground}
								disabled={propData.disabled}
								min={propData.min}
								max={propData.max}
							/>
						</MyLabelInputPair>

						<button id="submit" type="submit">
							Submit
						</button>
					</MyForm>
				</section>

				<section>
					<h2>Data</h2>
					<pre>
						<code ref={dataRef} className="language-json">
							{JSON.stringify(data ?? {}, undefined, 2)}
						</code>
					</pre>
				</section>

				<section>
					<h2>Code</h2>
					<pre>
						<code ref={examplePlainRef} className="language-typescript">
							{sampleCode}
						</code>
					</pre>
				</section>
			</div>

			<div className="properties scrollbar">
				<section className="property-section">
					<MyForm formId={form.formId}>
						<h2>Properties</h2>
						<ul>
							<li>
								<code className="property-name">id</code>: ID for input element
							</li>
							<ul>
								<li>
									<MyTextInput id="id" name="id" />
								</li>
							</ul>

							<li>
								<code className="property-name">name</code>: Field name
							</li>
							<ul>
								<li>
									<MyTextInput id="name" name="name" />
								</li>
							</ul>

							<li>
								<code className="property-name">prefix</code>: A simple label at the left of the input
							</li>
							<ul>
								<li>
									<MyTextInput id="prefix" name="prefix" />
								</li>
							</ul>

							<li>
								<code className="property-name">suffix</code>: A simple label at the right of the input
							</li>
							<ul>
								<li>
									<MyTextInput id="suffix" name="suffix" />
								</li>
							</ul>

							<li>
								<code className="property-name">min</code>: Minimum date shown on the calendar, not used as validator,
								if invalid range, min and max wont be applied
							</li>
							<ul>
								<li>
									<MyDateInput id="min" name="min" />
								</li>
							</ul>

							<li>
								<code className="property-name">max</code>: Maximum date shown on the calendar, not used as validator,
								if invalid range, min and max wont be applied
							</li>
							<ul>
								<li>
									<MyDateInput id="max" name="max" />
								</li>
							</ul>

							<li>
								<code className="property-name">defaultValue</code>: Default value of the input, change the field name
								to see the effect
							</li>
							<ul>
								<li>
									<MyDateRangeInput id="defaultValue" name="defaultValue" />
								</li>
							</ul>

							<li>
								<code className="property-name">onFocus</code>: Function to trigger on focus
							</li>
							<ul>
								<li>
									<MySelectInput
										id="onFocus"
										name="onFocus"
										placeholder="None (Default)"
										options={[{ label: 'Alert', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">onBlur</code>: Function to trigger on blur
							</li>
							<ul>
								<li>
									<MySelectInput
										id="onBlur"
										name="onBlur"
										placeholder="None (Default)"
										options={[{ label: 'Alert', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">onClear</code>: Function to trigger on clear
							</li>
							<ul>
								<li>
									<MySelectInput
										id="onClear"
										name="onClear"
										placeholder="None (Default)"
										options={[{ label: 'Alert', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">validator</code>: Validator for the input, only valid if return true, if
								string is returned, the string will be shown when the field is hovered over
							</li>
							<ul>
								<li>
									<MySelectInput
										id="validator"
										name="validator"
										placeholder="None (Default)"
										options={[
											{ label: 'After 2025 (Reject only)', value: 'after2025Reject' },
											{ label: 'After 2025 (Reject only)', value: 'after2025Reason' },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">required</code>: Mark the input as required
							</li>
							<ul>
								<li>
									<MySelectInput
										id="required"
										name="required"
										placeholder="Disabled (Default)"
										options={[{ label: 'Enabled', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">persistOnUnmount</code>: Keep the field data when unmounted
							</li>
							<ul>
								<li>
									<MySelectInput
										id="persistOnUnmount"
										name="persistOnUnmount"
										placeholder="Disabled (Default)"
										options={[{ label: 'Enabled', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">noBorder</code>: Remove the border of the input
							</li>
							<ul>
								<li>
									<MySelectInput
										id="noBorder"
										name="noBorder"
										placeholder="Enable border (Default)"
										options={[{ label: 'Disable border', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">noBackground</code>: Remove the background of the input (More visible in
								light mode)
							</li>
							<ul>
								<li>
									<MySelectInput
										id="noBackground"
										name="noBackground"
										placeholder="Enable background (Default)"
										options={[{ label: 'Disable background', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">disabled</code>: Disable the input
							</li>
							<ul>
								<li>
									<MySelectInput
										id="disabled"
										name="disabled"
										placeholder="Enabled (Default)"
										options={[{ label: 'Disabled', value: true }]}
									/>
								</li>
							</ul>
						</ul>
					</MyForm>
				</section>
			</div>
		</div>
	);
}

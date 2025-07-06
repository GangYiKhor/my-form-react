import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MyNumberInput,
	MySelectInput,
	MyTextInput,
	useMyForm,
} from '../../../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`<MyLabelInputPair>
  <MyLabel for="text-id">Number:</MyLabel>
  <MyNumberInput />
</MyLabelInputPair>`;

const validatorFn = {
	noNegativeReject: function noNegativeRejectFn(data: number) {
		if (data > 0) return true;
		return false;
	},
	lessThan50Reject: function lessThan50RejectFn(data: number) {
		if (data < 50) return true;
		return false;
	},
	noNegativeReason: function noNegativeReasonFn(data: number) {
		if (data > 0) return true;
		return 'Please enter a positive number!';
	},
	lessThan50Reason: function lessThan50ReasonFn(data: number) {
		if (data < 50) return true;
		return 'Please enter a number less than 50';
	},
};

type FormType = {
	id: string;
	name: string;
	placeholder: string;
	prefix: string;
	suffix: string;
	defaultValue: number;
	onChange: 'alert';
	validator: 'noNegativeReject' | 'lessThan50Reject' | 'noNegativeReason' | 'lessThan50Reason';
	validateImmediately: boolean;
	required: boolean;
	persistOnUnmount: boolean;
	inputDelay: number;
	noBorder: boolean;
	noBackground: boolean;
	disabled: boolean;
};

type ExampleFormType = { [key: string]: number };

export default function NumberInputPage() {
	const form = useMyForm<FormType>('number_properties');
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
		if (propData.placeholder) props.push(`placeholder="${propData.placeholder}"`);
		if (propData.prefix) props.push(`prefix="${propData.prefix}"`);
		if (propData.suffix) props.push(`suffix="${propData.suffix}"`);
		if (propData.defaultValue) props.push(`defaultValue={${propData.defaultValue}}`);
		if (propData.onChange) props.push(`onChange={(_, data) => alert(data)}`);
		if (propData.validator)
			props.push(
				`validator={${validatorFn[propData.validator]
					.toString()
					.replaceAll('  ', '    ')
					.replaceAll('      ', '    ')}}`
			);
		if (propData.inputDelay) props.push(`inputDelay={${propData.inputDelay}}`);
		if (propData.validateImmediately) props.push('validateImmediately');
		if (propData.required) props.push('required');
		if (propData.persistOnUnmount) props.push('persistOnUnmount');
		if (propData.noBorder) props.push('noBorder');
		if (propData.noBackground) props.push('noBackground');
		if (propData.disabled) props.push('disabled');
		const combinedProps = props.join(' ');
		if (!propData.validator && combinedProps.length < 60)
			sample = sample.replace('<MyNumberInput />', '<MyNumberInput ' + combinedProps + ' />');
		else sample = sample.replace('<MyNumberInput />', '<MyNumberInput\n    ' + props.join('\n    ') + '\n  />');

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
					<h1>My Number Input</h1>
				</section>

				<section className="example">
					<MyForm<ExampleFormType> formId="example" onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair>
							<MyLabel for="text-id">Number:</MyLabel>
							<MyNumberInput
								id={propData.id}
								name={propData.name}
								placeholder={propData.placeholder}
								prefix={propData.prefix}
								suffix={propData.suffix}
								defaultValue={propData.defaultValue}
								onChange={propData.onChange ? (_, data) => alert(data) : undefined}
								validator={validatorFn[propData.validator]}
								validateImmediately={propData.validateImmediately}
								required={propData.required}
								persistOnUnmount={propData.persistOnUnmount}
								inputDelay={propData.inputDelay}
								noBorder={propData.noBorder}
								noBackground={propData.noBackground}
								disabled={propData.disabled}
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
								<code className="property-name">placeholder</code>: Placeholder of input
							</li>
							<ul>
								<li>
									<MyTextInput id="placeholder" name="placeholder" />
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
								<code className="property-name">defaultValue</code>: Default value of the input, change the field name
								to see the effect
							</li>
							<ul>
								<li>
									<MyNumberInput id="defaultValue" name="defaultValue" />
								</li>
							</ul>

							<li>
								<code className="property-name">onChange</code>: Function to trigger on change, data is passed as second
								argument
							</li>
							<ul>
								<li>
									<MySelectInput
										id="onChange"
										name="onChange"
										placeholder="None (Default)"
										options={[{ label: 'Alert', value: 'alert' }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">validator</code>: Validator for the input, only valid if return true, if
								string is returned, the string will be shown when the field is hovered over
							</li>
							<ul>
								<li>
									<MySelectInput<string | number>
										id="validator"
										name="validator"
										placeholder="None (Default)"
										options={[
											{ label: 'No negative number (Reject only)', value: 'noNegativeReject' },
											{ label: 'Less than 50 (Reject only)', value: 'lessThan50Reject' },
											{ label: 'No negative number (With reason)', value: 'noNegativeReason' },
											{ label: 'Less than 50 (With reason)', value: 'lessThan50Reason' },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">validateImmediately</code>: Validate immediately on type or on
								submission only
							</li>
							<ul>
								<li>
									<MySelectInput
										id="validateImmediately"
										name="validateImmediately"
										placeholder="Disabled (Default)"
										options={[{ label: 'Enabled', value: true }]}
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
								<code className="property-name">inputDelay</code>: Delay the input update, if negative value is given,
								0ms will be used (Check console)
							</li>
							<ul>
								<li>
									<MyNumberInput id="inputDelay" name="inputDelay" inputDelay={propData.inputDelay} />
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

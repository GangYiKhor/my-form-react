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
  <MyLabel for="text-id">Text:</MyLabel>
  <MyTextInput />
</MyLabelInputPair>`;

const validatorFn = {
	allLowerReject: function allLowerRejectFn(data: string) {
		if (!data.match(/[A-Z]/)) return true;
		return false;
	},
	hasCapitalReject: function hasCapitalRejectFn(data: string) {
		if (!data.match(/[A-Z]/)) return false;
		return true;
	},
	hasCapitalReason: function hasCapitalReasonFn(data: string) {
		if (!data.match(/[A-Z]/)) return 'Must contain a capital letter!';
		return true;
	},
	allLowerReason: function allLowerReasonFn(data: string) {
		if (!data.match(/[A-Z]/)) return true;
		return 'Must not contain capital letters!';
	},
};

type FormType = {
	id: string;
	name: string;
	type: 'text' | 'email' | 'url' | 'tel' | 'search';
	pattern: string;
	placeholder: string;
	prefix: string;
	suffix: string;
	defaultValue: string;
	onChange: 'alert';
	validator: 'hasCapitalReject' | 'hasCapitalReason' | 'allLowerReject' | 'allLowerReason';
	validateImmediately: boolean;
	required: boolean;
	persistOnUnmount: boolean;
	inputDelay: number;
	noBorder: boolean;
	noBackground: boolean;
	disabled: boolean;
};

type ExampleFormType = { [key: string]: string };

export default function TextInputPage() {
	const form = useMyForm<FormType>('text_properties');
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
		if (propData.type) props.push(`type="${propData.type}"`);
		if (propData.pattern) props.push(`pattern="${propData.pattern}"`);
		if (propData.placeholder) props.push(`placeholder="${propData.placeholder}"`);
		if (propData.prefix) props.push(`prefix="${propData.prefix}"`);
		if (propData.suffix) props.push(`suffix="${propData.suffix}"`);
		if (propData.defaultValue) props.push(`defaultValue="${propData.defaultValue}"`);
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
			sample = sample.replace('<MyTextInput />', '<MyTextInput ' + combinedProps + ' />');
		else sample = sample.replace('<MyTextInput />', '<MyTextInput\n    ' + props.join('\n    ') + '\n  />');

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
					<h1>My Text Input</h1>
					<p>A basic text input for text, email, url, tel and search type</p>
				</section>

				<section className="example">
					<MyForm<ExampleFormType> formId="example" onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair>
							<MyLabel for="text-id">Text:</MyLabel>
							<MyTextInput
								id={propData.id}
								name={propData.name}
								type={propData.type}
								pattern={propData.pattern}
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
								<code className="property-name">type</code>: Type of input
							</li>
							<ul>
								<li>
									<MySelectInput
										id="type"
										name="type"
										placeholder="text (Default)"
										options={[
											{ label: 'text', value: 'text' },
											{ label: 'email', value: 'email' },
											{ label: 'url', value: 'url' },
											{ label: 'tel', value: 'tel' },
											{ label: 'search', value: 'search' },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">pattern</code>: Native pattern validation for input
							</li>
							<ul>
								<li>
									<MySelectInput
										id="pattern"
										name="pattern"
										placeholder="EMPTY"
										options={[
											{ label: '01[0-9]-[0-1]{7}', value: '01[0-9]-[0-1]{7}' },
											{ label: '(01[02-9]-[0-9]{7}|011-[0-9]{8})', value: '(01[02-9]-[0-9]{7}|011-[0-9]{8})' },
										]}
									/>
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
									<MyTextInput id="defaultValue" name="defaultValue" />
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
									<MySelectInput
										id="validator"
										name="validator"
										placeholder="None (Default)"
										options={[
											{ label: 'Has capital letter (Reject only)', value: 'hasCapitalReject' },
											{ label: 'Has capital letter (With reason)', value: 'hasCapitalReason' },
											{ label: 'All lowercase (Reject only)', value: 'allLowerReject' },
											{ label: 'All lowercase (With reason)', value: 'allLowerReason' },
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

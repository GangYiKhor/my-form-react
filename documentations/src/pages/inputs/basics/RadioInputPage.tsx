import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MyRadioInput,
	MySelectInput,
	MyTextInput,
	useMyForm,
} from '../../../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`<MyLabelInputPair arrangement="horizontal">
  <MyLabel for="text-id">Radio:</MyLabel>
  <MyRadioInput />
  <MyRadioInput />
</MyLabelInputPair>`;

type FormType = {
	id: string;
	name: string;
	prefix: string;
	suffix: string;
	value: { str: string; number: string };
	defaultValue: { str: string; number: string };
	onChange: 'alert';
	required: boolean;
	persistOnUnmount: boolean;
	noBorder: boolean;
	noBackground: boolean;
	disabled: boolean;
};

type ExampleFormType = { [key: string]: { str: string; number: string } };

export default function RadioInputPage() {
	const form = useMyForm<FormType>('radio_properties');
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
		if (propData.value) props.push(`value={${JSON.stringify(propData.value)}}`);
		if (propData.defaultValue) props.push(`defaultValue={${JSON.stringify(propData.defaultValue)}}`);
		if (propData.onChange) props.push(`onChange={(_, data) => alert(data)}`);
		if (propData.required) props.push('required');
		if (propData.persistOnUnmount) props.push('persistOnUnmount');
		if (propData.noBorder) props.push('noBorder');
		if (propData.noBackground) props.push('noBackground');
		if (propData.disabled) props.push('disabled');
		const combinedProps = props.join(' ');
		if (combinedProps.length < 60)
			sample = sample.replace('<MyRadioInput />', '<MyRadioInput ' + combinedProps + ' />');
		else sample = sample.replace('<MyRadioInput />', '<MyRadioInput\n    ' + props.join('\n    ') + '\n  />');

		const secondProps: string[] = [];
		secondProps.push(`id="undefined-radio"`);
		if (propData.name) secondProps.push(`name="${propData.name}"`);
		secondProps.push(`value={{"str":"UNDEFINED","number":-1}}`);
		const secondCombinedProps = secondProps.join(' ');
		if (secondCombinedProps.length < 60)
			sample = sample.replace('<MyRadioInput />', '<MyRadioInput ' + secondCombinedProps + ' />');
		else sample = sample.replace('<MyRadioInput />', '<MyRadioInput\n    ' + secondProps.join('\n    ') + '\n  />');

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
					<h1>My Checkbox Input</h1>
				</section>

				<section className="example">
					<MyForm<ExampleFormType> formId="example" onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair arrangement="horizontal">
							<MyLabel for="text-id">Radio:</MyLabel>
							<MyRadioInput
								id={propData.id}
								name={propData.name}
								prefix={propData.prefix}
								suffix={propData.suffix}
								value={propData.value}
								defaultValue={propData.defaultValue}
								onChange={propData.onChange ? (_, data) => alert(data) : undefined}
								required={propData.required}
								persistOnUnmount={propData.persistOnUnmount}
								noBorder={propData.noBorder}
								noBackground={propData.noBackground}
								disabled={propData.disabled}
							/>
							<MyRadioInput id="undefined-radio" name={propData.name} value={{ str: 'UNDEFINED', number: -1 }} />
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
								<code className="property-name">value</code>: Internal value when input is checked (Will be set to
								checked if manually updated to the same value using deepEqual)
							</li>
							<ul>
								<li>
									<MySelectInput
										id="value"
										name="value"
										placeholder="EMPTY"
										options={[
											{ label: 'One', value: { str: 'ONE', number: 1 } },
											{ label: 'Two', value: { str: 'TWO', number: 2 } },
											{ label: 'Three', value: { str: 'THREE', number: 3 } },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">defaultValue</code>: Default value of the input, change the field name
								to see the effect
							</li>
							<ul>
								<li>
									<MySelectInput
										id="defaultValue"
										name="defaultValue"
										placeholder="None (Default)"
										options={[
											{ label: 'One', value: { str: 'ONE', number: 1 } },
											{ label: 'Two', value: { str: 'TWO', number: 2 } },
											{ label: 'Three', value: { str: 'THREE', number: 3 } },
										]}
									/>
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

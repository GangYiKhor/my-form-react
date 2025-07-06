import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyComboBoxInput,
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MyPositiveNumberInput,
	MySelectInput,
	MySimpleComboBoxInput,
	MyTextInput,
	useMyForm,
} from '../../../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`<MyLabelInputPair>
  <MyLabel for="text-id">Combo Box:</MyLabel>
  <MyComboBoxInput />
</MyLabelInputPair>`;

const OPTION_SET = {
	set_a: [
		{ str: 'ONE', value: 1 },
		{ str: 'TWO', value: 2 },
		{ str: 'THREE', value: 3 },
		{ str: 'FOUR', value: 4 },
		{ str: 'FIVE', value: 5 },
		{ str: 'SIX', value: 6 },
		{ str: 'SEVEN', value: 7 },
		{ str: 'EIGHT', value: 8 },
		{ str: 'NINE', value: 9 },
		{ str: 'TEN', value: 10 },
	],
	set_b: [
		{ str: 'ELEVEN', value: 11 },
		{ str: 'TWELVE', value: 12 },
		{ str: 'THIRTEEN', value: 13 },
		{ str: 'FOURTEEN', value: 14 },
		{ str: 'FIFTEEN', value: 15 },
		{ str: 'SIXTEEN', value: 16 },
		{ str: 'SEVENTEEN', value: 17 },
		{ str: 'EIGHTEEN', value: 18 },
		{ str: 'NINETEEN', value: 19 },
		{ str: 'TWENTY', value: 20 },
	],
};

const OPTION_ELEMENT = {
	sub: (data: { str: string; value: number }) => (
		<sub>
			{data.str} - {data.value}
		</sub>
	),
	h3: (data: { str: string; value: number }) => (
		<h3>
			{data.str} - {data.value}
		</h3>
	),
};

const OPTION_ELEMENT_STRING = {
	sub: '(data) => <sub>{data.str} - {data.value}</sub>',
	h3: '(data) => <h3>{data.str} - {data.value}</h3>',
};

type FormType = {
	id: string;
	name: string;
	placeholder: string;
	prefix: string;
	suffix: string;
	options: 'set_a' | 'set_b';
	optionKey: string;
	optionElement: 'sub' | 'h3';
	defaultValue: { str: string; value: number };
	optionRows: number;
	optionWidth: '150%' | '50%' | 300;
	filterOnType: boolean;
	required: boolean;
	persistOnUnmount: boolean;
	noBorder: boolean;
	noBackground: boolean;
	disabled: boolean;
	setUndefinedIfManualUpdateIsInvalid: boolean;
};

type ExampleFormType = { [key: string]: Date };

export default function ComboBoxPage() {
	const form = useMyForm<FormType>('combobox_properties');
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
		props.push(
			`options={${JSON.stringify(OPTION_SET[propData.options] ?? [])
				.replaceAll('[{', '[\n      {')
				.replaceAll('},{', '},\n      {')
				.replaceAll('}]', '}\n    ]')
				.replaceAll('","', '", "')
				.replaceAll('{"', '{ "')
				.replaceAll('},', ' },')
				.replaceAll(':', ': ')
				.replaceAll('}\n', ' }\n')}}`
		);
		props.push(`optionKey={(data) => data.${propData.optionKey ?? 'str'}}`);
		props.push(`optionElement={${OPTION_ELEMENT_STRING[propData.optionElement ?? 'sub']}}`);
		if (propData.defaultValue) props.push(`defaultValue={${propData.defaultValue}}`);
		if (propData.optionRows) props.push(`optionRows={${propData.optionRows}}`);
		if (propData.optionWidth)
			if (typeof propData.optionWidth === 'string') props.push(`optionWidth="${propData.optionWidth}"`);
			else props.push(`optionWidth={${propData.optionWidth}}`);
		if (propData.filterOnType) props.push('filterOnType');
		if (propData.required) props.push('required');
		if (propData.persistOnUnmount) props.push('persistOnUnmount');
		if (propData.noBorder) props.push('noBorder');
		if (propData.noBackground) props.push('noBackground');
		if (propData.disabled) props.push('disabled');
		if (propData.setUndefinedIfManualUpdateIsInvalid) props.push('setUndefinedIfManualUpdateIsInvalid');
		const combinedProps = props.join(' ');
		if (combinedProps.length < 60)
			sample = sample.replace('<MyComboBoxInput />', '<MyComboBoxInput ' + combinedProps + ' />');
		else sample = sample.replace('<MyComboBoxInput />', '<MyComboBoxInput\n    ' + props.join('\n    ') + '\n  />');

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
					<h1>My Combo Box Input</h1>
					<p>A customisable combo box input</p>
				</section>

				<section className="example">
					<MyForm<ExampleFormType> formId="example" onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair>
							<MyLabel for="text-id">Combo Box:</MyLabel>
							<MyComboBoxInput
								id={propData.id}
								name={propData.name}
								prefix={propData.prefix}
								suffix={propData.suffix}
								placeholder={propData.placeholder}
								defaultValue={propData.defaultValue}
								options={OPTION_SET[propData.options] ?? []}
								optionKey={(data) => data[propData.optionKey ?? 'str']}
								optionElement={OPTION_ELEMENT[propData.optionElement ?? 'sub']}
								optionRows={propData.optionRows}
								optionWidth={propData.optionWidth}
								filterOnType={propData.filterOnType}
								required={propData.required}
								persistOnUnmount={propData.persistOnUnmount}
								noBorder={propData.noBorder}
								noBackground={propData.noBackground}
								disabled={propData.disabled}
								setUndefinedIfManualUpdateIsInvalid={propData.setUndefinedIfManualUpdateIsInvalid}
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
								<code className="property-name">options</code>: A set of options for the combo box selection
							</li>
							<ul>
								<li>
									<MySelectInput
										id="options"
										name="options"
										placeholder="EMPTY"
										options={[
											{ label: 'Set A', value: 'set_a' },
											{ label: 'Set B', value: 'set_b' },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">optionKey</code>: A function to get the unique key of each option, is
								also the label of the option (Must return a string)
							</li>
							<ul>
								<li>
									<MySelectInput
										id="optionKey"
										name="optionKey"
										placeholder="EMPTY"
										options={[{ label: 'data.str', value: 'str' }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">optionElement</code>: A function to generate customised option element
								in selection dropdown
							</li>
							<ul>
								<li>
									<MySelectInput
										id="optionElement"
										name="optionElement"
										placeholder="EMPTY"
										options={[
											{ label: '<sub>value</sub>', value: 'sub' },
											{ label: '<h3>value</h3>', value: 'h3' },
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
									<MySimpleComboBoxInput
										id="defaultValue"
										name="defaultValue"
										options={Object.values(OPTION_SET)
											.flat()
											.map((value) => ({ label: value.str[0] + value.str.slice(1).toLocaleLowerCase(), value: value }))}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">optionRows</code>: Filter options on type instead of scrolling to the
								closest option
							</li>
							<ul>
								<li>
									<MyPositiveNumberInput id="optionRows" name="optionRows" placeholder="5 (Default)" />
								</li>
							</ul>

							<li>
								<code className="property-name">optionWidth</code>: Filter options on type instead of scrolling to the
								closest option
							</li>
							<ul>
								<li>
									<MySelectInput<string | number>
										id="optionWidth"
										name="optionWidth"
										placeholder="100% (Default)"
										options={[
											{ label: '150%', value: '150%' },
											{ label: '50%', value: '50%' },
											{ label: '300', value: 300 },
										]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">filterOnType</code>: Filter options on type instead of scrolling to the
								closest option
							</li>
							<ul>
								<li>
									<MySelectInput
										id="filterOnType"
										name="filterOnType"
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

							<li>
								<code className="property-name">setUndefinedIfManualUpdateIsInvalid</code>: Set value to undefined when
								manually updated value is not found in the options
							</li>
							<ul>
								<li>
									<MySelectInput
										id="setUndefinedIfManualUpdateIsInvalid"
										name="setUndefinedIfManualUpdateIsInvalid"
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

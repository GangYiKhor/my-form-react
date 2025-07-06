import hljs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';
import {
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MySelectInput,
	MyTextInput,
	useMyForm,
	useMyFullForm,
} from '../../../lib/main';

const SAMPLE =
	'' +
	`import { useState, useEffect } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MyTextInput, useMyForm, useMyFullForm } from 'my-form-react';

type FormType = {
  text: string;
}

export default function App() {
  const fullForm = useMyFullForm<{ my_form: FormType }>();
  const form = useMyForm<FormType>('my_form');
  const [data, setData] = useState<{ my_form: FormType }>();

  useEffect(() => {
    console.log(data);
  }, [data])

  return (
    <MyForm<FormType>
      %PROPS%
    >
      <MylabelInputPair fill>
        <MyLabel for="text-input" required>
          Text:
        </MyLabel>
        <MyTextInput id="text-input" name="text" type="text" required />
      </MylabelInputPair>

      <button id="submit" type="submit">
        Submit
      </button>
      <button id="trigger" type="submit">
        Trigger
      </button>
    </MyForm>
  )
}`;

const PLAIN_SAMPLE =
	'' +
	`<MyForm
  %PROPS%
>
  {/* COMPONENTS */}
</MyForm>`;

type FormType = {
	text: string;
};

type FormPropertiesType = {
	formId: string;
	onSubmit: boolean;
	action: string;
	method: string;
	disableNativeForm: boolean;
	persistOnUnmount: boolean;
	submitButtonId: string[];
	formRef: boolean;
};

export default function FormPage() {
	const fullForm = useMyFullForm<{ my_form: FormType; my_form_properties: FormPropertiesType }>();
	const form = useMyForm<FormPropertiesType>('my_form_properties');
	const dataRef = useRef<HTMLElement>(null);
	const exampleRef = useRef<HTMLElement>(null);
	const examplePlainRef = useRef<HTMLElement>(null);
	const [data, setData] = useState<{ my_form: FormType }>();
	const [plainSampleCode, setPlainSampleCode] = useState<string>(PLAIN_SAMPLE);
	const [sampleCode, setSampleCode] = useState<string>(SAMPLE);
	const propData = form.getFormData();

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		const indent = ' '.repeat(6);
		let code = SAMPLE;
		const props: string[] = [];
		props.push(`formId="${propData.formId ?? 'unknown_form'}"`);
		if (propData.formRef) props.push(`formRef={formRef}`);
		props.push(
			`onSubmit={() => {\n${indent + '  '}setData(fullForm.getFormData());${
				propData.onSubmit ? '\n' + indent + "  alert('Submitted');" : ''
			}\n${indent}}}`
		);
		if (propData.submitButtonId) props.push(`submitButtonId={['${propData.submitButtonId[0]}']}`);
		if (propData.action) props.push(`action="${propData.action}"`);
		if (propData.method) props.push(`action="${propData.method}"`);
		if (propData.disableNativeForm) props.push('disableNativeForm');
		if (propData.persistOnUnmount) props.push('persistOnUnmount');

		code = code.replace('%PROPS%', props.join('\n' + indent));
		setSampleCode(code);

		let plainCode = PLAIN_SAMPLE;
		plainCode = plainCode.replace('%PROPS%', props.map((s) => s.replaceAll(indent, '  ')).join('\n  '));
		setPlainSampleCode(plainCode);

		if (exampleRef.current && examplePlainRef.current) {
			delete exampleRef.current.dataset.highlighted;
			delete examplePlainRef.current.dataset.highlighted;
			hljs.highlightElement(exampleRef.current);
			hljs.highlightElement(examplePlainRef.current);
		}
	}, [propData]);

	useEffect(() => {
		if (dataRef.current) {
			delete dataRef.current.dataset.highlighted;
			hljs.highlightElement(dataRef.current);
		}
	}, [data]);

	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>My Form</h1>
					<p>
						Wrap the children in a <code>&lt;form&gt;</code> element and group all input field data into same form
						object. Providing both default form submission handler and a custom <code>onSubmit()</code> function handler
					</p>
				</section>

				<section className="example">
					<MyForm<FormType>
						formId={propData.formId ?? 'unknown_form'}
						onSubmit={() => {
							const { my_form_properties, ...data } = fullForm.getFormData();
							if (my_form_properties.onSubmit) alert('Submitted');
							setData(data);
						}}
						action={propData.action}
						method={propData.method}
						disableNativeForm={propData.disableNativeForm}
						persistOnUnmount={propData.persistOnUnmount}
						submitButtonId={propData.submitButtonId}
					>
						<MyLabelInputPair fill>
							<MyLabel for="text-input" required>
								Text:
							</MyLabel>
							<MyTextInput id="text-input" name="text" type="text" required />
						</MyLabelInputPair>

						<button id="submit" type="submit">
							Submit
						</button>
						<button id="trigger" type="submit">
							Trigger
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
							{plainSampleCode}
						</code>
					</pre>
				</section>

				<section>
					<h2>Sample Code</h2>
					<pre>
						<code ref={exampleRef} className="language-typescript">
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
								<code className="property-name">formId</code>: ID of the form
								<ul>
									<li>
										<MySelectInput
											id="formId"
											name="formId"
											placeholder="Empty"
											options={[
												{ label: 'Form A', value: 'form_a' },
												{ label: 'Form B', value: 'form_b' },
												{ label: 'Form C', value: 'form_c' },
											]}
											required
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">formRef</code>: Forward ref object for form element, useful for
								triggering submit/validate
								<ul>
									<li>
										<MySelectInput
											id="formRef"
											name="formRef"
											placeholder="No Ref"
											options={[{ label: 'formRef', value: true }]}
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">onSubmit</code>: Callback on form submission triggered by `
								<code>&lt;button type="submit"&gt;&lt;/button&gt;</code>` or `<code>form.submit()</code>`
								<ul>
									<li>
										<MySelectInput
											id="onSubmit"
											name="onSubmit"
											placeholder="Set data only"
											options={[{ label: 'Set & Alert Submitted', value: true }]}
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">action</code>: Native HTML submit action
								<ul>
									<li>
										<MySelectInput
											id="action"
											name="action"
											placeholder="No action"
											options={[{ label: 'Homepage', value: '/' }]}
										/>
									</li>
								</ul>
							</li>
							<li>
								<code className="property-name">method</code>: Native HTML submit method
								<ul>
									<li>
										<MySelectInput
											id="method"
											name="method"
											placeholder="No method"
											options={[
												{ label: 'GET', value: 'GET' },
												{ label: 'POST', value: 'POST' },
											]}
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">disableNativeForm</code>: Disable native HTML form submission (Always
								call <code>e.preventDefault()</code>)
								<ul>
									<li>
										<MySelectInput
											id="disableNativeForm"
											name="disableNativeForm"
											placeholder="Enabled (Default)"
											options={[{ label: 'Disabled', value: true }]}
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">persistOnUnmount</code>: Delete the form when unmount
								<ul>
									<li>
										<MySelectInput
											id="persistOnUnmount"
											name="persistOnUnmount"
											placeholder="Delete on unmount (Default)"
											options={[{ label: 'Persist', value: true }]}
										/>
									</li>
								</ul>
							</li>

							<li>
								<code className="property-name">submitButtonId</code>: If button's ID is not included, won't trigger
								submit
								<ul>
									<li>
										<MySelectInput
											id="submitButtonId"
											name="submitButtonId"
											placeholder="All button (Default)"
											options={[{ label: 'Exclude trigger button', value: ['submit'] }]}
										/>
									</li>
								</ul>
							</li>
						</ul>
					</MyForm>
				</section>
			</div>
		</div>
	);
}

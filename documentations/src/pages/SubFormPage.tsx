import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MySubForm, MyTextInput, useMyForm } from '../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`<MyForm formId='myform'>
  <MyLabelInputPair>
    <MyLabel for="text-1">Text 1:</MyLabel>
    <MyTextInput id="text-1" name="text_1" />
  </MyLabelInputPair>

  <MySubForm subFormId={subFormId}>
    <MyLabelInputPair>
      <MyLabel for="text-2">Text 2:</MyLabel>
      <MyTextInput id="text-2" name="text_2" />
    </MyLabelInputPair>
  </MySubForm>
</MyForm>`;

type FormType = {
	subFormId: string;
};

export default function SubFormPage() {
	const form = useMyForm<FormType>('subform_properties');
	const dataRef = useRef<HTMLElement>(null);
	const examplePlainRef = useRef<HTMLElement>(null);
	const propData = form.getFormData();
	const [sampleCode, setSampleCode] = useState<string>(PLAIN_SAMPLE);
	const [data, setData] = useState<{ [key: string]: any }>();
	if (!propData.subFormId) propData.subFormId = 'unknown_field';

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		const sample = PLAIN_SAMPLE.replace('{subFormId}', `"${propData.subFormId}"`);

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
					<h1>My Sub Form</h1>
					<p>
						A sub form will group all fields wrapped by the subform as one object as a nested form, useful for grouping
						fields or use it as a multiform instead of using multiple <code>&lt;MyForm&gt;</code> which requires
						multiple static <code>useMyForm()</code> hook, or <code>useMyFullForm()</code> which requires{' '}
						<code>formId</code> input for each call
					</p>
				</section>

				<section className="example">
					<MyForm formId="myform" onSubmit={(e, data) => setData(data)}>
						<MyLabelInputPair>
							<MyLabel for="text-1">Text 1:</MyLabel>
							<MyTextInput id="text-1" name="text_1" />
						</MyLabelInputPair>

						<MySubForm subFormId={propData.subFormId}>
							<MyLabelInputPair>
								<MyLabel for="text-2">Text 2:</MyLabel>
								<MyTextInput id="text-2" name="text_2" />
							</MyLabelInputPair>
						</MySubForm>

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
								<code className="property-name">subFormId</code>: Name of the subform
							</li>
							<ul>
								<li>
									<MyTextInput id="subFormId" name="subFormId" />
								</li>
							</ul>
						</ul>
					</MyForm>
				</section>
			</div>
		</div>
	);
}

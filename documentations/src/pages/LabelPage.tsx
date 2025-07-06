import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MySelectInput, MyTextInput, useMyForm } from '../../../lib/main';

const PLAIN_SAMPLE = `<MyLabelInputPair>
  <MyLabel>%CHILDREN%</MyLabel>
  <MyTextInput id="text-input" name="text" type="text" />
</MyLabelInputPair>`;

type FormType = {
	for: string;
	required: boolean;
	children: { element: string | React.ReactNode; str: string };
};

export default function LabelPage() {
	const form = useMyForm<FormType>('label_properties');
	const examplePlainRef = useRef<HTMLElement>(null);
	const propData = form.getFormData();
	const [sampleCode, setSampleCode] = useState<string>(PLAIN_SAMPLE);

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		let sample = PLAIN_SAMPLE;
		const props: string[] = [];
		if (propData.for) props.push(`for="${propData.for}"`);
		if (propData.required) props.push('required');
		if (props.length) sample = sample.replace('<MyLabel>', '<MyLabel ' + props.join(' ') + '>');
		sample = sample.replace('%CHILDREN%', propData.children?.str ?? '');
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
					<h1>My Label</h1>
					<p>
						A simple <code>&lt;label&gt;</code> wrapper providing required icon
					</p>
				</section>

				<section className="example">
					<MyForm<FormType> formId="example">
						<MyLabelInputPair>
							<MyLabel for={propData.for} required={propData.required}>
								{propData.children?.element ?? ''}
							</MyLabel>
							<MyTextInput id="text-input" name="text" type="text" />
						</MyLabelInputPair>
					</MyForm>
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
								<code className="property-name">for</code>: Equivalent to htmlFor
							</li>
							<ul>
								<li>
									<MySelectInput
										id="for"
										name="for"
										placeholder="Empty"
										options={[{ label: 'text-input', value: 'text-input' }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">required</code>: Show a required icon
							</li>
							<ul>
								<li>
									<MySelectInput
										id="required"
										name="required"
										placeholder="Not required (Default)"
										options={[{ label: 'Required', value: true }]}
									/>
								</li>
							</ul>

							<li>
								<code className="property-name">children</code>: Custom label children
							</li>
							<ul>
								<li>
									<MySelectInput<{ element: string | React.ReactNode; str: string }>
										id="children"
										name="children"
										placeholder="Empty"
										options={[
											{ label: 'Text:', value: { element: 'Text:', str: 'Text:' } },
											{
												label: 'Bold Text:',
												value: { element: <strong>Bold Text:</strong>, str: '<strong>Bold Text:</strong>' },
											},
										]}
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

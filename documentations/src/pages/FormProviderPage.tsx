import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyForm,
	MyFormProvider,
	MyLabel,
	MyLabelInputPair,
	MySelectInput,
	MyTextInput,
	useMyForm,
} from '../../../lib/main';

const DARK_MODE_EXPLANATION = {
	empty: 'Default disabled, all form components will use white theme',
	disabled: 'All form components will use white theme',
	class: 'If the form is wrapped by any element with "dark" class, it will use dark theme',
	browser: 'The form will use the theme of the browser',
};

const PLAIN_SAMPLE =
	'' +
	`<MyFormProvider>
  <div className="dark">
    <MyForm formId="provider">
      <MyLabelInputPair fill>
        <MyLabel for="text-input">Text:</MyLabel>
        <MyTextInput id="text-input" name="text" type="text" />
      </MyLabelInputPair>
    </MyForm>
  </div>
</MyFormProvider>`;

type FormType = {
	dark_mode: string;
};

export default function FormProviderPage() {
	const form = useMyForm<FormType>('provider_properties');
	const examplePlainRef = useRef<HTMLElement>(null);
	const propData = form.getFormData();
	const [sampleCode, setSampleCode] = useState<string>(PLAIN_SAMPLE);

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	useEffect(() => {
		let sample = PLAIN_SAMPLE;
		switch (propData.dark_mode) {
			case 'class':
			case 'browser':
			case 'disabled':
				sample = sample.replace('<MyFormProvider>', `<MyFormProvider darkMode="${propData.dark_mode}">`);
				break;
		}
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
					<h1>My Form Provider</h1>
					<p>
						Global context provider for form implementations, wrap your application with this provider to enable all
						form handlers
					</p>
				</section>

				<section
					className={
						'example ' + (propData.dark_mode === 'disabled' || propData.dark_mode === undefined ? 'white' : '')
					}
				>
					<MyFormProvider darkMode={propData.dark_mode as 'class'}>
						<MyForm<FormType> formId="example">
							<MyLabelInputPair fill>
								<MyLabel for="text-input">Text:</MyLabel>
								<MyTextInput id="text-input" name="text" type="text" />
							</MyLabelInputPair>
						</MyForm>
					</MyFormProvider>
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
								<code className="property-name">darkMode</code>: How form identify the theme.
							</li>
							<ul>
								<li>
									<MySelectInput
										id="dark-mode"
										name="dark_mode"
										placeholder="Disabled (Default)"
										options={[
											{ label: 'Disabled', value: 'disabled' },
											{ label: 'Class', value: 'class' },
											{ label: 'Browser', value: 'browser' },
										]}
									/>
								</li>
								<li>{DARK_MODE_EXPLANATION[propData.dark_mode ?? 'empty']}</li>
							</ul>
						</ul>
					</MyForm>
				</section>
			</div>
		</div>
	);
}

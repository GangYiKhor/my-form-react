import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef, useState } from 'react';
import {
	MyDateRangeInput,
	MyDateRangeType,
	MyForm,
	MyLabel,
	MyLabelInputPair,
	MyTextInput,
	useMyForm,
} from '../../lib/main';

const InstallCommand = `npm install my-form-react # or yarn add my-form-react`;

const QuickStartSample = `// main.tsx
import { MyFormProvider } from 'my-form-react';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <MyFormProvider>
      <App />
    </MyFormProvider>
  </StrictMode>
);

// App.tsx
import { useState, useEffect } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MyTextInput, MyDateRangeInput, useMyForm, type MyDateRangeType } from 'my-form-react';

type FormType = {
  text: string;
  date: MyDateRangeType;
}

export default function App() {
  const form = useMyForm<FormType>('my_form');
  const [data, setData] = useState<FormType>();

  useEffect(() => {
    console.log(data);
    console.log(form.getFormData());
  }, [data])

  return (
    <MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
      <MyLabelInputPair fill>
        <MyLabel for="text-input" required>
          Text:
        </MyLabel>
        <MyTextInput id="text-input" name="text" type="text" required />
      </MyLabelInputPair>

      <MyLabelInputPair fill>
        <MyLabel for="date" required>
          Date:
        </MyLabel>
        <MyDateRangeInput id="date" name="date" min={new Date('2015-05-15')} max={new Date('2035-05-15')} />
      </MyLabelInputPair>

      <button type="submit">Submit</button>
    </MyForm>
  )
}`;

type FormType = {
	text: string;
	date: MyDateRangeType;
};

export default function HomePage() {
	const dataRef = useRef<HTMLElement>(null);
	const form = useMyForm<FormType>('my_form');
	const [data, setData] = useState<Partial<FormType>>({});

	useEffect(() => {
		hljs.highlightAll();
	}, []);

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
					<h1>Get Started</h1>
					<p>
						Welcome to My Form React, a simple form library for React that simplifies building complex forms with
						built-in UI components, validation, and data handling functions. Whether you're building simple input forms
						or complex nested subforms, My Form React helps you do it faster and cleaner.
					</p>
				</section>

				<section>
					<h2>Features</h2>
					<ul>
						<li>All Basic Input Components</li>
						<li>Custom Date Range Input</li>
						<li>Combobox Inputs</li>
						<li>Subforms Support</li>
						<li>Form Handling Utilities</li>
						<li>Zero dependencies except React</li>
						<li>As small as 192 kB</li>
					</ul>
				</section>

				<section>
					<h2>Installation</h2>
					<pre>
						<code className="language-bash">{InstallCommand}</code>
					</pre>
				</section>

				<section>
					<h2>Quick Start</h2>
					<pre>
						<code>{QuickStartSample}</code>
					</pre>
				</section>

				<h2>Example</h2>
				<section className="example">
					<MyForm<FormType> formId={form.formId} onSubmit={(_, data) => setData(data)}>
						<MyLabelInputPair fill>
							<MyLabel for="text-input" required>
								Text:
							</MyLabel>
							<MyTextInput id="text-input" name="text" type="text" required />
						</MyLabelInputPair>
						<MyLabelInputPair fill>
							<MyLabel for="date" required>
								Date:
							</MyLabel>
							<MyDateRangeInput id="date" name="date" min={new Date('2015-05-15')} max={new Date('2035-05-15')} />
						</MyLabelInputPair>

						<button type="submit">Submit</button>
					</MyForm>
				</section>

				<section>
					<h2>Data</h2>
					<pre>
						<code ref={dataRef} className="language-json">
							{JSON.stringify(data, undefined, 2)}
						</code>
					</pre>
				</section>
			</div>
		</div>
	);
}

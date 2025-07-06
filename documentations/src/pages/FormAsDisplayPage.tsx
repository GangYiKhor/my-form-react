import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect, useRef } from 'react';
import { MyForm, MyLabel, MyLabelInputPair, MyNumberInput, MyTextInput, useMyForm } from '../../../lib/main';

const PLAIN_SAMPLE =
	'' +
	`function DisplayForm() {
  const form = useMyForm('display_form');

  async function fetchData() {
    const data = await postBackend();
    form.initialiseForm(data);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MyForm formId={form.formId}>
      <div className="flex">
        <MyLabelInputPair margin="0 8px 0">
          <MyLabel for="first_name">First Name:</MyLabel>
          <MyTextInput id="first_name" name="first_name" type="text" disabled />
        </MyLabelInputPair>

        <MyLabelInputPair margin="0 8px 0">
          <MyLabel for="last_name">Last Name:</MyLabel>
          <MyTextInput id="last_name" name="last_name" type="text" disabled />
        </MyLabelInputPair>

        <MyLabelInputPair margin="0 8px 0">
          <MyLabel for="age">Age:</MyLabel>
          <MyNumberInput id="age" name="age" disabled />
        </MyLabelInputPair>
      </div>

      <button type="button" onClick={fetchData}>
        Fetch Data
      </button>
    </MyForm>
  );
}
`;

async function postBackend() {
	return {
		first_name: 'John',
		last_name: 'Doe',
		age: 37,
	};
}

type FormType = {
	first_name: string;
	last_name: string;
	age: number;
};

export default function FormAsDisplayPage() {
	const form = useMyForm<FormType>('display_form');
	const examplePlainRef = useRef<HTMLElement>(null);

	async function fetchData() {
		const data = await postBackend();
		form.initialiseForm(data);
	}

	useEffect(() => {
		hljs.highlightAll();
	}, []);

	return (
		<div className="wrapper">
			<div className="documentations">
				<section>
					<h1>Form as Display</h1>
					<p>
						The form can be used for organising display data too, if you are happy with the predefined designs, you
						could utilise them to display the data you push to the form using <code>form.initialiseForm(data)</code> or{' '}
						<code>form.updateField({"{ name: 'fieldA', value: newValue }"})</code>, and set them to disabled to disallow
						user modification
					</p>
				</section>

				<section className="example">
					<MyForm formId={form.formId}>
						<div className="flex-div">
							<MyLabelInputPair margin="0 8px 0">
								<MyLabel for="first_name">First Name:</MyLabel>
								<MyTextInput id="first_name" name="first_name" type="text" disabled />
							</MyLabelInputPair>

							<MyLabelInputPair margin="0 8px 0">
								<MyLabel for="last_name">Last Name:</MyLabel>
								<MyTextInput id="last_name" name="last_name" type="text" disabled />
							</MyLabelInputPair>

							<MyLabelInputPair margin="0 8px 0">
								<MyLabel for="age">Age:</MyLabel>
								<MyNumberInput id="age" name="age" disabled />
							</MyLabelInputPair>
						</div>

						<button type="button" onClick={fetchData}>
							Fetch Data
						</button>

						<button type="button" onClick={form.resetForm}>
							Reset
						</button>
					</MyForm>
				</section>

				<section>
					<h2>Code</h2>
					<pre>
						<code ref={examplePlainRef} className="language-typescript">
							{PLAIN_SAMPLE}
						</code>
					</pre>
				</section>
			</div>
		</div>
	);
}
